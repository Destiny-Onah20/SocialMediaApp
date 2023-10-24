import { Router } from "express";
import { signUpUser } from "../controllers/user.controller";
import { validateUserSignUp } from "../middlewares/validation";
import { userSignUpSchema } from "../schemas/user.schema";

const userRoute = Router();

userRoute.route("/user").post(validateUserSignUp(userSignUpSchema), signUpUser);
const a = 4

export default userRoute; 