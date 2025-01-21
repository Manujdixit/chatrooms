import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      scrollToBottom();
    }
  }

  useEffect(() => {
    if (!username || !room) return; // Only connect if username and room are set

    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: room,
            username: username,
          },
        })
      );
    };

    ws.current.onmessage = (event) => {
      setMessages((messages) => [...messages, event.data]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [username, room]); // Add room as dependency

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!username) {
    return (
      <div className="w-screen h-screen flex bg-neutral-950 items-center justify-center">
        <div className="w-full max-w-md p-6 bg-neutral-900 rounded-lg shadow-xl">
          <h2 className="text-2xl text-white mb-4">Enter your username</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.username;
              if (input.value.trim()) {
                setUsername(input.value.trim());
              }
            }}
          >
            <input
              name="username"
              className="w-full px-4 py-2 mb-4 border border-neutral-600 bg-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="w-screen h-screen flex bg-neutral-950 items-center justify-center">
        <div className="w-full max-w-md p-6 bg-neutral-900 rounded-lg shadow-xl">
          <h2 className="text-2xl text-white mb-4">Join or Create a Room</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (roomInput.trim()) {
                setRoom(roomInput.trim());
              }
            }}
          >
            <input
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-neutral-600 bg-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter room name..."
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join Room
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex bg-neutral-950 items-center justify-center">
      <div className="w-full h-full sm:w-[476px] sm:h-5/6 flex flex-col bg-neutral-900 rounded-lg shadow-xl">
        <div className="bg-neutral-800 p-4 rounded-t-lg">
          <h2 className="text-white font-semibold">Room: {room}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className="bg-neutral-800 p-3 rounded-lg mb-3 text-white shadow-md hover:bg-neutral-700 transition-colors"
            >
              {(() => {
                try {
                  return JSON.parse(message).payload.message;
                } catch (e) {
                  return message;
                }
              })()}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="w-full bg-neutral-800 flex p-4 shadow-lg rounded-b-lg">
          <input
            className="flex-1 px-4 py-2 border border-neutral-600 bg-neutral-700 rounded-l-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={text}
            placeholder="Type a message..."
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text !== "") {
                sendMessage();
              }
            }}
          />
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            onClick={sendMessage}
            disabled={text === ""}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
