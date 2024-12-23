import { createTransport } from "nodemailer";
import envUtil from "./env.util.js";

const { GOOGLE_EMAIL, GOOGLE_PASSWORD, MAIL_HOST, MAIL_PORT } = envUtil;

const transport = createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: true,
    auth: {
        user: GOOGLE_EMAIL,
        pass: GOOGLE_PASSWORD
    }
});

const sendVerifyEmail = async ({ to, verifyCode }) => {
    try {
        await transport.verify();
        await transport.sendMail({
            from: GOOGLE_EMAIL,
            to,
            subject: "Please verify your email",
            html:  `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Welcome to Our Service!</h2>
                <p style="color: #555;">Thank you for signing up. Please verify your email address by clicking the button below:</p>
                <a href="${envUtil.BASE_URL}/verify?code=${verifyCode}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Verify Email</a>
                <p style="color: #555;">If you did not sign up for this account, you can ignore this email.</p>
                <p style="color: #555;">Best regards,<br>Ecommerce</p>
            </div>
        `
        });
        
    } catch (error) {
        throw new Error(error);   
    }
}

export { sendVerifyEmail };