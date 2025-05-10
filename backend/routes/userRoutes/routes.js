import express from "express";
import UserController from "../../controllers/user-controller.js";
import auth from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.get("/me", auth, UserController.getMe);
userRouter.get("/username/:username", auth, UserController.getUserByUsername);
userRouter.put("/update", auth, UserController.updateUser);
userRouter.post("/login", UserController.authenticateUser);
userRouter.post("/register", UserController.createUser);

export default userRouter;
