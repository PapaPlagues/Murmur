import express from "express";
import {
  createConversation,
  getConversations,
  getConversation,
} from "../controllers/conversationController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { conversationWriteLimiter } from "../middleware/writeRateLimit.js";

const conversationRouter = express.Router();

// make conversation
conversationRouter.post(
  "/",
  authenticate,
  conversationWriteLimiter,
  createConversation,
);

// get conversations
conversationRouter.get("/", authenticate, getConversations);

// get conversation
conversationRouter.get("/:conversationId", authenticate, getConversation);

export default conversationRouter;
