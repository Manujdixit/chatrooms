export default ({
  room,
  username,
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
}) => {
  return (
    <div className="flex flex-col bg-neutral-100/80 rounded-lg h-4/5 w-3/4 max-w-3xl mx-auto shadow-lg">
      <div className="flex justify-between p-4 bg-neutral-700 rounded-t-lg text-white">
        <h2 className="text-lg font-semibold">Room: {room}</h2>
        <h3 className="text-lg font-semibold">User: {username}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="bg-white p-2 rounded shadow">
            <div className="flex items-baseline">
              <span className="font-bold mr-2">{msg.username}:</span>
              <span className="flex-1">{msg.message}</span>
              <span className="text-xs text-gray-500 ml-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex p-4 bg-neutral-200 rounded-b-lg">
        <input
          className="flex-1 p-2 border bg-neutral-900 rounded-l-lg"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="p-2 bg-neutral-900 text-white rounded-r-lg "
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};
