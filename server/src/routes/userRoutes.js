import express from "express";

const userRouter = express.Router();

// get users
userRouter.get("/");

// get user
userRouter.get("/:userId");

userRouter.patch("/:id");