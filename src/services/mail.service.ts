import { createTransport } from "nodemailer";
import { UserModel } from "../models/user.model";
import { generateToken, verifyToken } from "../utils/jwt.util";

const VERIFY_SUBJECT = "Verify your email";
const VERIFY_TEXT = (TOKEN: string) =>
  `Your verification link, f you don't know what it's about, don't open it.
http://${process.env.HOST}:${process.env.PORT}/users/register/verify/${TOKEN}`;

export function sendVerifyEmail(user: UserModel) {
  const verifyToken = generateToken(user, "verify");
  return sendEmail(user.email, VERIFY_SUBJECT, VERIFY_TEXT(verifyToken));
}

export function verifyEmailToken(token: string) {
  return verifyToken(token, "verify");
}

async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_LOGIN,
      to: email,
      subject: subject,
      text: text,
    });
    return true;
  } catch (error) {
    console.log("email not sent");
    console.log(error);
    return false;
  }
}
