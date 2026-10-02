import { prisma } from "../../lib/prisma.js";

export const createConversation = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const { userId } = body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    if (
      typeof userId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        userId,
      )
    ) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (currentUserId === userId) {
      return res.status(400).json({
        error: "You cannot start a conversation with yourself",
      });
    }

    // Make sure the other user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            members: {
              some: {
                userId: currentUserId,
              },
            },
          },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
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

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const conversation = await prisma.conversation.create({
      data: {
        members: {
          create: [
            {
              userId: currentUserId,
            },
            {
              userId: userId,
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
                    lastSeenAt: true,
                  },
                },
              },
            },
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
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
                    lastSeenAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const conversations = memberships
      .map((membership) => membership.conversation)
      .sort((first, second) => {
        const firstLatestMessage = first.messages[0];
        const secondLatestMessage = second.messages[0];

        if (!firstLatestMessage) return secondLatestMessage ? 1 : 0;
        if (!secondLatestMessage) return -1;

        return (
          secondLatestMessage.createdAt.getTime() -
          firstLatestMessage.createdAt.getTime()
        );
      });

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
        id: conversationId,
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
