import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const setSessionCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const { username, displayName, password } = body;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (
      typeof username !== "string" ||
      !username.trim() ||
      !email ||
      typeof password !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    if (
      username.trim().length > 32 ||
      /\s/.test(username) ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      (displayName != null &&
        (typeof displayName !== "string" || displayName.length > 80)) ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: /\s/.test(username)
          ? "Username cannot contain spaces"
          : "Invalid registration details",
      });
    }

    const normalizedUsername = username.trim();

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: normalizedUsername },
          { email: { equals: email, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Username or email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        displayName,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
      },
    });

    return res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const { password } = body;

    if (!email || typeof password !== "string") {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // check password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    setSessionCookie(res, user.id);

    return res.status(200).json({ message: "Login successful" });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
};

export const guestLogin = async (req, res) => {
  try {
    const demoUser = await prisma.user.findFirst({
      where: { isDemo: true },
      select: { id: true },
    });

    if (!demoUser) {
      return res.status(503).json({ error: "Guest login is unavailable" });
    }

    setSessionCookie(res, demoUser.id);

    return res.status(200).json({ message: "Guest login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Guest login failed" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch {
    res.status(500).json({ error: "Logout failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        banner: true,
        bio: true,
        createdAt: true,
        lastSeenAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: "Failed to get user" });
  }
};
