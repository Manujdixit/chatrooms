import { useEffect, useState } from "react";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import Chat from "./components/Chat";

function App() {
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            username: data.username,
            message: data.message,
            timestamp: data.timestamp,
          },
        ]);
      } else if (data.type === "joined") {
        setIsJoined(true);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  const joinRoom = () => {
    if (socket && username && room) {
      socket.send(
        JSON.stringify({
          type: "join",
          username,
          room,
        })
      );
    }
  };

  const sendMessage = () => {
    if (socket && messageInput && isJoined) {
      socket.send(
        JSON.stringify({
          type: "chat",
          message: messageInput,
        })
      );
      setMessageInput("");
    }
  };

  return (
    <div className="h-screen bg-neutral-900 flex items-center justify-center">
      {!isJoined ? (
        <RegisterForm
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
          joinRoom={joinRoom}
        />
      ) : (
        <Chat
          room={room}
          username={username}
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
}

export default App;
