import { WebSocket } from "ws";
import { Message } from "../types/messages";
import {
  allSockets,
  broadcastToRoom,
  broadcastRoomOccupancy,
  broadcastRoomList,
} from "../utils/roomUtils";

export function handleMessage(socket: WebSocket, message: string) {
  try {
    const parsedMessage = JSON.parse(message) as Message;

    switch (parsedMessage.type) {
      case "get_rooms":
        broadcastRoomList(socket);
        break;
      case "join":
        handleJoin(socket, parsedMessage);
        break;
      case "chat":
        handleChat(socket, parsedMessage);
        break;
      case "typing":
        handleTyping(socket, parsedMessage);
        break;
    }
  } catch (err) {
    socket.send(
      JSON.stringify({
        type: "error",
        message: "Invalid message format",
      })
    );
  }
}

function handleJoin(socket: WebSocket, message: Message & { type: "join" }) {
  const { roomId, username } = message.payload;

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
  broadcastRoomList(); // Broadcast updated room list to all clients
  broadcastRoomOccupancy(roomId);
}

function handleChat(socket: WebSocket, message: Message & { type: "chat" }) {
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

  user.isTyping = false;
  broadcastToRoom(user.room, {
    type: "chat",
    payload: {
      message: message.payload.message,
      username: user.username,
      timestamp: Date.now(),
    },
  });
}

function handleTyping(
  socket: WebSocket,
  message: Message & { type: "typing" }
) {
  const user = allSockets.get(socket);
  if (user) {
    user.isTyping = message.payload.isTyping;
    broadcastToRoom(
      user.room,
      {
        type: "typing_status",
        payload: {
          username: user.username,
          isTyping: message.payload.isTyping,
        },
      },
      socket
    );
  }
}
