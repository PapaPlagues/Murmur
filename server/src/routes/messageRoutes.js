import express from "express";

const messageRouter = express.Router();

// get & post from /conversations/:id/

messageRouter.get("/:conversationId/messages")

messageRouter.post("/:conversationId/messages");