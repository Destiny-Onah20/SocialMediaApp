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
exports.decodeToken = exports.genToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const genToken = (id, time) => {
    const token = jsonwebtoken_1.default.sign({
        userID: id,
    }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: time,
    });
    return token;
};
exports.genToken = genToken;
const decodeToken = (token, jwtSecret) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, jwtSecret, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                resolve(null);
            }
            else {
                try {
                    const payload = data;
                    const user = yield user_model_1.default.findOne({ where: { userId: payload.userID } });
                    if (user) {
                        // Access the UserAttributes from user.dataValues
                        const userAttributes = user.dataValues;
                        resolve(userAttributes);
                    }
                    else {
                        resolve(null); // User not found
                    }
                }
                catch (error) {
                    reject(error);
                }
            }
        }));
    });
});
exports.decodeToken = decodeToken;
