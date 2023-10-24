"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validation_1 = require("../middlewares/validation");
const user_schema_1 = require("../schemas/user.schema");
const userRoute = (0, express_1.Router)();
userRoute.route("/user").post((0, validation_1.validateUserSignUp)(user_schema_1.userSignUpSchema), user_controller_1.signUpUser);
exports.default = userRoute;