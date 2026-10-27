import { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Clock, Monitor, UploadCloud, CheckCircle, MessageSquare } from 'lucide-react';

export default function Home() {
  const [consoles, setConsoles] = useState([]);
  const [selectedConsole, setSelectedConsole] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // State Filter Tipe Console
  const [filterType, setFilterType] = useState('ALL');

   
useEffect(() => {
  let cancelled = false;

  const loadConsoles = async () => {
    try {
      const { data } = await API.get('/consoles');

      if (cancelled) return;

      setConsoles(data);

      if (data.length > 0) {
        setSelectedConsole(data[0]);
      }
    } catch (err) {
      if (!cancelled) {
        console.error('Gagal mengambil daftar konsol:', err);
        setErrorMsg('Gagal memuat daftar PlayStation.');
      }
    }
  };

  loadConsoles();

  return () => {
    cancelled = true;
  };
}, []);



  const fetchSlots = async (psId, date) => {
    setLoadingSlots(true);
    try {
      const { data } = await API.get(`/bookings/slots?psId=${psId}&date=${date}`);
      setSlots(data.slots);
    } catch (err) {
      console.error(err);
    }
    setLoadingSlots(false);
  };

  
useEffect(() => {
  let cancelled = false;

  const loadSlots = async () => {
    if (!selectedConsole?._id || !selectedDate) {
      setSlots([]);
      return;
    }

    setLoadingSlots(true);

    try {
      const { data } = await API.get(
        `/bookings/slots?psId=${selectedConsole._id}&date=${selectedDate}`
      );

      if (!cancelled) {
        setSlots(data.slots);
        setErrorMsg('');
      }
    } catch (err) {
      if (!cancelled) {
        console.error('Gagal mengambil jadwal:', err);
        setErrorMsg('Gagal memuat jadwal bermain.');
      }
    } finally {
      if (!cancelled) {
        setLoadingSlots(false);
      }
    }
  };

  loadSlots();

  return () => {
    cancelled = true;
  };
}, [selectedConsole, selectedDate]);


  const handleBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      alert('Silakan login terlebih dahulu untuk melakukan booking!');
      return;
    }

    try {
      const { data } = await API.post('/bookings', {
        psConsoleId: selectedConsole._id,
        bookingDate: selectedDate,
        startTime,
        durationHours: Number(duration),
      });
      setCurrentBooking(data);
      setSuccessMsg('Booking berhasil dibuat! Silakan lakukan pembayaran melalui QRIS di bawah dan upload buktinya.');
      fetchSlots(selectedConsole._id, selectedDate);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal melakukan booking');
    }
  };

  const handleUploadPayment = async (e) => {
    e.preventDefault();
    if (!paymentFile || !currentBooking) return;

    const formData = new FormData();
    formData.append('image', paymentFile);

    try {
      const { data } = await API.put(`/bookings/${currentBooking._id}/pay`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCurrentBooking(data);
      setSuccessMsg('Bukti pembayaran berhasil diupload! Menunggu konfirmasi admin.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengupload bukti pembayaran');
    }
  };

  // Filter console berdasarkan tipe yang dipilih
  const filteredConsoles = filterType === 'ALL' 
    ? consoles 
    : consoles.filter(c => c.type === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-400 mb-2">AQ Game Reborn - Rental PS</h1>
        <p className="text-gray-400">Pilih unit console, cek jam kosong secara real-time, dan booking langsung </p>
          <p className="text-red-400 text-bold">Lakukan Registrasi dulu pada Tombol Regis di atas, Bila pengen Booking Jadwal PS</p>
        
      </div>

      {errorMsg && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl mb-6">{errorMsg}</div>}
      {successMsg && <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-xl mb-6 flex items-center gap-2"><CheckCircle /> {successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom 1 & 2: Pilih Konsol & Slot Jam */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h2 className="text-xl font-bold flex items-center gap-2"><Monitor className="text-indigo-400" /> Pilih Unit Console</h2>
              
              {/* Tombol Filter Tipe PS */}
              <div className="flex gap-1.5 bg-gray-900 p-1 rounded-xl border border-gray-700 text-xs">
                {['ALL', 'PS5', 'PS4', 'PS3'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition ${filterType === type ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredConsoles.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedConsole(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${selectedConsole?._id === item._id ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 bg-gray-900 hover:border-gray-600'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">{item.name}</span>
                    <span className="text-xs bg-indigo-600 px-2 py-1 rounded font-semibold">{item.type}</span>
                  </div>
                  <p className="text-sm text-indigo-300 font-semibold">Rp {item.pricePerHour.toLocaleString()} / jam</p>
                  <p className="text-xs text-gray-400 mt-1">{item.description || 'Kondisi Prima & Siap Main'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tampilan Visual Slot Jam */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="text-indigo-400" /> Jadwal Slot Jam</h2>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {loadingSlots ? (
              <p className="text-center py-8 text-gray-400">Memuat slot jam...</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={slot.isBooked}
                    onClick={() => setStartTime(slot.time)}
                    className={`p-3 rounded-xl border text-center font-semibold text-sm transition ${
                      slot.isBooked
                        ? 'bg-red-900/40 border-red-700 text-red-300 cursor-not-allowed'
                        : startTime === slot.time
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-gray-900 border-gray-700 hover:border-indigo-500 text-green-400'
                    }`}
                  >
                    <div>{slot.time}</div>
                    <div className="text-[10px] mt-1 font-normal">
                      {slot.isBooked ? 'TERISI' : startTime === slot.time ? 'DIPILIH' : 'KOSONG'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom 3: Form Booking & QRIS Pembayaran */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Form Booking</h2>
            {selectedConsole && (
              <div className="mb-4 p-3 bg-gray-900 rounded-xl text-sm border border-gray-700">
                <p><span className="text-gray-400">Unit:</span> <strong className="text-indigo-300">{selectedConsole.name}</strong></p>
                <p><span className="text-gray-400">Tarif:</span> Rp {selectedConsole.pricePerHour.toLocaleString()} / jam</p>
                <p><span className="text-gray-400">Tanggal:</span> {selectedDate}</p>
                <p><span className="text-gray-400">Jam Mulai:</span> {startTime || 'Belum dipilih'}</p>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Durasi (Jam)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>1 Jam</option>
                  <option value={2}>2 Jam</option>
                  <option value={3}>3 Jam</option>
                  <option value={4}>4 Jam</option>
                  <option value={5}>5 Jam</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={!startTime}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/20"
              >
                Booking Sekarang
              </button>
            </form>
          </div>

          {/* Bagian Barkod / QRIS Pembayaran */}
          {currentBooking && (
            <div className="bg-gray-800 p-6 rounded-2xl border border-indigo-500 space-y-4">
              <div>
                <h2 className="text-lg font-bold mb-1 text-indigo-400">Pembayaran Booking</h2>
                <p className="text-xs text-gray-300">Total Tagihan: <strong className="text-white text-base">Rp {currentBooking.totalPrice.toLocaleString()}</strong></p>
              </div>
              
              <div className="bg-white p-4 rounded-xl flex flex-col items-center">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=AQ_GAME_REBORN_PAYMENT" 
                  alt="QRIS Barkod Bayar" 
                  className="rounded-lg shadow"
                />
                <span className="text-black text-xs font-bold mt-2">Scan QRIS untuk Bayar</span>
              </div>

              <form onSubmit={handleUploadPayment} className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">Upload Bukti Transfer / Bayar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaymentFile(e.target.files[0])}
                    className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
                  <UploadCloud className="w-4 h-4" /> Kirim Bukti Pembayaran
                </button>
              </form>

              {/* Tombol Konfirmasi WhatsApp Admin */}
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin%20AQ%20Game%20Reborn,%20saya%20sudah%20melakukan%20booking%20unit%20PS%20dengan%20total%20tagihan%20Rp%20${currentBooking.totalPrice.toLocaleString()}%20pada%20tanggal%20${selectedDate}%20jam%20${startTime}.%20Berikut%20bukti%20pembayarannya.`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 text-white block text-center"
              >
                <MessageSquare className="w-4 h-4" /> Konfirmasi ke WhatsApp Admin
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}