import { Router } from "express";
import { createConversation, getConversations, getMessages } from "../controllers/chatController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Chat API is working" });
});

router.get("/conversations", authenticateToken, getConversations);
router.post("/conversations", authenticateToken, createConversation);
router.get("/conversations/:conversationId/messages", authenticateToken, getMessages);

export default router;