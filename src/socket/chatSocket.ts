import { Server } from "socket.io";
import { ChatService } from "../services/chatService";
import { sendMessageSchema } from "../models/chat";

export const chatSocket = (io: Server) => {
  io.on("connection", (socket: any) => {
    console.log('User connected:', socket.handshake.auth?.userId);
    
    // Store userId from auth
    socket.userId = socket.handshake.auth?.userId;

    socket.on("join_conversation", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    socket.on("send_message", async (payload: any) => {
      try {
        const data = sendMessageSchema.parse(payload);

        const message = await ChatService.sendMessage(
          data.conversationId,
          socket.userId, // Use socket.userId instead of socket.user.id
          data.content
        );

        io.to(data.conversationId).emit("new_message", message);
      } catch (err) {
        console.error('Message error:', err);
        socket.emit("error_message", "Message failed");
      }
    });

    socket.on("disconnect", () => {
      console.log('User disconnected:', socket.userId);
    });
  });
};