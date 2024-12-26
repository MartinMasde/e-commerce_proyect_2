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
        await transport.verify()
        await transport.sendMail({
            from: GOOGLE_EMAIL,
            to,
            subject: "Please verify Ecommerce account",
            html:  `
                <h1 style="color: red">Welcome to ECOMMERCE</h1>
                <h2>Verify your email</h2>
                <p>Verify code: ${verifyCode}</p>
        `,
        });
        
    } catch (error) {
        throw error;   
    }
}

// funcion para resetear el password
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

