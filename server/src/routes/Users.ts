import { Router } from "express";
import usersController from "../controllers/usersController";
import authMiddleware from "../middleware/auth-middleware";

const usersRouter = Router();

usersRouter.get("/users", authMiddleware, usersController.getUsers);
usersRouter.get("/users/:id", authMiddleware, usersController.getUserById);
usersRouter.patch("/users/:id", authMiddleware, usersController.editUserById);
usersRouter.delete("/users/:id", authMiddleware, usersController.deleteUserById);

export default usersRouter;
