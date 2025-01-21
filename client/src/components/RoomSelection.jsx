export default function RoomSelection({
  rooms,
  roomInput,
  setRoomInput,
  onSelectRoom,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomInput.trim()) {
      onSelectRoom(roomInput.trim());
    }
  };

  return (
    <div className="w-screen h-screen flex bg-neutral-950 items-center justify-center">
      <div className="w-full max-w-md p-8 bg-neutral-900 rounded-lg shadow-xl space-y-6">
        <h2 className="text-2xl font-semibold text-white">
          Join or Create a Room
        </h2>

        {/* Room Creation Form */}
        <div className="space-y-4">
          <h3 className="text-neutral-400 text-sm font-medium">
            Create New Room
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-600 bg-neutral-700 
                                rounded-lg text-white placeholder-neutral-400
                                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter room name..."
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg 
                                font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Create Room
            </button>
          </form>
        </div>

        <hr />

        {/* Available Rooms List */}
        {rooms.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-neutral-400 text-sm font-medium">
              Available Rooms
            </h3>
            <div className="space-y-2">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className="w-full text-left px-4 py-3 bg-neutral-800 
                                        hover:bg-neutral-700 rounded-lg transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white">{room.id}</span>
                    <span className="text-sm text-neutral-400">
                      {room.occupancy}{" "}
                      {room.occupancy === 1 ? "person" : "people"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
