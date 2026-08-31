import { prisma } from "../../lib/prisma.js";

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    // Make sure the user belongs to this conversation
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: Number(conversationId),
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
        conversationId: Number(conversationId),
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        content: true,
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
      error: "Failed to get message",
    });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: "Message content is required",
      });
    }

    // Make sure the user belongs to this conversation
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: Number(conversationId),
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "You are not a member of this conversation",
      });
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: userId,
        conversationId: Number(conversationId),
      },
      select: {
        id: true,
        content: true,
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
