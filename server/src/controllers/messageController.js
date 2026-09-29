import { prisma } from "../../lib/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { isAllowedImageUpload } from "../utils/imageUpload.js";

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    // Make sure the user belongs to this conversation
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversationId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "You are not a member of this conversation",
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to get messages",
    });
  }
};

export const getRecentMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    // Make sure the user belongs to this conversation
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversationId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "You are not a member of this conversation",
      });
    }

    const messages = await prisma.message.findFirst({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to get recent message",
    });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (
      content != null &&
      (typeof content !== "string" || content.length > 10000)
    ) {
      return res.status(400).json({ error: "Invalid message content" });
    }

    // Message must contain either text or an image
    if (!content?.trim() && !req.file) {
      return res.status(400).json({
        error: "Message must contain text or an image",
      });
    }

    // Make sure the user belongs to this conversation
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversationId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "You are not a member of this conversation",
      });
    }

    if (req.file && !(await isAllowedImageUpload(req.file))) {
      return res.status(415).json({ error: "Unsupported message image contents" });
    }

    let imageUrl = null;

    // Upload image to CLoudinary if one was provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "murmur/messages",
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

      imageUrl = result.secure_url;
    }

    const message = await prisma.message.create({
      data: {
        content: content?.trim() || null,
        imageUrl,
        sender: {
          connect: {
            id: userId,
          },
        },
        conversation: {
          connect: {
            id: conversationId,
          },
        },
      },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json(message);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to post message",
    });
  }
};
