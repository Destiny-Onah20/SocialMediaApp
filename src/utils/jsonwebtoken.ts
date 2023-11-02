import jwt, { Secret } from "jsonwebtoken";
import { UserAttribute } from "../interfaces/user.interface";
import User from "../models/user.model";
import { log } from "winston";

interface jwtPayload {
  userID: string;
}

export const genToken = (id: string, time: string): string => {
  const token = jwt.sign(
    {
      userID: id,
    },
    <string>process.env.JWT_SECRET_TOKEN,
    {
      expiresIn: time,
    }
  );
  return token;
};

export const decodeToken = async (
  token: string,
  jwtSecret: Secret
): Promise<UserAttribute | null> => {
  return new Promise<UserAttribute | null>((resolve, reject) => {
    jwt.verify(token, jwtSecret, async (err, data) => {
      if (err) {
        resolve(null);
      } else {
        try {
          const payload = data as jwtPayload;
          const user = await User.findOne({ where: { userId: payload.userID } });
          
          if (user) {
            // Access the UserAttributes from user.dataValues
            const userAttributes: UserAttribute = user.dataValues;
            resolve(userAttributes);
          } else {
            resolve(null); // User not found
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};
