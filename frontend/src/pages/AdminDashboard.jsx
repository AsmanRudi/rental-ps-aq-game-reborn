import { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldCheck, PlusCircle, Trash2, DollarSign, Monitor, Clock, Users, Calendar, Edit3, Printer } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, consoles, users
  const [consoles, setConsoles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formConsole, setFormConsole] = useState({ name: '', type: 'PS5', pricePerHour: 15000, description: '' });
  const [editingBooking, setEditingBooking] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchAdminData = async () => {
  try {
    const resConsole = await API.get('/consoles');
    setConsoles(resConsole.data);

    const resBooking = await API.get('/bookings');
    setBookings(resBooking.data);

    const resUsers = await API.get('/users');
    setUsers(resUsers.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const loadData = async () => {
    await fetchAdminData();
  };

  loadData();
}, []);


  // Statistik Keuangan
  const totalIncome = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  const pendingCount = bookings.filter(b => b.status === 'PAID').length;

  // Handler Console
  const handleCreateConsole = async (e) => {
    e.preventDefault();
    try {
      await API.post('/consoles', formConsole);
      setMsg('Unit PS & Billing berhasil ditambahkan!');
      setFormConsole({ name: '', type: 'PS5', pricePerHour: 15000, description: '' });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menambah console');
    }
  };

  const handleDeleteConsole = async (id) => {
    if (window.confirm('Yakin ingin menghapus unit PS ini?')) {
      try {
        await API.delete(`/consoles/${id}`);
        fetchAdminData();
      } catch {
        alert('Gagal menghapus');
      }
    }
  };

  // Handler Booking Status & Edit
  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchAdminData();
    } catch {
      alert('Gagal memperbarui status booking');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Hapus data booking ini?')) {
      try {
        await API.delete(`/bookings/${id}`);
        fetchAdminData();
      } catch {
        alert('Gagal menghapus booking');
      }
    }
  };

  const handleSaveEditBooking = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/bookings/${editingBooking._id}`, editingBooking);
      setEditingBooking(null);
      setMsg('Riwayat booking berhasil diperbarui!');
      fetchAdminData();
    } catch {
      alert('Gagal mengedit booking');
    }
  };

  // Handler Users
  const handleDeleteUser = async (id) => {
    if (window.confirm('Yakin ingin menghapus akun user ini?')) {
      try {
        await API.delete(`/users/${id}`);
        fetchAdminData();
      } catch {
        alert('Gagal menghapus user');
      }
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await API.put(`/users/${user._id}`, { role: newRole });
      fetchAdminData();
    } catch {
      alert('Gagal mengubah role user');
    }
  };


  // Fungsi untuk mencetak struk transaksi thermal
  const handlePrintReceipt = (b) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Rental - AQ Game Reborn</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 12px; width: 280px; margin: 0 auto; padding: 10px; color: #000; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-bottom: 1px dashed #000; margin: 8px 0; }
            .flex { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 16px;">AQ GAME REBORN</div>
          <div class="center" style="font-size: 10px;">Rental PlayStation & Gaming Lounge</div>
          <div class="line"></div>
          <div>ID Transaksi: ${b._id.slice(-6).toUpperCase()}</div>
          <div>Tanggal: ${b.bookingDate}</div>
          <div>Pelanggan: ${b.user?.name || 'Tamu Toko'}</div>
          <div class="line"></div>
          <div class="bold">${b.psConsole?.name || 'Unit PS'} (${b.psConsole?.type})</div>
          <div>Jam: ${b.startTime} - ${b.endTime} (${b.durationHours} Jam)</div>
          <div class="flex">
            <span>Tarif/Jam:</span>
            <span>Rp ${b.psConsole?.pricePerHour?.toLocaleString()}</span>
          </div>
          <div class="line"></div>
          <div class="flex bold" style="font-size: 14px;">
            <span>TOTAL:</span>
            <span>Rp ${b.totalPrice?.toLocaleString()}</span>
          </div>
          <div class="line"></div>
          <div class="center" style="font-size: 10px; margin-top: 10px;">
            Status: ${b.status} <br/>
            Terima kasih sudah bermain di AQ Game Reborn! <br/>
            Simpan struk ini sebagai bukti sewa sah.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-indigo-400" />
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-400">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Kontrol penuh operasional rental PS AQ Game Reborn</p>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex gap-2 bg-gray-800 p-1.5 rounded-xl border border-gray-700 text-sm">
          <button
            onClick={() => setActiveTab('cashier')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${activeTab === 'cashier' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
          <DollarSign className="w-4 h-4" /> Kasir Walk-In2
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Calendar className="w-4 h-4" /> Kelola Booking
          </button>
          <button
            onClick={() => setActiveTab('consoles')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${activeTab === 'consoles' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Monitor className="w-4 h-4" /> Unit & Billing
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4" /> Kelola User
          </button>
        </div>
      </div>

      {msg && <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-xl">{msg}</div>}

      {/* Ringkasan Statistik Keuangan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Total Omset / Pendapatan</p>
            <h3 className="text-2xl font-extrabold text-green-400">Rp {totalIncome.toLocaleString()}</h3>
          </div>
          <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 text-green-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Perlu Verifikasi Bukti Bayar</p>
            <h3 className="text-2xl font-extrabold text-yellow-400">{pendingCount} Transaksi</h3>
          </div>
          <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20 text-yellow-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Total User Terdaftar</p>
            <h3 className="text-2xl font-extrabold text-indigo-400">{users.length} Akun</h3>
          </div>
          <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TAB 1: KELOLA BOOKING & RIWAYAT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-lg font-bold mb-4">Verifikasi & Edit Riwayat Booking User</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-700 text-gray-400">
                  <tr>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Console</th>
                    <th className="pb-3">Jadwal Main</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Bukti Bayar</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-center">Aksi & Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="py-3">
                        <div className="font-semibold">{b.user?.name}</div>
                        <div className="text-xs text-gray-400">{b.user?.phone}</div>
                      </td>
                      <td className="py-3">{b.psConsole?.name}</td>
                      <td className="py-3">
                        <div>{b.bookingDate}</div>
                        <div className="text-xs text-indigo-300">{b.startTime} - {b.endTime} ({b.durationHours} Jam)</div>
                      </td>
                      <td className="py-3 font-bold">Rp {b.totalPrice?.toLocaleString()}</td>
                      <td className="py-3">
                        {b.paymentProof ? (
                          <a href={`http://localhost:5000${b.paymentProof}`} target="_blank" rel="noreferrer" className="text-indigo-400 underline text-xs font-medium">
                            Lihat Bukti
                          </a>
                        ) : (
                          <span className="text-gray-500 text-xs">Belum Upload</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === 'CONFIRMED' ? 'bg-green-600/20 text-green-400 border border-green-500/30' :
                          b.status === 'PAID' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30' :
                          b.status === 'REJECTED' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 text-center space-x-2">
                        {b.status !== 'CONFIRMED' && (
                          <button onClick={() => handleUpdateStatus(b._id, 'CONFIRMED')} className="bg-green-600 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-green-500 transition">
                            Terima
                          </button>
                        )}
                        <button onClick={() => setEditingBooking(b)} className="bg-blue-600/20 text-blue-400 p-1.5 rounded hover:bg-blue-600 hover:text-white transition" title="Edit Booking">
                          <Edit3 className="w-4 h-4 inline" />
                        </button>
                        <button onClick={() => handleDeleteBooking(b._id)} className="bg-red-600/20 text-red-400 p-1.5 rounded hover:bg-red-600 hover:text-white transition" title="Hapus Booking">
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                        {/* Di dalam kolom aksi tabel bookings AdminDashboard.jsx */}
                        <button 
                          onClick={() => handlePrintReceipt(b)} 
                          className="bg-gray-700 text-gray-300 p-1.5 rounded hover:bg-gray-600 hover:text-white transition" 
                          title="Cetak Struk"
                        >
                        <Printer className="w-4 h-4 inline" />
                      </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Edit Booking */}
          {editingBooking && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 w-full max-w-md space-y-4">
                <h3 className="text-lg font-bold text-indigo-400">Edit Jadwal Booking</h3>
                <form onSubmit={handleSaveEditBooking} className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">Tanggal Booking</label>
                    <input
                      type="date"
                      value={editingBooking.bookingDate}
                      onChange={(e) => setEditingBooking({...editingBooking, bookingDate: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Jam Mulai (HH:mm)</label>
                    <input
                      type="text"
                      value={editingBooking.startTime}
                      onChange={(e) => setEditingBooking({...editingBooking, startTime: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Durasi (Jam)</label>
                    <input
                      type="number"
                      value={editingBooking.durationHours}
                      onChange={(e) => setEditingBooking({...editingBooking, durationHours: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Status</label>
                    <select
                      value={editingBooking.status}
                      onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-lg font-semibold text-sm transition">
                      Simpan Perubahan
                    </button>
                    <button type="button" onClick={() => setEditingBooking(null)} className="px-4 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm transition">
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UNIT PS & BILLING */}
      {activeTab === 'consoles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><PlusCircle className="text-indigo-400" /> Tambah Unit & Billing PS</h2>
            <form onSubmit={handleCreateConsole} className="space-y-4">
              <div>
                <label className="block text-xs mb-1">Nama Unit (contoh: PS5 - VIP 01)</label>
                <input
                  type="text"
                  value={formConsole.name}
                  onChange={(e) => setFormConsole({...formConsole, name: e.target.value})}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Tipe Console</label>
                <select
                  value={formConsole.type}
                  onChange={(e) => setFormConsole({...formConsole, type: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm"
                >
                  <option value="PS3">PS3</option>
                  <option value="PS4">PS4</option>
                  <option value="PS5">PS5</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Tarif Billing per Jam (Rp)</label>
                <input
                  type="number"
                  value={formConsole.pricePerHour}
                  onChange={(e) => setFormConsole({...formConsole, pricePerHour: e.target.value})}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Keterangan / Fasilitas</label>
                <input
                  type="text"
                  value={formConsole.description}
                  onChange={(e) => setFormConsole({...formConsole, description: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm"
                  placeholder="Contoh: AC, Sofa Gaming, TV 4K"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-lg font-semibold text-sm transition">
                Simpan Unit PS
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h2 className="text-lg font-bold mb-4">Daftar Unit PS & Tarif Billing</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-700 text-gray-400">
                    <tr>
                      <th className="pb-3">Nama Unit</th>
                      <th className="pb-3">Tipe</th>
                      <th className="pb-3">Tarif / Jam</th>
                      <th className="pb-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {consoles.map((item) => (
                      <tr key={item._id}>
                        <td className="py-3 font-semibold">{item.name}</td>
                        <td className="py-3"><span className="bg-indigo-600 px-2 py-0.5 rounded text-xs">{item.type}</span></td>
                        <td className="py-3 text-indigo-300">Rp {item.pricePerHour.toLocaleString()}</td>
                        <td className="py-3 text-center">
                          <button onClick={() => handleDeleteConsole(item._id)} className="bg-red-600/20 text-red-400 p-1.5 rounded hover:bg-red-600 hover:text-white transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KELOLA USER */}
      {activeTab === 'users' && (
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-lg font-bold mb-4">Manajemen Pengguna (User & Admin)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-700 text-gray-400">
                <tr>
                  <th className="pb-3">Nama</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">No. HP / WhatsApp</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3 text-center">Aksi Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="py-3 font-semibold">{u.name}</td>
                    <td className="py-3 text-gray-300">{u.email}</td>
                    <td className="py-3 text-gray-300">{u.phone}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'bg-gray-700 text-gray-300'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-center space-x-2">
                      <button onClick={() => handleToggleRole(u)} className="bg-indigo-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-indigo-500 transition">
                        Ubah Role
                      </button>
                      <button onClick={() => handleDeleteUser(u._id)} className="bg-red-600/20 text-red-400 p-1.5 rounded hover:bg-red-600 hover:text-white transition" title="Hapus User">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: KASIR WALK-IN (SEWA LANGSUNG DI TEMPAT) */}
      {activeTab === 'cashier' && (
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-indigo-400 flex items-center gap-2">
            <DollarSign /> Input Sewa Langsung (Walk-In / Bayar Tunai)
          </h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const formData = {
                customerName: e.target.customerName.value,
                customerPhone: e.target.customerPhone.value || '-',
                psConsoleId: e.target.psConsoleId.value,
                bookingDate: e.target.bookingDate.value,
                startTime: e.target.startTime.value,
                durationHours: Number(e.target.durationHours.value)
              };
              await API.post('/bookings/quick', formData);
              setMsg('Sewa langsung kasir berhasil dicatat & slot dikunci!');
              e.target.reset();
              fetchAdminData();
            } catch (err) {
              alert(err.response?.data?.message || 'Gagal membuat quick booking');
            }
          }} className="space-y-4">
            <div>
              <label className="block text-xs mb-1">Nama Pelanggan (Tamu Toko)</label>
              <input type="text" name="customerName" placeholder="Contoh: Budi (Datang ke Toko)" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs mb-1">No. HP / WhatsApp Pelanggan (Opsional)</label>
              <input type="text" name="customerPhone" placeholder="0812xxxx" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs mb-1">Pilih Unit Console</label>
              <select name="psConsoleId" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
                {consoles.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.type}) - Rp {c.pricePerHour.toLocaleString()}/jam</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1">Tanggal Main</label>
                <input type="date" name="bookingDate" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs mb-1">Jam Mulai (Contoh: 14:00)</label>
                <input type="text" name="startTime" placeholder="14:00" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1">Durasi (Jam)</label>
              <select name="durationHours" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
                <option value={1}>1 Jam</option>
                <option value={2}>2 Jam</option>
                <option value={3}>3 Jam</option>
                <option value={4}>4 Jam</option>
                <option value={5}>5 Jam</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-green-600/20">
              Proses Sewa Tunai & Kunci Slot Jam
            </button>
          </form>
        </div>
      )}
    </div>
  );
}