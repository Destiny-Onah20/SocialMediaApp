import { Router } from "express";

import { signUpUser, uploadProfileImage, verifyUserSignUp, forgotPassword ,resetPassword, loginUser, qrcodeimage, enableTwoFa } from "../controllers/user.controller";

import { validateUserSignUp } from "../middlewares/validation";
import { userSignUpSchema } from "../schemas/user.schema";
import { userAuth, validUser } from "../middlewares/authorization";

const userRoute = Router();

userRoute.route("/user").post(validateUserSignUp(userSignUpSchema), signUpUser);
userRoute.route("/user").patch(verifyUserSignUp);
userRoute.route("/login").post(loginUser)
userRoute.route("/user/:token").patch(validUser, uploadProfileImage);
userRoute.route("/gen-qrcode").get(userAuth, qrcodeimage)
userRoute.route("/enable-two-factor-authentication").put(userAuth, enableTwoFa)
userRoute.route("/user/forgotPassword").post( forgotPassword);

userRoute.route("/user/resetPassword/:token").put( resetPassword);

export default userRoute; 