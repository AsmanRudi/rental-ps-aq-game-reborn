import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 pb-12">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}