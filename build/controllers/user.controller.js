"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.signUpUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_generator_1 = __importDefault(require("../helpers/mail-generator"));
const mailservice_1 = __importDefault(require("../middlewares/mailservice"));
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('userProfile');
    try {
        const { fullName, userName, password, email, phoneNumber } = req.body;
        //validate email for existence
        const checkEmail = yield user_model_1.default.findOne({ where: { email } });
        if (checkEmail) {
            return res.status(400).json({
                message: "Email already taken!"
            });
        }
        const saltPassword = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, saltPassword);
        // generate a verification code 
        const verifyToken = () => {
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
        const userData = {
            userId: (0, uuid_1.v4)(),
            userName,
            fullName,
            email,
            password: hashPassword,
            phoneNumber,
            verifyCode: verificationCode
        };
        const userProfile = new user_model_1.default(userData);
        // generate token for each user that signs up!
        const generateToken = jsonwebtoken_1.default.sign({
            userId: userData.userId,
            userName: userData.userName
        }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: "2d"
        });
        userProfile.token = generateToken;
        yield userProfile.save();
        //send the verification code to the user email address
        const emailContent = {
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
        const emailBody = mail_generator_1.default.generate(emailContent);
        const emailText = mail_generator_1.default.generatePlaintext(emailContent);
        const mailInstance = new mailservice_1.default();
        mailInstance.createConnection();
        mailInstance.mail({
            from: {
                address: process.env.EMAIL
            },
            email: userProfile.email,
            subject: "Kindly verify!",
            message: emailText,
            html: emailBody
        });
        //send a response
        res.status(201).json({
            message: 'Success!'
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed!"
        });
    }
});
exports.signUpUser = signUpUser;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        //validate email for existence
        const checkEmail = yield user_model_1.default.findOne({ where: { email } });
        if (!checkEmail) {
            return res.status(404).json({
                message: "Email not found"
            });
        }
        // generate password token
        const passwordToken = jsonwebtoken_1.default.sign({
            userId: checkEmail.userId,
            userName: checkEmail.userName
        }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: "5m"
        });
        //send the password resest link to the user email address
        const emailContent = {
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
        const emailBody = mail_generator_1.default.generate(emailContent);
        const emailText = mail_generator_1.default.generatePlaintext(emailContent);
        const mailInstance = new mailservice_1.default();
        mailInstance.createConnection();
        mailInstance.mail({
            from: {
                address: process.env.EMAIL
            },
            email: checkEmail.email,
            subject: "Kindly verify!",
            message: emailText,
            html: emailBody
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.forgotPassword = forgotPassword;
