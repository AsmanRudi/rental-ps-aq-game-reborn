import { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Clock, Monitor, Receipt, CheckCircle2, Clock3, XCircle, Printer } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  
useEffect(() => {
  let cancelled = false;

  const fetchMyBookings = async () => {
    try {
      const { data } = await API.get('/bookings');

      if (!cancelled) {
        setBookings(data);
      }
    } catch (err) {
      if (!cancelled) {
        console.error('Gagal mengambil data booking:', err);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchMyBookings();

  return () => {
    cancelled = true;
  };
}, []);


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
          <div>Pelanggan: ${b.user?.name || 'Member'}</div>
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Dikonfirmasi</span>;
      case 'PAID':
        return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> Menunggu Verifikasi Admin</span>;
      case 'REJECTED':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Ditolak</span>;
      default:
        return <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> Menunggu Pembayaran</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-700 pb-4">
        <Receipt className="w-8 h-8 text-indigo-400" />
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Riwayat Booking Saya</h1>
          <p className="text-gray-400 text-sm">Daftar transaksi dan jadwal rental PS yang pernah kamu buat</p>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 text-gray-400">Memuat riwayat booking...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-2xl text-center border border-gray-700">
          <p className="text-gray-400 mb-2">Kamu belum memiliki riwayat booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((item) => (
            <div key={item._id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-indigo-400" /> {item.psConsole?.name || 'Unit PS'}
                    </h3>
                    <p className="text-xs text-indigo-300">
                      {item.psConsole?.type} • Rp {item.psConsole?.pricePerHour?.toLocaleString()} / jam
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="bg-gray-900/60 p-3 rounded-xl space-y-2 text-sm border border-gray-700/50">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Tanggal: <strong>{item.bookingDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Jam Main: <strong>{item.startTime} - {item.endTime}</strong> ({item.durationHours} Jam)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 block">Total Pembayaran</span>
                  <span className="text-lg font-extrabold text-green-400">Rp {item.totalPrice?.toLocaleString()}</span>
                </div>
                {item.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handlePrintReceipt(item)}
                    className="bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Cetak Struk
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}