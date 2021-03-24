require('dotenv').config();
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: `${process.env.GMAIL_USER}`,
        pass: `${process.env.GMAIL_PASS}`,
    },
});