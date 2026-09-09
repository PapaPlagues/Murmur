import { prisma } from "../../lib/prisma.js";

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
    const { displayName, avatar, bio } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
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
