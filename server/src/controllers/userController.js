import { prisma } from "../../lib/prisma.js";
import cloudinary from "../config/cloudinary.js";

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
        bio: true,
        createdAt: true,
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
        bio: true,
        createdAt: true,
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
    const { username, displayName, avatar, bio } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        username,
        displayName,
        avatar,
        bio,
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
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
