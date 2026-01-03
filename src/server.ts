import http from "http";
import app from "./app";
import { initSocket } from "./config/socket";
import { chatSocket } from "./socket/chatSocket";

const server = http.createServer(app);

const io = initSocket(server);
chatSocket(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
