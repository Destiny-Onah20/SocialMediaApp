import { Router } from "express";
import { signUpUser, forgotPassword ,resetPassword} from "../controllers/user.controller";
import { validateUserSignUp } from "../middlewares/validation";
import { userSignUpSchema } from "../schemas/user.schema";

const userRoute = Router();

userRoute.route("/user").post(validateUserSignUp(userSignUpSchema), signUpUser);

userRoute.route("/user/forgotPassword").post( forgotPassword);

userRoute.route("/user/resetPassword/:token").put( resetPassword);

export default userRoute; 