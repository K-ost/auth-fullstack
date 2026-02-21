import "dotenv/config";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/Auth";
import usersRouter from "./routes/Users";

const PORT = process.env.PORT || 8080;
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api", usersRouter);

app.listen(PORT, () => {
  console.log(`Server started. http://localhost:${PORT}`);
});
