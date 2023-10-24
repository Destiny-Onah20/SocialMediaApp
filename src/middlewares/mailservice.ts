import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import mailInterface from "../interfaces/mail.interface";



export default class mailSender {
  private static instance: mailSender
  private transporter: nodemailer.Transporter

  static getInstance() {
    if (!mailSender.instance) {
      mailSender.instance = new mailSender()
    }
    return mailSender.instance
  };
  // public emailTemplate = fs.readFileSync('emailTemplate.hbs', 'utf8');


  async createConnection() {

    this.transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    })

    try {
      await this.transporter.verify();
      // console.log("MailSender connection established successfully.");
    } catch (error) {
      // console.error("Error establishing MailSender connection:", error);
    }
  };
  async mail(Option: mailInterface) {
    const mailOption = {
      from: {
        name: "Social-commerce",
        address: <string>process.env.EMAIL
      },
      to: Option.email,
      subject: Option.subject,
      text: Option.message,
      html: Option.html
    }
    await this.transporter.sendMail(mailOption);

  }
  getTransporter() {
    return this.transporter;
  }
}


