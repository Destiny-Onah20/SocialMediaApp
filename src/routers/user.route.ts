import { Router } from "express";

import { signUpUser, uploadProfileImage, verifyUserSignUp, forgotPassword ,resetPassword } from "../controllers/user.controller";

import { validateUserSignUp } from "../middlewares/validation";
import { userSignUpSchema } from "../schemas/user.schema";
import { validUser } from "../middlewares/authorization";

const userRoute = Router();

userRoute.route("/user").post(validateUserSignUp(userSignUpSchema), signUpUser);
userRoute.route("/user").patch(verifyUserSignUp);
userRoute.route("/user/:token").patch(validUser, uploadProfileImage);

userRoute.route("/user/forgotPassword").post( forgotPassword);

userRoute.route("/user/resetPassword/:token").put( resetPassword);

export default userRoute; 