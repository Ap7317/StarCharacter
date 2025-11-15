import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-star-wars-yellow mb-2">
            Star Wars
          </h1>
          <p className="text-gray-400">Character Database</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-star-wars-yellow text-white"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-star-wars-yellow text-white"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-sm text-gray-400 mt-4">
            <p>Demo credentials:</p>
            <p className="text-star-wars-yellow">username: luke / password: skywalker</p>
          </div>
        </form>
      </div>
    </div>
  );
}
