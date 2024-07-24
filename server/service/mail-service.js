import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendActivationMessage = async (to, link) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Activation account on ${process.env.API_URL}`,
    text: "",
    html: `
            <div>
                  <h1>For activation account click on link</h1>
                  <a href="${link}">${link}</a>
            </div>
            `,
  });
};
