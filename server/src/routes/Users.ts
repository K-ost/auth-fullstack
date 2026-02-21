import { Router } from "express";
import usersController from "../controllers/usersController";
import authMiddleware from "../middleware/auth-middleware";

const usersRouter = Router();

usersRouter.get("/users", authMiddleware, usersController.getUsers);
usersRouter.get("/users/:id", usersController.getUserById);
usersRouter.patch("/users/:id", usersController.editUserById);
usersRouter.delete("/users/:id", usersController.deleteUserById);

export default usersRouter;
