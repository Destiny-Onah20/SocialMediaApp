import { Router } from "express";
import { signUpUser, verifyUserSignUp } from "../controllers/user.controller";
import { validateUserSignUp } from "../middlewares/validation";
import { userSignUpSchema } from "../schemas/user.schema";

const userRoute = Router();

userRoute.route("/user").post(validateUserSignUp(userSignUpSchema), signUpUser);
userRoute.route("/user").patch(verifyUserSignUp);


export default userRoute; 