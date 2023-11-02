import User from "../models/user.model";
import bcrypt from "bcrypt";
import { RequestHandler, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { JwtPayload } from 'jsonwebtoken'
import { UserAttribute } from "../interfaces/user.interface";
import { Content } from "mailgen";
import mailGenerator from "../helpers/mail-generator";
import mailSender from "../middlewares/mailservice";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../middlewares/cloudinary";
import qrcode from "qrcode";
import {authenticator} from "otplib";
import { genToken } from "../utils/jsonwebtoken";
import { twoFaAuth } from "../utils/authenticator";


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
    // console.log(generateToken);


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


export const verifyUserSignUp: RequestHandler = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const theVerificationCode = await User.findOne({ where: { $verifyCode$: verificationCode } });
    if (!theVerificationCode) {
      return res.status(400).json({
        message: "Invalid verification code!"
      })
    }

    theVerificationCode.isVerified = true;
    await theVerificationCode.save();

    return res.status(201).json({
      message: "Success!",
    })

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: "Failed",
    })
  }
};


export const uploadProfileImage: RequestHandler = async (req, res) => {
  try {
    const token = req.params.token;
    // check if an image was uploaded!
    const file = req.files?.image as UploadedFile[];
    if (!file) {
      return res.status(400).json({
        message: 'No file Uploaded!'
      })
    }
    const decodedValues = jwt.decode(token);
    console.log(decodedValues);


    const uploads = Array.isArray(file) ? file : [file];
    for (const file of uploads) {
      const result = await cloudinary.uploader.upload(file.tempFilePath);


      const uploadFileData = {
        image: result.secure_url,
        cloudId: result.public_id
      }

      await User.update(uploadFileData, { where: { token } });
      return res.status(200).json({
        message: "Upload Success!"
      })
    };
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: "Failed",
    })
  }
}
  
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
          instructions: `Here's the link to reset your password below (Note: this link will expire in 5(five) minutes):`,
          button: {
            color: '#673ee6',
            text: "Reset Password",
            link: `localhost:1000/api/v1/user/resetPassword/${passwordToken}`,
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
  try {
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
  res.status(200).json({
    message :"Password Updated Successfully",
  })

   } catch (error:any) {
    res.status(500).json({
      message:error.message,
      status :"Failed"
    })
  }
}

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const {email, phoneNumber, userName, password, code} = req.body
    let user;
    let checkPassword = false;

    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phoneNumber) {
      user = await User.findOne({ where: { phoneNumber } });
    } else if (userName) {
      user = await User.findOne({ where: { userName } });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "Failed!",
      });
    }else{
    checkPassword = bcrypt.compareSync(password, user.password)
    if(checkPassword){
      if(!user.isVerified){
        const verificationCode =  genToken(user.userId, "1d")
        const emailContent: Content = {
          body: {
            name: `${user.userName}`,
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
          email: user.email,
          subject: "Kindly verify!",
          message: emailText,
          html: emailBody
        })
        res.status(401).json({
          message: "please check mail and verify your account"
        })
      }else if(user.twoFA_enabled){
         const verified = authenticator.check(code, user.twoFA_secret!);
        if (verified) {
          const token = genToken(user.userId, "1d")
        res.status(200).json({
          token: token,
          message: "login successful"
        })
        }else{
          res.status(401).json({message: "Please enter two factor authorization code "})
        }
      }else{
        const token = genToken(user.userId, "1d")
        res.status(200).json({
          token: token,
          message: "login successful"
        })
      }
    }else{
      res.status(401).json({message: "invalid password"})
    }
    }     
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: "Failed!"
    })
  }
}


export const qrcodeimage: RequestHandler = async (req: Request, res: Response) => {
  try {
   
    const user = await User.findOne({ where: { userId: req.user?.userId } });
    if (user) {
      const secret = authenticator.generateSecret();
      const uri = authenticator.keyuri(user.email, "social-media", secret);
    
      const image = await qrcode.toDataURL(uri);

      // Update the user's two-factor authentication secret
      user.set({
        twoFA_secret: secret
      }) // Assuming you have a twofa property in your User model
      await user.save();

      res.status(200).json({
        success: true,
        image,
      });
    } else {
      res.status(404).json({
        message: "User not found",
        status: "Failed!",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: "Failed!",
    });
  }
};

export const enableTwoFa: RequestHandler = async (req: Request, res) => {
  try {
    //const { code } = req.body;
    const user = await User.findOne({where: {userId: req.user?.userId}});
    const verified = await twoFaAuth(req);
    if (verified) {
      user?.set({
        twoFA_enabled: true,
      })
      await user?.save();
      res.status(200).json({
        message: "success",
      });
    } else {
      res.status(401).json({
        message: "invalid code, try again",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: "Failed!"
    })
  }
}


