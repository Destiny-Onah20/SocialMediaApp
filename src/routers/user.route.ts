import { Router } from "express";
import { signUpUser, forgotPassword } from "../controllers/user.controller";
import { validateUserSignUp } from "../middlewares/validation";
import { userSignUpSchema } from "../schemas/user.schema";

const userRoute = Router();

userRoute.route("/user").post(validateUserSignUp(userSignUpSchema), signUpUser);

userRoute.route("/user/forgotPassword").post(validateUserSignUp(userSignUpSchema), signUpUser);


export default userRoute; 