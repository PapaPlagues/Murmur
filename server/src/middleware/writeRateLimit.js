import { rateLimit } from "express-rate-limit";

const createUserLimiter = (limit, message) =>
  rateLimit({
    windowMs: 60 * 1000,
    limit,
    keyGenerator: (req) => req.user.userId,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  });

export const conversationWriteLimiter = createUserLimiter(
  20,
  "Too many conversation requests. Try again shortly.",
);

export const messageWriteLimiter = createUserLimiter(
  60,
  "Too many messages. Try again shortly.",
);