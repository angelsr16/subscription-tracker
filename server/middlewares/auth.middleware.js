import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies["access_token"];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized! Token Missing" })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized! Invalid token" });
        }

        const user = await User.findOne({ _id: decoded.id }).select("_id name email")

        if (!user) {
            return res.status(401).json({ message: "Account not found!" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Unauthorized! Token expired or invalid" });
    }
}