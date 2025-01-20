import Rooms from "./Rooms";

export default function RegisterForm({
  username,
  setUsername,
  room,
  setRoom,
  joinRoom,
}) {
  return (
    <div className="flex p-5 bg-white rounded-lg min-w-[50%] max-w-2xl gap-4">
      <Rooms />
      <div className="flex flex-col gap-2 w-1/3">
        <input
          className="p-2 rounded bg-neutral-900 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <input
          className="p-2 rounded bg-neutral-900 text-white"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
        />
        <button
          className="bg-neutral-800 p-2 rounded-md text-white hover:bg-neutral-700"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
