import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">Daftar Akun Baru</h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama Lengkap</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm mb-1">No. WhatsApp / HP</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-indigo-500" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition">Register</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Sudah punya akun? <Link to="/login" className="text-indigo-400 hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}