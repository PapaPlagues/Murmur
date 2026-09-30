import { prisma } from "../../lib/prisma.js";

export const requireConversationMember = async (req, res, next) => {
  try {
    const membership = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: req.params.conversationId,
          userId: req.user.userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "You are not a member of this conversation",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};