import "dotenv/config";
import express, { Application } from "express";
import authRouter from "./routes/Auth";

const PORT = process.env.PORT || 8080;
const app: Application = express();

app.use(express.json());
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Server started. http://localhost:${PORT}`);
});
