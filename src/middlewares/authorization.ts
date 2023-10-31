import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RequestHandler } from "express";
import User from "../models/user.model";
dotenv.config();

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