import jwt, {Secret} from "jsonwebtoken";
import dotenv from "dotenv";
import { RequestHandler, Request, Response } from "express";
import User from "../models/user.model";
import { UserAttribute } from "../interfaces/user.interface";
import { genToken, decodeToken } from "../utils/jsonwebtoken";
dotenv.config();

declare module "express" {
  interface Request {
    user?: UserAttribute | null; // Extend the Request object with the user property
  }
}


export const validUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.params.token;
    const valideToken = await User.findOne({ where: { token } });

    if (!valideToken) {
      return res.status(404).json({
        message: "Invalid Token passed!"
      })
    };
    const authenticToken = valideToken.token;
    jwt.verify(authenticToken, <string>process.env.JWT_SECRET_TOKEN, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message
        })
      }
      next()
    })
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: "Failed",
    })
  }
}

// auth middleware
export const userAuth: RequestHandler = async (req: Request, res, next) => {
  try {
    if (req.headers.authorization) {
      const hasAuthorization = req.headers.authorization;
      const token = hasAuthorization.split(" ")[1];
      const user: UserAttribute | null = await decodeToken(
        token,
        process.env.JWT_SECRET_TOKEN as Secret
      );
      // console.log(user);

      req.user = user;
      console.log(user);
      
      if (req.user) {
        console.log(req.user);
        next();
      } else {
        res.status(400).json({ message: "please login" });
      }
    } else {
      res.status(400).json({
        message: "No authorization found, please login..",
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// export const isAdmin: RequestHandler = async (req: Request, res, next) => {
//   try {
//     if (req.user?.isAdmin) {
//       next();
//     } else {
//       res.status(401).json({ message: "access denied, not an admin" });
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };