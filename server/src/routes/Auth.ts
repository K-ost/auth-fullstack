import { Router } from "express";
import authController from "../controllers/authController";
import { loginCheck, registerCheck } from "../middleware/authCheck";

const authRouter = Router();

authRouter.post("/register", registerCheck, authController.register);
authRouter.post("/login", loginCheck, authController.login);

export default authRouter;
