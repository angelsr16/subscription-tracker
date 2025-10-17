import nodemailer from "nodemailer"


export const accountEmail = "angelsanchezromero09@gmail.com"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'angelsanchezromero09@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    }
});

export default transporter