import { Router } from "express";
import { signMe, signUpUser } from "../controllers/user.controller";
import { validateUserSignUp } from "../middlewares/validation";
import { userSignUpSchema } from "../schemas/user.schema";

const userRoute = Router();

userRoute.route("/user").post(validateUserSignUp(userSignUpSchema), signUpUser);
userRoute.route("/user").post(signMe);


export default userRoute; 