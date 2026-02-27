import express from "express";
import chatRoutes from "./routes/chatRoute";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";

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

app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;
