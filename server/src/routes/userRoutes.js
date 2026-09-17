import express from "express";
import {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  heartbeat,
  updateBanner,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const userRouter = express.Router();

// get users
userRouter.get("/", authenticate, getUsers);

// update user
userRouter.patch("/me", authenticate, updateProfile);

// update user avatar
userRouter.patch(
  "/me/avatar",
  authenticate,
  upload.single("avatar"),
  updateAvatar,
);

// update user banner
userRouter.patch(
  "/me/banner",
  authenticate,
  upload.single("banner"),
  updateBanner,
);

// get user
userRouter.get("/:userId", authenticate, getUser);

// check if user is online
userRouter.post("/heartbeat", authenticate, heartbeat);

export default userRouter;