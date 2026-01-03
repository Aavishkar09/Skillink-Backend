import prisma from "../config/prisma";

export class ChatService {
  static async verifyConversationAccess(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userId: userId },
          { companyId: userId }
        ]
      },
    });

    if (!conversation) throw new Error("Access denied");
    return conversation;
  }

  static async createConversation(userId: string, companyId: string) {
    const existing = await prisma.conversation.findFirst({
      where: {
        userId: userId,
        companyId: companyId
      },
    });

    if (existing) return existing;

    return prisma.conversation.create({
      data: {
        userId: userId,
        companyId: companyId
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
        company: { select: { id: true, name: true, role: true } }
      }
    });
  }

  static async sendMessage(conversationId: string, senderId: string, content: string) {
    await this.verifyConversationAccess(conversationId, senderId);

    return prisma.message.create({
      data: { conversationId, senderId, content },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });
  }

  static async getMessages(conversationId: string, userId: string) {
    await this.verifyConversationAccess(conversationId, userId);

    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });
  }

  static async getConversations(userId: string, userRole: string) {
    if (userRole === 'COMPANY') {
      return prisma.conversation.findMany({
        where: { companyId: userId },
        include: {
          user: { select: { id: true, name: true, role: true } },
          company: { select: { id: true, name: true, role: true } },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: { select: { id: true, name: true, role: true } }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else {
      return prisma.conversation.findMany({
        where: { userId: userId },
        include: {
          user: { select: { id: true, name: true, role: true } },
          company: { select: { id: true, name: true, role: true } },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: { select: { id: true, name: true, role: true } }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
    }
  }
}