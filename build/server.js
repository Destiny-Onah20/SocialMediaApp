"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dbconfig_1 = __importDefault(require("./configs/dbconfig"));
const logger_1 = __importDefault(require("./utils/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
dbconfig_1.default.authenticate().then(() => {
    logger_1.default.info("Database connected!");
}).then(() => {
    app_1.default.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
}).catch((error) => {
    logger_1.default.error(error.message);
});
