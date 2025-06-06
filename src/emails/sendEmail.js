import nodemailer from "nodemailer";
import { createResetEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates";

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  try {
    // Use await to send the email and wait for the result
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.log(error);
  }
};

export const sendWelcomeEmail = ({ fullName, clientUrl, email }) => {
  const subject = "Welcome to Torii Gates";
  const html = createWelcomeEmailTemplate(fullName, clientUrl);

  sendEmail({ to: email, subject, html });
};

export const sendResetPasswordEmail = ({ fullName, resetUrl, email }) => {
  const subject = "Reset Password";
  html = createResetEmailTemplate(fullName, resetUrl);

  sendEmail({ to: email, subject, html });
};

