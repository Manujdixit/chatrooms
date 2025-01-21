import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
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
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
            username: "John",
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
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-screen h-screen flex flex-col bg-neutral-900">
      <div className="flex-1 overflow-y-auto p-4 h-[90vh]">
        {messages.map((message, index) => (
          <div
            key={index}
            className="bg-neutral-800 p-3 rounded-lg mb-3 text-white shadow-md"
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
      <div className="w-full bg-neutral-800 flex p-4 shadow-lg">
        <input
          className="flex-1 px-4 py-2 border border-neutral-600 bg-neutral-700 rounded-l-lg text-white focus:outline-none focus:border-neutral-500"
          value={text}
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
