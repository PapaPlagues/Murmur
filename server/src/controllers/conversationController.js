import { prisma } from "../../lib/prisma.js";

export const createConversation = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    if (currentUserId === Number(userId)) {
      return res.status(400).json({
        error: "You cannot start a conversation with yourself",
      });
    }

    // Make sure the other user exists
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const conversation = await prisma.conversation.create({
      data: {
        members: {
          create: [
            {
              userId: currentUserId,
            },
            {
              userId: Number(userId),
            },
          ],
        },
      },
      include: {
        members: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json(conversation);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to create conversation",
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const memberships = await prisma.conversationMember.findMany({
      where: {
        userId,
      },
      include: {
        conversation: {
          include: {
            members: {
              select: {
                userId: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const conversations = memberships.map(
      (membership) => membership.conversation,
    );

    return res.status(200).json(conversations);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to fetch conversations",
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: Number(conversationId),
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found",
      });
    }

    return res.status(200).json(conversation);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to fetch conversation",
    });
  }
};
