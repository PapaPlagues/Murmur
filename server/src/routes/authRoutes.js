import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { rateLimit } from "express-rate-limit";

const authRouter = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Too many login attempts. Try again later." },
});
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Too many registration attempts. Try again later." },
});

authRouter.post("/register", registrationLimiter, register);

authRouter.post("/login", loginLimiter, login);

authRouter.post("/logout", logout);

authRouter.get("/me", authenticate, getCurrentUser);

export default authRouter;
