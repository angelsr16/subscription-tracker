import redis from "../config/redis.js";
import { ValidationError } from "../middlewares/error.middleware.js";
import { sendEmail } from "./send-email.js";
import crypto from "crypto";

export const checkOtpRestrictions = async (
    email, next
) => {
    if (await redis.get(`otp_lock:${email}`)) {
        throw new ValidationError(
            "Account locked due to multiply failed attempts! Try again after 30 minutes."
        );
    }

    if (await redis.get(`otp_spam_lock:${email}`)) {
        throw new ValidationError(
            "Too many OTP requests! Please wait 1 hour before requesting again."
        );
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
        throw new ValidationError(
            "Please wait 1 minute before requesting a new OTP!"
        );
    }
};

export const trackOtpRequests = async (email, next) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // Lock for 1 hour
        throw new ValidationError(
            "Too many OTP requests! Please wait 1 hour before requesting again"
        );
    }

    await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); // Track requests for 1 hour
};

export const sendOtp = async (
    name, email, template
) => {
    const otp = crypto.randomInt(1000, 9999).toString();

    await sendEmail(email, "Verify Your Email", template, { name, otp });
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (email, otp, next) => {
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
        throw new ValidationError("Invalid or expired OTP!");
    }

    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

    if (storedOtp !== otp) {
        if (failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // Lock for 30 minutes
            await redis.del(`otp:${email}`, failedAttemptsKey);
            throw new ValidationError(
                "Too many failed attempts!. Your account is locked for 30 minutes"
            );
        }

        await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
        throw new ValidationError(
            `Incorrect OTP. ${2 - failedAttempts} attempts left`
        );
    }

    await redis.del(`otp:${email}`, failedAttemptsKey);
};