import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { Users } from "./mongoose.js";
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rayyan.buisness@gmail.com",
    pass: "Tanviralam1",
  },
});

const mailOptions = (to, alert) => {
  return {
    from: "rayyan.buisness@gmail.com",
    to: to,
    subject: `${
      alert?.type
    } alert ${alert?.ticker?.exchange.toUpperCase()}:${alert?.ticker.ticker.toUpperCase()}`,
    text: `${
      alert?.type
    } alert for ${alert?.ticker?.exchange.toUpperCase()}:${alert?.ticker.ticker.toUpperCase()}. The price is $${
      alert?.price
    }`,
  };
};

export { transporter, mailOptions };
