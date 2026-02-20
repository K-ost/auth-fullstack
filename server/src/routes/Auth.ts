import { Router } from "express";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.get("/register", authController.register);

export default authRouter;
