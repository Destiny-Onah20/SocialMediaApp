import app from "./app";
import sequelize from "./configs/dbconfig";
import logger from "./utils/logger";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;


sequelize.authenticate().then(() => {
  logger.info("Database connected!")
}).then(() => {
  app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
}).catch((error) => {
  logger.error(error.message)
})



