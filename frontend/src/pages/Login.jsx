import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">Login AQ Game Reborn</h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-indigo-500" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition">Login</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Belum punya akun? <Link to="/register" className="text-indigo-400 hover:underline">Register di sini</Link>
        </p>
      </div>
    </div>
  );
}