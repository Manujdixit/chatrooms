import { WebSocket } from "ws";

export interface User {
  socket: WebSocket;
  room: string;
  username?: string;
  isTyping?: boolean;
}

export interface JoinMessage {
  type: "join";
  payload: {
    roomId: string;
    username: string;
  };
}

export interface ChatMessage {
  type: "chat";
  payload: {
    message: string;
    username: string;
    timestamp: number;
  };
}

export interface TypingMessage {
  type: "typing";
  payload: {
    username: string;
    isTyping: boolean;
  };
}

export interface RoomInfoMessage {
  type: "room_info";
  payload: {
    occupancy: number;
    users: string[];
  };
}

export interface RoomListMessage {
  type: "room_list";
  payload: {
    rooms: Array<{ id: string; occupancy: number }>;
  };
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export interface GetRoomsMessage {
  type: "get_rooms";
}

export type Message =
  | JoinMessage
  | ChatMessage
  | TypingMessage
  | RoomInfoMessage
  | RoomListMessage
  | GetRoomsMessage
  | ErrorMessage;
