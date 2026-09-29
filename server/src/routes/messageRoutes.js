import express from "express";
import {
  getMessages,
  getRecentMessage,
  createMessage,
} from "../controllers/messageController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { messageWriteLimiter } from "../middleware/writeRateLimit.js";

const messageRouter = express.Router();

// get & post from /conversations/:id/

messageRouter.get("/:conversationId/messages", authenticate, getMessages);

messageRouter.get("/:conversationId/messages", authenticate, getRecentMessage);

messageRouter.post(
  "/:conversationId/messages",
  authenticate,
  messageWriteLimiter,
  upload.single("image"),
  createMessage,
);

export default messageRouter;
