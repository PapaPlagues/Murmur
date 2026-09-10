import express from "express";
import {
  getMessages,
  getRecentMessage,
  createMessage,
} from "../controllers/messageController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

// get & post from /conversations/:id/

messageRouter.get("/:conversationId/messages", authenticate, getMessages);

messageRouter.get("/:conversationId/messages", authenticate, getRecentMessage);

messageRouter.post("/:conversationId/messages", authenticate, createMessage);

export default messageRouter;
