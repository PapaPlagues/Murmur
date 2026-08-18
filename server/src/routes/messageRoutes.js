import express from "express";

const messageRouter = express.Router();

// get & post from /conversations/:id/

messageRouter.get("/:id/messages")

messageRouter.post("/:id/messages");