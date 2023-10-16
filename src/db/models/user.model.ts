import sequelize from "../../configs/dbconfig";
import { UserAttribute } from "../../interfaces/user.interface";
import {
  Model,
  Optional,
  DataTypes
} from "sequelize";

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

class User extends Model<UserAttribute, optionalUserAttributes> {
   id!: string;
   fullname!: string;
   userName!: string;
   email!: string;
   password!: string;
   phoneNumber!: string;
   isVerified!: boolean;
   image!: string;
   token!: string;
   verifyCode!: boolean;
   readonly createdAt!: Date;
   readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
      type: DataTypes.BOOLEAN,
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
