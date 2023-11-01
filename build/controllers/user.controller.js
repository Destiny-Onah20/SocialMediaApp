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
exports.enableTwoFa = exports.qrcodeimage = exports.loginUser = exports.resetPassword = exports.forgotPassword = exports.uploadProfileImage = exports.verifyUserSignUp = exports.signUpUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_generator_1 = __importDefault(require("../helpers/mail-generator"));
const mailservice_1 = __importDefault(require("../middlewares/mailservice"));
const cloudinary_1 = __importDefault(require("../middlewares/cloudinary"));
const qrcode_1 = __importDefault(require("qrcode"));
const otplib_1 = require("otplib");
const jsonwebtoken_2 = require("../utils/jsonwebtoken");
const authenticator_1 = require("../utils/authenticator");
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
        // console.log(generateToken);
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
const verifyUserSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verificationCode } = req.body;
        const theVerificationCode = yield user_model_1.default.findOne({ where: { $verifyCode$: verificationCode } });
        if (!theVerificationCode) {
            return res.status(400).json({
                message: "Invalid verification code!"
            });
        }
        theVerificationCode.isVerified = true;
        yield theVerificationCode.save();
        return res.status(201).json({
            message: "Success!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed",
        });
    }
});
exports.verifyUserSignUp = verifyUserSignUp;
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.params.token;
        // check if an image was uploaded!
        const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
        if (!file) {
            return res.status(400).json({
                message: 'No file Uploaded!'
            });
        }
        const decodedValues = jsonwebtoken_1.default.decode(token);
        console.log(decodedValues);
        const uploads = Array.isArray(file) ? file : [file];
        for (const file of uploads) {
            const result = yield cloudinary_1.default.uploader.upload(file.tempFilePath);
            const uploadFileData = {
                image: result.secure_url,
                cloudId: result.public_id
            };
            yield user_model_1.default.update(uploadFileData, { where: { token } });
            return res.status(200).json({
                message: "Upload Success!"
            });
        }
        ;
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed",
        });
    }
});
exports.uploadProfileImage = uploadProfileImage;
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
            userName: checkEmail.userName,
            email: checkEmail.email
        }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: "1d"
        });
        //send the password resest link to the user email address
        const emailContent = {
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
        res.status(200).json({
            message: 'Success!',
            data: passwordToken
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
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const userPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_TOKEN, (err, data) => {
            if (err)
                return res.json("The password reset link has expired");
            else
                return data;
        });
        const validUserPayload = userPayload;
        const userID = validUserPayload.userId;
        const email = validUserPayload.email;
        //validate email for existence
        const checkEmail = yield user_model_1.default.findOne({ where: { email } });
        if (!checkEmail) {
            return res.status(404).json({
                message: "Email not found"
            });
        }
        const saltPassword = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, saltPassword);
        checkEmail.password = hashPassword;
        yield checkEmail.save();
        res.status(200).json({
            message: "Password Updated Successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.resetPassword = resetPassword;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber, userName, password, code } = req.body;
        let user;
        let checkPassword = false;
        if (email) {
            user = yield user_model_1.default.findOne({ where: { email } });
        }
        else if (phoneNumber) {
            user = yield user_model_1.default.findOne({ where: { phoneNumber } });
        }
        else if (userName) {
            user = yield user_model_1.default.findOne({ where: { userName } });
        }
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "Failed!",
            });
        }
        else {
            checkPassword = bcrypt_1.default.compareSync(password, user.password);
            if (checkPassword) {
                if (!user.isVerified) {
                    const verificationCode = (0, jsonwebtoken_2.genToken)(user.userId, "1d");
                    const emailContent = {
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
                    const emailBody = mail_generator_1.default.generate(emailContent);
                    const emailText = mail_generator_1.default.generatePlaintext(emailContent);
                    const mailInstance = new mailservice_1.default();
                    mailInstance.createConnection();
                    mailInstance.mail({
                        from: {
                            address: process.env.EMAIL
                        },
                        email: user.email,
                        subject: "Kindly verify!",
                        message: emailText,
                        html: emailBody
                    });
                    res.status(401).json({
                        message: "please check mail and verify your account"
                    });
                }
                else if (user.twoFA_enabled) {
                    const verified = otplib_1.authenticator.check(code, user.twoFA_secret);
                    if (verified) {
                        const token = (0, jsonwebtoken_2.genToken)(user.userId, "1d");
                        res.status(200).json({
                            token: token,
                            message: "login successful"
                        });
                    }
                    else {
                        res.status(401).json({ message: "Please enter two factor authorization code " });
                    }
                }
                else {
                    const token = (0, jsonwebtoken_2.genToken)(user.userId, "1d");
                    res.status(200).json({
                        token: token,
                        message: "login successful"
                    });
                }
            }
            else {
                res.status(401).json({ message: "invalid password" });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed!"
        });
    }
});
exports.loginUser = loginUser;
const qrcodeimage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user = yield user_model_1.default.findOne({ where: { userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId } });
        if (user) {
            const secret = otplib_1.authenticator.generateSecret();
            const uri = otplib_1.authenticator.keyuri(user.email, "social-media", secret);
            const image = yield qrcode_1.default.toDataURL(uri);
            // Update the user's two-factor authentication secret
            user.set({
                twoFA_secret: secret
            }); // Assuming you have a twofa property in your User model
            yield user.save();
            res.status(200).json({
                success: true,
                image,
            });
        }
        else {
            res.status(404).json({
                message: "User not found",
                status: "Failed!",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed!",
        });
    }
});
exports.qrcodeimage = qrcodeimage;
const enableTwoFa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        //const { code } = req.body;
        const user = yield user_model_1.default.findOne({ where: { userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId } });
        const verified = yield (0, authenticator_1.twoFaAuth)(req);
        if (verified) {
            user === null || user === void 0 ? void 0 : user.set({
                twoFA_enabled: true,
            });
            yield (user === null || user === void 0 ? void 0 : user.save());
            res.status(200).json({
                message: "success",
            });
        }
        else {
            res.status(401).json({
                message: "invalid code, try again",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed!"
        });
    }
});
exports.enableTwoFa = enableTwoFa;
