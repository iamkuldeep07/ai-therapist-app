import express from "express";
import {
  createChatSession,
  getChatSession,
  sendMessage,
  getChatHistory,
} from "../controllers/chat";
import { auth } from "../middleware/auth";

const router = express.Router();

router.use(auth);

router.post("/sessions", createChatSession);

// Get a specific chat session
router.get("/sessions/:sessionId", getChatSession);

// Send a message in a chat session
router.post("/sessions/:sessionId/messages", sendMessage);

// Get chat history for a session
router.get("/sessions/:sessionId/history", getChatHistory);

export default router;