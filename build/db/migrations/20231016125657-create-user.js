'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable('Users', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: sequelize_1.DataTypes.STRING
                },
                fullName: {
                    allowNull: false,
                    type: sequelize_1.DataTypes.STRING
                },
                phoneNumber: {
                    allowNull: false,
                    type: sequelize_1.DataTypes.STRING
                },
                email: {
                    allowNull: false,
                    type: sequelize_1.DataTypes.STRING
                },
                password: {
                    allowNull: false,
                    type: sequelize_1.DataTypes.STRING
                },
                username: {
                    allowNull: false,
                    type: sequelize_1.DataTypes.STRING
                },
                isVerified: {
                    allowNull: false,
                    type: sequelize_1.DataTypes.BOOLEAN,
                    defaultValue: false,
                },
                token: {
                    type: sequelize_1.DataTypes.STRING
                },
                verifyCode: {
                    allowNull: true,
                    type: sequelize_1.DataTypes.INTEGER
                },
                image: {
                    allowNull: true,
                    type: sequelize_1.DataTypes.STRING
                },
                createdAt: {
                    allowNull: false,
                    type: sequelize_1.DataTypes.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: sequelize_1.DataTypes.DATE
                }
            });
        });
    },
    down(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('Users');
        });
    }
};
