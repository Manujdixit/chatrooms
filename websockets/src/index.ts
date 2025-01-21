import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
  username?: string;
}

interface JoinMessage {
  type: "join";
  payload: {
    roomId: string;
    username: string;
  };
}

interface ChatMessage {
  type: "chat";
  payload: {
    message: string;
    username: string;
  };
}

type Message = JoinMessage | ChatMessage;

const allSockets = new Map<WebSocket, User>();

function broadcastToRoom(
  room: string,
  message: any,
  excludeSocket?: WebSocket
) {
  allSockets.forEach((user) => {
    if (user.room === room && user.socket !== excludeSocket) {
      user.socket.send(JSON.stringify(message));
    }
  });
}

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", (message: string) => {
    try {
      const parsedMessage = JSON.parse(message) as Message;

      if (parsedMessage.type === "join") {
        const { roomId, username } = parsedMessage.payload;

        if (!roomId || !username) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Room ID and username are required",
            })
          );
          return;
        }

        allSockets.set(socket, {
          socket,
          room: roomId,
          username,
        });

        broadcastToRoom(roomId, {
          type: "system",
          payload: { message: `${username} joined the room` },
        });

        console.log(`User ${username} joined room ${roomId}`);
      }

      if (parsedMessage.type === "chat") {
        const user = allSockets.get(socket);
        if (!user || !user.room) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "You must join a room first",
            })
          );
          return;
        }

        broadcastToRoom(user.room, {
          type: "chat",
          payload: {
            message: parsedMessage.payload.message,
            username: user.username,
          },
        });
      }
    } catch (err) {
      socket.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });

  socket.on("close", () => {
    const user = allSockets.get(socket);
    if (user) {
      broadcastToRoom(user.room, {
        type: "system",
        payload: { message: `${user.username} left the room` },
      });
      allSockets.delete(socket);
    }
  });

  socket.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});
