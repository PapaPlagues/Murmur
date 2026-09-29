import { prisma } from "../../lib/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { isAllowedImageUpload } from "../utils/imageUpload.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: req.user.userId,
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        banner: true,
        bio: true,
        createdAt: true,
        lastSeenAt: true,
      },
    });

    return res.status(200).json(users);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
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

    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const allowedFields = new Set(["username", "displayName", "bio"]);

    if (
      Object.keys(body).some((field) => !allowedFields.has(field)) ||
      Object.keys(body).length === 0
    ) {
      return res.status(400).json({ error: "Invalid profile fields" });
    }

    const data = {};

    if (Object.hasOwn(body, "username")) {
      if (
        typeof body.username !== "string" ||
        !body.username.trim() ||
        body.username.trim().length > 32
      ) {
        return res.status(400).json({ error: "Invalid username" });
      }
      data.username = body.username.trim();
    }

    if (Object.hasOwn(body, "displayName")) {
      if (
        body.displayName !== null &&
        (typeof body.displayName !== "string" || body.displayName.length > 80)
      ) {
        return res.status(400).json({ error: "Invalid display name" });
      }
      data.displayName = body.displayName;
    }

    if (Object.hasOwn(body, "bio")) {
      if (
        body.bio !== null &&
        (typeof body.bio !== "string" || body.bio.length > 2000)
      ) {
        return res.status(400).json({ error: "Invalid bio" });
      }
      data.bio = body.bio;
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        banner: true,
        bio: true,
      },
    });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to update profile",
    });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Avatar image is required",
      });
    }

    if (!(await isAllowedImageUpload(req.file))) {
      return res.status(415).json({ error: "Unsupported avatar image contents" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "murmur/avatars",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(req.file.buffer);
    });

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        avatar: result.secure_url,
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        banner: true,
        bio: true,
      },
    });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to update avatar",
    });
  }
};

// Update Banner
export const updateBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Banner image is required",
      });
    }

    if (!(await isAllowedImageUpload(req.file))) {
      return res.status(415).json({ error: "Unsupported banner image contents" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "murmur/banners",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(req.file.buffer);
    });

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        banner: result.secure_url,
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        banner: true,
        bio: true,
      },
    });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to update banner",
    });
  }
};

export const heartbeat = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastSeenAt: new Date(),
      }
    });

    return res.status(200).json({
      lastSeenAt: user.lastSeenAt,
    });

  } catch(err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to update presence",
    });
  }
}