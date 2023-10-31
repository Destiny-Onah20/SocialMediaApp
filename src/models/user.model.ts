import sequelize from "../configs/dbconfig";
import { UserAttribute } from "../interfaces/user.interface";
import {
  Model,
  Optional,
  DataTypes
} from "sequelize";
import logger from "../utils/logger";

type optionalUserAttributes = Optional<
  UserAttribute,
  | "id"
  | "createdAt"
  | "verifyCode"
  | "updatedAt"
  | "token"
  | "image"
  | "isVerified"
  | "verifyCode"

>;

class User extends Model<UserAttribute, optionalUserAttributes> implements UserAttribute {
  declare id: number;
  declare userId: string;
  declare fullName: string;
  declare userName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string;
  declare isVerified: boolean;
  declare image: string;
  declare cloudId?: string | undefined;
  declare profileImages?: string[];
  declare coverPhoto?: string | undefined;
  declare token: string;
  declare verifyCode: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verifyCode: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cloudId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: true,
    tableName: "Users",
  }
);



export default User;
