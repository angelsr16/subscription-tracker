import { NotFoundError, ValidationError } from "../middlewares/error.middleware.js";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendEmail } from "../utils/send-email.js"

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json({ success: true, data: { subscription } })
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if user is the same as the one in the token
        if (req.user.id !== req.params.id) {
            return next(new ValidationError("You are not the owner of this account"))
        }

        const subscriptions = await Subscription.find({ user: req.params.id })

        res.status(200).json({ success: true, data: subscriptions })
    } catch (error) {
        next(error);
    }
}

export const getSubscriptionDetails = async (req, res, next) => {
    try {

        const subscription = await Subscription.findOne({ _id: req.params.id }).populate('user', "_id")

        if (!subscription) {
            return next(new NotFoundError("Subscription not found"))
        }

        if (subscription.user._id.toString() !== req.user.id) {
            return next(new ValidationError("You are not the owner of this account"))
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({ _id: req.params.id }).populate('user', "_id")

        if (!subscription) {
            return next(new NotFoundError("Subscription not found"));
        }

        if (subscription.user._id.toString() !== req.user.id) {
            return next(new ValidationError("You are not the owner of this account"))
        }

        await Subscription.findOneAndDelete({ _id: req.params.id });

        res.status(200).json({ success: true, message: `Subscription ${subscription.name} deleted successfully` })
    } catch (error) {
        next(error);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({ _id: req.params.id }).populate('user', "_id")

        if (!subscription) {
            return next(new NotFoundError("Subscription not found"))
        }

        if (subscription.user._id.toString() !== req.user.id) {
            return next(new ValidationError("You are not the owner of this account"))
        }

        await Subscription.updateOne({ _id: req.params.id }, { $set: { status: 'cancelled' } });

        res.status(200).json({ success: true, message: `Subscription ${subscription.name} cancelled successfully` })
    } catch (error) {
        next(error);
    }
}

export const getUpcomingRenewalDates = async (req, res, next) => {
    try {

        const today = dayjs()
        const targetDays = [0, 1, 3, 5, 7].map(days => today.add(days, 'day').toDate().setUTCHours(0, 0, 0, 0));

        const upcomingRenewals = await Subscription.find({
            renewalDate: { $in: targetDays }
        }).select('name renewalDate startDate').populate('user', 'name email')

        res.status(200).json({ success: true, data: upcomingRenewals })

        upcomingRenewals.map((renewals) => {
            console.log(renewals);
        })

        // 📨 Continue background work (non-blocking aws lambda call)
        process.nextTick(async () => {
            for (const subscription of upcomingRenewals) {
                const daysLeft = subscription.renewalDate.diff(today, 'day');
                try {
                    await sendEmail(subscription.user.email, "Reminder", "reminder-mail", {
                        name: subscription.user.name,
                        subscriptionName: subscription.name,
                        renewalDate: subscription.renewalDate,
                        daysLeft: daysLeft
                    });
                    console.log(`Email sent to ${subscription.user.email}`);
                } catch (err) {
                    console.error(`Failed to send email to ${subscription.user.email}`, err);
                }
            }
        });
    } catch (error) {
        next(error);
    }
}