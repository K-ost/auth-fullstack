import { Router } from "express";
import authController from "../controllers/authController";
import { registerCheck } from "../middleware/authCheck";

const authRouter = Router();

authRouter.post("/register", registerCheck, authController.register);

export default authRouter;
