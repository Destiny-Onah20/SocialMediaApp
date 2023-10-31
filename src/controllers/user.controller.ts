import User from "../models/user.model";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { JwtPayload } from 'jsonwebtoken'
import { UserAttribute } from "../interfaces/user.interface";
import { Content } from "mailgen";
import mailGenerator from "../helpers/mail-generator";
import mailSender from "../middlewares/mailservice";




export const signUpUser: RequestHandler = async (req, res) => {
  console.log('userProfile');

  try {
    const { fullName, userName, password, email, phoneNumber } = req.body;

    //validate email for existence
    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail) {
      return res.status(400).json({
        message: "Email already taken!"
      })
    }
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
    const generateToken = jwt.sign({
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
            text: verificationCode,
            link: "#",
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

export const forgotPassword: RequestHandler = async (req, res)=>{
  try {
    const {email} = req.body

    //validate email for existence
    const checkEmail = await User.findOne({ where: { email } });
    if (!checkEmail) {
      return res.status(404).json({
        message: "Email not found"
      })
    }

    // generate password token
    const passwordToken = jwt.sign({
      userId : checkEmail.userId,
      userName : checkEmail.userName,
      email : checkEmail.email
    }, <string>process.env.JWT_SECRET_TOKEN, {
      expiresIn: "1d"
    })


    //send the password resest link to the user email address

    const emailContent: Content = {
      body: {
        name: email,
        intro: ` Welcome to Social-commerce! Please click on the link to reset your password:`,
        action: {
          instructions: `Here's the link to reset your password below:`,
          button: {
            color: '#673ee6',
            text: "Note: This link will expire in 5(five) minutes",
            link: "#",
          },
        },
        outro: 'If you did not make this request, you can ignore this email.',
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
      email: checkEmail.email,
      subject: "Kindly verify!",
      message: emailText,
      html: emailBody
    })


    res.status(200).json({
      message: 'Success!',
      data : passwordToken
    })
  } catch (error:any) {
    res.status(500).json({
      message:error.message,
      status :"Failed"
    })
  }
}


export const resetPassword :RequestHandler = async (req,res)=>{
  const {token} = req.params
  const {password} = req.body

  interface UserPayload {
    userId : string;
    email : string;
    userName : string;
  }
  
  const userPayload : jwt.JwtPayload | any = jwt.verify(
    token,
    <string>process.env.JWT_SECRET_TOKEN,
    (err, data)=>{
      if(err) return res.json("The password reset link has expired")
      else return data
      
    }
  )

  const validUserPayload = userPayload as UserPayload;


    const userID = validUserPayload.userId
    const email = validUserPayload.email
    console.log(email);
    

    //validate email for existence
  const checkEmail = await User.findOne({ where: { email } });
  if (!checkEmail) {
    return res.status(404).json({
      message: "Email not found"
    })
  }

  const saltPassword = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, saltPassword);

  checkEmail.password = hashPassword
  await checkEmail.save()

   
  

}