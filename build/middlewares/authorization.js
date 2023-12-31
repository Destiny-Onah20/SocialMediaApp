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
exports.userAuth = exports.validUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_2 = require("../utils/jsonwebtoken");
dotenv_1.default.config();
const validUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const valideToken = yield user_model_1.default.findOne({ where: { token } });
        if (!valideToken) {
            return res.status(404).json({
                message: "Invalid Token passed!"
            });
        }
        ;
        const authenticToken = valideToken.token;
        jsonwebtoken_1.default.verify(authenticToken, process.env.JWT_SECRET_TOKEN, (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message
                });
            }
            next();
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            status: "Failed",
        });
    }
});
exports.validUser = validUser;
// auth middleware
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            const hasAuthorization = req.headers.authorization;
            const token = hasAuthorization.split(" ")[1];
            const user = yield (0, jsonwebtoken_2.decodeToken)(token, process.env.JWT_SECRET_TOKEN);
            // console.log(user);
            req.user = user;
            console.log(user);
            if (req.user) {
                console.log(req.user);
                next();
            }
            else {
                res.status(400).json({ message: "please login" });
            }
        }
        else {
            res.status(400).json({
                message: "No authorization found, please login..",
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.userAuth = userAuth;
// export const isAdmin: RequestHandler = async (req: Request, res, next) => {
//   try {
//     if (req.user?.isAdmin) {
//       next();
//     } else {
//       res.status(401).json({ message: "access denied, not an admin" });
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
