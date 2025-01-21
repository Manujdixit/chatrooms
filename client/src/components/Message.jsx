export default function Message({ message, username }) {
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);
  } catch (e) {
    return <div>{message}</div>;
  }

  const isSystem = parsedMessage.type === "system";
  const isOwnMessage = parsedMessage.payload.username === username;
  const timestamp = parsedMessage.payload.timestamp
    ? new Date(parsedMessage.payload.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`${isSystem ? "flex justify-center" : ""}`}>
      <div
        className={`rounded-lg mb-3 shadow-md ${
          isSystem
            ? "bg-neutral-700 text-neutral-400 text-sm inline-block p-2"
            : isOwnMessage
            ? "bg-blue-600 ml-auto p-3"
            : "bg-neutral-800 p-3"
        } ${!isSystem ? "text-white" : ""} ${
          !isSystem ? "hover:bg-opacity-90" : ""
        } transition-colors ${isSystem ? "max-w-[90%]" : "max-w-[80%]"}`}
      >
        {!isSystem && (
          <div className="flex justify-between text-sm text-neutral-400 mb-1">
            <span>{parsedMessage.payload.username}</span>
            <span>{timestamp}</span>
          </div>
        )}
        <div>{parsedMessage.payload.message}</div>
      </div>
    </div>
  );
}
