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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class mailSender {
    static getInstance() {
        if (!mailSender.instance) {
            mailSender.instance = new mailSender();
        }
        return mailSender.instance;
    }
    ;
    // public emailTemplate = fs.readFileSync('emailTemplate.hbs', 'utf8');
    createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.transporter = nodemailer_1.default.createTransport({
                service: process.env.SERVICE,
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            try {
                yield this.transporter.verify();
                // console.log("MailSender connection established successfully.");
            }
            catch (error) {
                // console.error("Error establishing MailSender connection:", error);
            }
        });
    }
    ;
    mail(Option) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOption = {
                from: {
                    name: "Social-commerce",
                    address: process.env.EMAIL
                },
                to: Option.email,
                subject: Option.subject,
                text: Option.message,
                html: Option.html
            };
            yield this.transporter.sendMail(mailOption);
        });
    }
    getTransporter() {
        return this.transporter;
    }
}
exports.default = mailSender;
