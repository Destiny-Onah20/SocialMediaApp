"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignUpSchema = void 0;
const zod_1 = require("zod");
exports.userSignUpSchema = (0, zod_1.object)({
    fullName: (0, zod_1.string)({
        required_error: "full name is required!"
    }).nonempty().min(2).regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
    userName: (0, zod_1.string)({
        required_error: "username is required!"
    }).nonempty().min(2),
    password: (0, zod_1.string)({
        required_error: "Password is required."
    }).nonempty().min(6, "Password must be at-least six (6) characters long"),
    email: (0, zod_1.string)({
        required_error: "email is required."
    }).nonempty().min(2).email("Invalid email format"),
    phoneNumber: (0, zod_1.string)({
        required_error: "phone-number is required."
    }).min(10, "Phone number must be a valid number please"),
});
