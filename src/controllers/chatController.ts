import { Request, Response } from "express";
import { ChatService } from "../services/chatService";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.user!.id;
    const currentUserRole = req.user!.role;
    
    let conversation;
    if (currentUserRole === 'COMPANY') {
      // Company creating conversation with user
      conversation = await ChatService.createConversation(otherUserId, currentUserId);
    } else {
      // User creating conversation with company
      conversation = await ChatService.createConversation(currentUserId, otherUserId);
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    console.log('Getting conversations for user:', req.user!.id, 'role:', req.user!.role);
    console.log('Referer:', req.headers.referer);
    
    const conversations = await ChatService.getConversations(
      req.user!.id,
      req.user!.role
    );
    console.log('Found conversations:', conversations.length);
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ChatService.getMessages(
      req.params.conversationId,
      req.user!.id
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
};