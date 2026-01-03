import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  // Temporarily disable auth for testing
  // io.use((socket: any, next) => {
  //   const token = socket.handshake.auth?.token;
  //   if (!token) return next(new Error("Unauthorized"));

  //   try {
  //     const payload = jwt.verify(token, process.env.JWT_SECRET!);
  //     socket.user = payload;
  //     next();
  //   } catch {
  //     next(new Error("Invalid token"));
  //   }
  // });

  return io;
};
