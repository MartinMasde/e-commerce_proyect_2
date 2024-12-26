import { createTransport } from "nodemailer";
import envUtil from "./env.util.js";

const { GOOGLE_EMAIL, GOOGLE_PASSWORD, MAIL_HOST, MAIL_PORT } = envUtil;

const transport = createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true,
  auth: {
    user: GOOGLE_EMAIL,
    pass: GOOGLE_PASSWORD,
  },
});
// Función para enviar email de verificación de cuenta
const sendVerifyEmail = async ({ to, verifyCode }) => {
  try {
    await transport.verify();
    await transport.sendMail({
      from: GOOGLE_EMAIL,
      to,
      subject: "Please verify Ecommerce account",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Welcome to our Ecommerce!</h2>
                <p style="color: #555;">Thank you for signing up. Please verify your email address by pasting the following code into the modal:</p>
                <p> Verify code: ${verifyCode}</p>
                <p style="color: #555;">If you did not sign up for this account, you can ignore this email.</p>
                <p style="color: #555;">Best regards,<br>Ecommerce</p>
            </div>`,
    });
  } catch (error) {
    throw error;
  }
};

// Funcion para resetear el password
// const sendResetPasswordEmail = async ({ to, resetCode }) => {
//     try {
//         await transport.verify()
//         await transport.sendMail({
//             from: GOOGLE_EMAIL,
//             to,
//             subject: "Reset your password",
//             html:  `
//                 <h1 style="color: red">Reset your password</h1>
//                 <p>Reset code: ${resetCode}</p>
//         `,
//         });

//     } catch (error) {
//         throw error;
//     }
// }

export { sendVerifyEmail };
