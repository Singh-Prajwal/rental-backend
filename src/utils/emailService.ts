// src/utils/emailService.ts
import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: MailOptions) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: true,
    port: parseInt(process.env.EMAIL_PORT || "2525"),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("transporter", transporter);
  // 2. Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  console.log("mailOptions", mailOptions);

  await transporter.sendMail(mailOptions);
};
