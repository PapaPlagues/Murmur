import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";

const app = express();

// Middleware
const allowedOrigins = [
  process.env.DEV_FRONTEND_URL,
  process.env.PROD_FRONTEND_URL,
];

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
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/conversations", messageRouter);
app.use("/conversations", conversationRouter);

export default app;
