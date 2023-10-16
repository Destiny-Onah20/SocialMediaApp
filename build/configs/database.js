"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
module.exports = {
    "development": {
        "username": process.env.MYSQLUSER,
        "password": process.env.MYSQLPASSWORD,
        "database": process.env.MYSQLDATABASE,
        "host": process.env.MYSQLHOST,
        "dialect": "mysql"
    },
    "test": {
        "username": process.env.MYSQLUSER,
        "password": process.env.MYSQLPASSWORD,
        "database": process.env.MYSQLDATABASE,
        "host": process.env.MYSQLHOST,
        "dialect": "mysql"
    },
    "production": {
        "username": process.env.MYSQLUSER,
        "password": process.env.MYSQLPASSWORD,
        "database": process.env.MYSQLDATABASE,
        "host": process.env.MYSQLHOST,
        "dialect": "mysql"
    }
};
