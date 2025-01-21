import { WebSocket } from "ws";
import { User } from "../types/messages";

export const allSockets = new Map<WebSocket, User>();

export function broadcastToRoom(
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

export function getRoomOccupancy(roomId: string): number {
  let count = 0;
  allSockets.forEach((user) => {
    if (user.room === roomId) count++;
  });
  return count;
}

export function getRoomUsers(roomId: string): string[] {
  const users: string[] = [];
  allSockets.forEach((user) => {
    if (user.room === roomId && user.username) {
      users.push(user.username);
    }
  });
  return users;
}

export function broadcastRoomOccupancy(roomId: string) {
  broadcastToRoom(roomId, {
    type: "room_info",
    payload: {
      occupancy: getRoomOccupancy(roomId),
      users: getRoomUsers(roomId),
    },
  });
}

export function getAllRooms(): Array<{ id: string; occupancy: number }> {
  const rooms = new Map<string, number>();

  allSockets.forEach((user) => {
    const count = rooms.get(user.room) || 0;
    rooms.set(user.room, count + 1);
  });

  return Array.from(rooms.entries()).map(([id, occupancy]) => ({
    id,
    occupancy,
  }));
}

export function broadcastRoomList(socket?: WebSocket) {
  const message = {
    type: "room_list",
    payload: {
      rooms: getAllRooms(),
    },
  };

  if (socket) {
    socket.send(JSON.stringify(message));
  } else {
    // Broadcast to all connected sockets
    allSockets.forEach((user) => {
      user.socket.send(JSON.stringify(message));
    });
  }
}
