import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { ValidationError, AuthError } from "../middlewares/error.middleware.js";
import { checkOtpRestrictions, trackOtpRequests, sendOtp, verifyOtp } from "../utils/auth.helper.js";
import { setCookie } from "../utils/cookies.js";

export const userRegistration = async (req, res, next) => {

    try {
        const { name, email } = req.body;

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return next(new ValidationError("User already exist with this email"))
        }

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "user-activation-mail");

        res.status(200).json({
            message: "OTP sent to email. Please verify your account",
        });
    } catch (error) {
        return next(error);
    }
}

export const verifyUser = async (req, res, next) => {
    try {
        const { email, otp, password, name } = req.body;

        if (!email || !otp || !password || !name) {
            return next(new ValidationError("All fields are required!"));
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new ValidationError("User already exists with this email!"));
        }

        await verifyOtp(email, otp, next);

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (error) {
        return next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Email and password are required!"));
        }

        const user = await User.findOne({ email });

        if (!user) {
            return next(new AuthError("User doesn't exist"));
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new AuthError("Invalid email or password"));
        }

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        // Generate access and refresh token
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // Store the refresh and access token in httpOnly secure cookie
        setCookie(res, "refresh_token", refreshToken);
        setCookie(res, "access_token", accessToken);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });

    } catch (error) {
        return next(error);
    }
}

export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies["refresh_token"];

        if (!refreshToken) {
            return new ValidationError("Unauthorized! No refresh token.");
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        if (!decoded || !decoded.id) {
            return new AuthError("Forbidden! Invalid refresh token");
        }

        const user = await User.findOne({ _id: decoded.id })

        if (!user) {
            return new AuthError("Forbidden! User not found");
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        setCookie(res, "access_token", newAccessToken);

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = req.user;

        res.status(201).json({
            success: true,
            user,
        });

    } catch (error) {
        return next(error);
    }
}