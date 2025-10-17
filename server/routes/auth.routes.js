import { Router } from "express";
import { userRegistration, verifyUser, loginUser, getUser, refreshToken } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/user-registration", userRegistration);
authRouter.post("/verify-user", verifyUser);
authRouter.post("/login-user", loginUser);
authRouter.post("/refresh-token", refreshToken)

authRouter.get("/logged-in-user", isAuthenticated, getUser);

export default authRouter;