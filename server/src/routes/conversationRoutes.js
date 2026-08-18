import express from "express";

const conversationRouter = express.Router();

// make conversation
conversationRouter.post("/");

// get conversations
conversationRouter.get("/");

// get conversation
conversationRouter.get("/:conversationId");