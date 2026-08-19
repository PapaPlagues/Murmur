import express from "express";
import { getUsers, getUser, updateProfile } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const userRouter = express.Router();

// get users
userRouter.get("/", authenticate, getUsers);

// get user
userRouter.get("/:userId", authenticate, getUser);

// update user
userRouter.patch("/me", authenticate, updateProfile);

export default userRouter;