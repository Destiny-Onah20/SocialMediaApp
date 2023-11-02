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
exports.twoFaAuth = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const otplib_1 = require("otplib");
const twoFaAuth = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { code } = req.body;
    const user = yield user_model_1.default.findOne({ where: { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId } });
    if (user === null || user === void 0 ? void 0 : user.twoFA_secret) {
        const verified = otplib_1.authenticator.check(code, user.twoFA_secret);
        if (verified) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
});
exports.twoFaAuth = twoFaAuth;
