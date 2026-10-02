import { rateLimit } from "express-rate-limit";

const createUserLimiter = (limit, message) =>
  rateLimit({
    windowMs: 60 * 1000,
    limit,
    keyGenerator: (req) => req.user.userId,
    standardHeaders: false,
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

export const profileImageUploadLimiter = createUserLimiter(
  10,
  "Too many profile image uploads. Try again later.",
);

export const heartbeatLimiter = createUserLimiter(
  6,
  "Too many presence updates. Try again shortly.",
);
