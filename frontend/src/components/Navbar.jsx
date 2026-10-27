
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, LogOut, User, ShieldCheck, Receipt } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400">
        <Gamepad2 className="w-8 h-8" />
        <span>AQ Game Reborn</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-indigo-400 transition text-sm">Beranda & Jadwal</Link>
        {userInfo ? (
          <>
            <Link to="/my-bookings" className="flex items-center gap-1 hover:text-indigo-400 transition text-sm">
              <Receipt className="w-4 h-4 text-indigo-300" /> Riwayat Booking
            </Link>
            {userInfo.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-1 bg-indigo-600 px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-500 transition font-medium">
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-lg text-sm">
              <User className="w-4 h-4 text-indigo-300" />
              <span>{userInfo.name}</span>
            </div>
            <button onClick={handleLogout} className="bg-red-600 p-2 rounded-lg hover:bg-red-500 transition" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-500 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}