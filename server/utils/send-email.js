import ejs from "ejs";
import path from "path";
import transporter from "../config/nodemailer.js";

// Render an EJS email template
const renderEmailTemplate = async (templateName, data) => {
    const templatePath = path.join(
        process.cwd(),
        "utils",
        "email-templates",
        `${templateName}.ejs`
    );

    return ejs.renderFile(templatePath, data);
};

// Send email using nodemailer
export const sendEmail = async (to, subject, templateName, data) => {
    try {
        const html = await renderEmailTemplate(templateName, data);

        await transporter.sendMail({
            from: `<${process.env.SMTP_USER}`,
            to,
            subject,
            html,
        });
        return true;
    } catch (err) {
        console.log("Error sending email", err);
        return false;
    }
};
