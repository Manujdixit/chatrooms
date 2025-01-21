import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { useEffect, useRef, useState } from "react";

export default function Chat({
  messages,
  text,
  onTextChange,
  sendMessage,
  username,
  room,
  typingUsers,
}) {
  const messagesEndRef = useRef(null);
  const [occupancy, setOccupancy] = useState(1);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage) {
      try {
        const parsed = JSON.parse(latestMessage);
        if (parsed.type === "room_info") {
          setOccupancy(parsed.payload.occupancy);
          setOnlineUsers(parsed.payload.users);
        }
      } catch (e) {}
    }
  }, [messages]);

  return (
    <div className="w-screen h-screen flex bg-neutral-950 items-center justify-center">
      <div className="w-full h-full sm:w-[476px] sm:h-5/6 flex flex-col bg-neutral-900 rounded-lg shadow-xl">
        <div className="bg-neutral-800 p-4 rounded-t-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-white font-semibold">Room: {room}</h2>
            <span className="text-neutral-400 text-sm">
              {occupancy} {occupancy === 1 ? "person" : "people"} in room
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {onlineUsers.map((user) => (
              <span
                key={user}
                className={`text-xs px-2 py-1 rounded ${
                  user === username
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-700 text-neutral-300"
                }`}
              >
                {user}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => {
            try {
              const parsed = JSON.parse(message);
              // Skip rendering room_info messages
              if (parsed.type === "room_info") return null;
              return (
                <Message key={index} message={message} username={username} />
              );
            } catch (e) {
              return (
                <Message key={index} message={message} username={username} />
              );
            }
          })}
          {typingUsers.size > 0 && (
            <div className="text-neutral-400 text-sm italic">
              {Array.from(typingUsers).join(", ")}{" "}
              {typingUsers.size === 1 ? "is" : "are"} typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <MessageInput
          text={text}
          setText={onTextChange} // Pass onTextChange directly instead of wrapping it
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
