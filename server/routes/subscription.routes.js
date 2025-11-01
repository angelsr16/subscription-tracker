import { Router } from "express";
import { cancelSubscription, createSubscription, deleteSubscription, getSubscriptionDetails, getUpcomingRenewalDates, getUserSubscriptions, reactivateSubscription } from "../controllers/subscription.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/upcoming-renewals", getUpcomingRenewalDates)

subscriptionRouter.get("/:id", isAuthenticated, getSubscriptionDetails);

subscriptionRouter.post("/", isAuthenticated, createSubscription);

subscriptionRouter.delete("/:id", isAuthenticated, deleteSubscription);

subscriptionRouter.get("/user/:id", isAuthenticated, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", isAuthenticated, cancelSubscription);

subscriptionRouter.put("/:id/reactivate", isAuthenticated, reactivateSubscription)

// TODO: Implement update subscription data
subscriptionRouter.put("/:id", (req, res) => {
    res.send({ title: "UPDATE subscription" })
});


export default subscriptionRouter;