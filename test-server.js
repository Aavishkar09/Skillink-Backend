// Simple test to check if backend is working
const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Test routes
app.get('/api/chat/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.get('/api/chat/conversations', (req, res) => {
  // Return mock data for now
  res.json([]);
});

app.post('/api/chat/conversations', (req, res) => {
  // Return mock conversation
  const { otherUserId } = req.body;
  const mockConversation = {
    id: 'mock-conversation-id',
    userId: otherUserId,
    companyId: 'current-company-id',
    user: { id: otherUserId, name: 'Test User', role: 'USER' },
    company: { id: 'current-company-id', name: 'Test Company', role: 'COMPANY' },
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.json(mockConversation);
});

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.handshake.auth?.userId);
  
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation ${conversationId}`);
  });

  socket.on('send_message', (payload) => {
    console.log('Message received:', payload);
    const message = {
      id: Date.now().toString(),
      conversationId: payload.conversationId,
      senderId: socket.handshake.auth?.userId || 'unknown',
      content: payload.content,
      createdAt: new Date().toISOString(),
      sender: { id: 'sender-id', name: 'Sender', role: 'USER' }
    };
    io.to(payload.conversationId).emit('new_message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Test server running on port 5000');
});