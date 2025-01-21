import { WebSocket, WebSocketServer } from "ws";
import { handleMessage } from "./handlers/messageHandler";
import {
  allSockets,
  broadcastRoomOccupancy,
  broadcastToRoom,
} from "./utils/roomUtils";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", (message: string) => handleMessage(socket, message));

  socket.on("close", () => {
    const user = allSockets.get(socket);
    if (user) {
      const room = user.room;
      broadcastToRoom(room, {
        type: "system",
        payload: { message: `${user.username} left the room` },
      });
      allSockets.delete(socket);
      broadcastRoomOccupancy(room);
    }
  });

  socket.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});
