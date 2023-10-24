import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_URL!, {
  database: process.env.MYSQLDATABASE!,
  username: process.env.MYSQLUSER!,
  password: process.env.MYSQLPASSWORD!,
  host: process.env.MYSQLHOST!,
  port: <any>process.env.MYSQLPORT!,
  dialect: "mysql",
  define: {
    timestamps: true
  }
});

export default sequelize;