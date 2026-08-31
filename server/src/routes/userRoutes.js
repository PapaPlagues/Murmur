import express from "express";
import {
  getUsers,
  getUser,
  updateProfile,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// get users
userRouter.get("/", authenticate, getUsers);

// update user
userRouter.patch("/me", authenticate, updateProfile);

// get user
userRouter.get("/:userId", authenticate, getUser);

export default userRouter;
