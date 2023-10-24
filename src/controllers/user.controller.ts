import User from "../models/user.model";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { UserAttribute } from "../interfaces/user.interface";
import { Content } from "mailgen";
import mailGenerator from "../helpers/mail-generator";
import mailSender from "../middlewares/mailservice";




export const signUpUser: RequestHandler = async (req, res) => {
  try {
    const { fullName, userName, password, email, phoneNumber } = req.body;

    const saltPassword = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltPassword);

    // generate a verification code 
    const verifyToken = (): string => {
      const digits = '0123456789';
      let uniqueNumber = '';

      while (uniqueNumber.length < 6) {
        const randomDigit = digits.charAt(Math.floor(Math.random() * digits.length));

        if (!uniqueNumber.includes(randomDigit)) {
          uniqueNumber += randomDigit;
        }
      }

      return uniqueNumber;
    };
    const verificationCode = verifyToken();

    // create an instance record of a user 
    const userData: UserAttribute = {
      userId: uuidv4(),
      userName,
      fullName,
      email,
      password: hashPassword,
      phoneNumber,
      verifyCode: verificationCode
    }
    const userProfile = new User(userData);

    // generate token for each user that signs up!
    const generateToken = await jwt.sign({
      userId: userData.userId,
      userName: userData.userName
    }, <string>process.env.JWT_SECRET_TOKEN, {
      expiresIn: "2d"
    });
    userProfile.token = generateToken;
    await userProfile.save();

    //send the verification code to the user email address

    const emailContent: Content = {
      body: {
        name: `${userProfile.userName}`,
        intro: ` Welcome to Social-commerce! Please verify your account using this code:`,
        action: {
          instructions: `Here's the code to verify your account below:`,
          button: {
            color: '#673ee6',
            text: 'Verify Account',
            link: verificationCode,
          },
        },
        outro: 'If you did not sign up for our site, you can ignore this email.',
      },
    };
    const emailBody = mailGenerator.generate(emailContent);
    const emailText = mailGenerator.generatePlaintext(emailContent);

    const mailInstance = new mailSender();
    mailInstance.createConnection();
    mailInstance.mail({
      from: {
        address: process.env.EMAIL
      },
      email: userProfile.email,
      subject: "Kindly verify!",
      message: emailText,
      html: emailBody
    })

    //send a response
    res.status(201).json({
      message: 'Success!'
    })

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: "Failed!"
    })
  }
};