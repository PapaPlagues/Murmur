import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import multer from "multer";
import { getAllowedOrigins } from "./utils/allowedOrigins.js";

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = getAllowedOrigins({
  isProduction: process.env.NODE_ENV === "production",
  devOrigin: process.env.DEV_FRONTEND_URL,
  productionOrigin: process.env.PROD_FRONTEND_URL,
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/conversations", messageRouter);
app.use("/conversations", conversationRouter);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let status = 500;
  let message = "Internal server error";

  if (error.message === "Not allowed by CORS") {
    status = 403;
    message = "Origin not allowed";
  } else if (error instanceof multer.MulterError) {
    status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message =
      status === 413 ? "Uploaded file is too large" : "Invalid file upload";
  } else if (error.status === 415) {
    status = 415;
    message = error.message;
  } else if (error.status === 400 || error.status === 413) {
    status = error.status;
    message = status === 413 ? "Request body is too large" : "Invalid request";
  }

  if (status === 500) {
    console.error(error);
  }

  return res.status(status).json({ error: message });
});

export default app;
