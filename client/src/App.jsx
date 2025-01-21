import { useEffect, useRef, useState } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import "./App.css";
import RoomSelection from "./components/RoomSelection";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [availableRooms, setAvailableRooms] = useState([]);
  const ws = useRef(null);
  const typingTimeout = useRef(null);

  function sendMessage() {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: text,
          },
        })
      );
      setText("");
    }
  }

  function handleTyping(isTyping) {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "typing",
          payload: {
            isTyping,
          },
        })
      );
    }
  }

  function onTextChange(e) {
    setText(e.target.value);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    handleTyping(true);
    typingTimeout.current = setTimeout(() => {
      handleTyping(false);
    }, 1000);
  }

  useEffect(() => {
    if (!username) return;

    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      // If we have both username and room, join the room
      if (room) {
        ws.current.send(
          JSON.stringify({
            type: "join",
            payload: {
              roomId: room,
              username: username,
            },
          })
        );
      } else {
        // Otherwise just get the room list
        ws.current.send(JSON.stringify({ type: "get_rooms" }));
      }
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "room_list") {
        setAvailableRooms(data.payload.rooms);
      } else if (data.type === "typing_status") {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.payload.isTyping) {
            newSet.add(data.payload.username);
          } else {
            newSet.delete(data.payload.username);
          }
          return newSet;
        });
      } else {
        setMessages((messages) => [...messages, event.data]);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [username, room]); // Keep both dependencies

  if (!username) {
    return <Login onLogin={setUsername} />;
  }

  if (!room) {
    return (
      <RoomSelection
        rooms={availableRooms}
        roomInput={roomInput}
        setRoomInput={setRoomInput}
        onSelectRoom={setRoom}
      />
    );
  }

  return (
    <Chat
      messages={messages}
      text={text}
      onTextChange={onTextChange}
      sendMessage={sendMessage}
      username={username}
      room={room}
      typingUsers={typingUsers}
    />
  );
}

export default App;
