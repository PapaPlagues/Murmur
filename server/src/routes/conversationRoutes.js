import express from "express";
import { createConversation, getConversations, getConversation } from "../controllers/conversationController";
import { authenticate } from "../middleware/authMiddleware";

const conversationRouter = express.Router();

// make conversation
conversationRouter.post("/", authenticate, createConversation);

// get conversations
conversationRouter.get("/", authenticate, getConversations);

// get conversation
conversationRouter.get("/:conversationId", authenticate, getConversation);