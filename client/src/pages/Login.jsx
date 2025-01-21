export default function Login({ onLogin }) {
  return (
    <div className="w-screen h-screen flex bg-neutral-950 items-center justify-center">
      <div className="w-full max-w-md p-6 bg-neutral-900 rounded-lg shadow-xl">
        <h2 className="text-2xl text-white mb-4">Enter your username</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.username;
            if (input.value.trim()) {
              onLogin(input.value.trim());
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
