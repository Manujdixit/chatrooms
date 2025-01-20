import { WebSocket, WebSocketServer } from "ws";

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}

const users = new Map<string, User>();
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket: WebSocket) => {
  const socketId = Math.random().toString(36).substring(7);

  socket.on("message", (message: string) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "join") {
        users.set(socketId, {
          socket: socket,
          room: data.room,
          username: data.username,
        });

        socket.send(
          JSON.stringify({
            type: "joined",
            room: data.room,
          })
        );
      }

      if (data.type === "chat") {
        const sender = users.get(socketId);
        if (!sender) return;

        for (const [_, user] of users) {
          if (user.room === sender.room) {
            user.socket.send(
              JSON.stringify({
                type: "chat",
                message: data.message,
                username: sender.username,
                room: sender.room,
                timestamp: Date.now(),
              })
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  });

  socket.on("close", () => {
    users.delete(socketId);
  });

  socket.on("error", (err) => {
    console.log(err);
  });
});
