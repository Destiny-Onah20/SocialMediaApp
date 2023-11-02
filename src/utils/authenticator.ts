import User from "../models/user.model";
import { authenticator } from"otplib";
import { Request } from "express";

export const twoFaAuth = async (req: Request) => {
 
  const { code } = req.body;
  const user = await User.findOne({ where: { userId: req.user?.userId } })
  if(user?.twoFA_secret) {
    const verified = authenticator.check(code, user.twoFA_secret);
    if (verified) {
        return true;
      } else {
        return false;
      }
  }else {
    return false;
  }
 
 
};

