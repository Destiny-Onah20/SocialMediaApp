import zod, { ZodSchema, object, string } from "zod";
import { UserAttribute } from "../interfaces/user.interface";

export type userInputType = {
  fullName: string;
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
};


export const userSignUpSchema: ZodSchema<userInputType> = object({
  fullName: string({
    required_error: "full name is required!"
  }).nonempty().min(2).regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  userName: string({
    required_error: "username is required!"
  }).nonempty().min(2),
  password: string({
    required_error: "Password is required."
  }).nonempty().min(6, "Password must be at-least six (6) characters long"),
  email: string({
    required_error: "email is required."
  }).nonempty().min(2).email("Invalid email format"),
  phoneNumber: string({
    required_error: "phone-number is required."
  }).min(10, "Phone number must be a valid number please"),
});