import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem('currentUser') || 'Student';

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      // Filter bookings explicitly for the logged-in user
      const userBookings = response.data.filter(b => b.studentName === currentUser);
      setBookings(userBookings.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading your bookings...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <header className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800">My Bookings</h1>
        <p className="text-slate-500 mt-2">Track the status of all your resource requests.</p>
      </header>

      <main className="max-w-6xl mx-auto">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Bookings Found</h3>
            <p className="text-slate-500">You haven't requested any resources yet. Head over to the Resource Gallery to make a booking!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  booking.status === 'Booked' ? 'bg-rose-500' :
                  booking.status === 'Pending' ? 'bg-amber-400' :
                  booking.status === 'Rejected' ? 'bg-slate-400' :
                  'bg-emerald-500'
                }`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800">{booking.resourceName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    booking.status === 'Booked' ? 'bg-rose-50 text-rose-700' :
                    booking.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                    booking.status === 'Rejected' ? 'bg-slate-100 text-slate-600' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="text-sm text-slate-600 space-y-2 flex-grow mb-6">
                  <p><strong>Event Date:</strong> {booking.eventDate ? new Date(booking.eventDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                  <p><strong>Requested On:</strong> {new Date(booking.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  <p><strong>Purpose:</strong> <span className="italic">{booking.purpose || 'None specified'}</span></p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">Reference ID: #{booking._id?.toString().slice(-6) || 'SYS'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
