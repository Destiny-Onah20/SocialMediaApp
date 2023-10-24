import app from "./app";
import sequelize from "./configs/dbconfig";
import logger from "./utils/logger";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;


sequelize.authenticate().then(() => {
  logger.info("Database connected!!")
}).then(() => {
  app.listen(port, () => {
    logger.info(`App listening on port: ${port}`);
  });
}).catch((error) => {
  console.log(`Failed to connect`)
  logger.error(error.message)
})


process.on("SIGINT", async () => {
  await sequelize.close();
  logger.info("Server closed");
  process.exit(0);
});


