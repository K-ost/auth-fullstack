import { Router } from "express";
import authController from "../controllers/authController";
import { loginCheck, registerCheck } from "../middleware/authCheck";
import sessionController from "../controllers/sessionController";

const authRouter = Router();

authRouter.post("/register", registerCheck, authController.register);
authRouter.post("/login", loginCheck, authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/refresh", authController.refresh);

authRouter.get("/tokens", sessionController.getTokens);
authRouter.delete("/clear-sessions", sessionController.clearAllSessions);

export default authRouter;
