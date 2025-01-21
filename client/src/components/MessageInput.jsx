export default function MessageInput({ text, setText, sendMessage }) {
  return (
    <div className="w-full bg-neutral-800 flex p-4 shadow-lg rounded-b-lg">
      <input
        className="flex-1 px-4 py-2 border border-neutral-600 bg-neutral-700 rounded-l-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        value={text}
        placeholder="Type a message..."
        onChange={(e) => setText(e)} // Make sure we pass the entire event
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
  );
}
