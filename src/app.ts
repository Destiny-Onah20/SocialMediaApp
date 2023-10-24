import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import userRoute from "./routers/user.route";

const app = express();




app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Social-commerce!")
})
app.use("/api/v1", userRoute);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: `Error 404 this route ${req.originalUrl} not found in this Server!`
  })
})


export default app;