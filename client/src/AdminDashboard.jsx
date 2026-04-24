import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data.reverse()); // Show newest first
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status: newStatus });
      fetchBookings(); // Refresh the data automatically
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Update failed. Ensure backend has the PATCH route running.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading System Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans selection:bg-blue-100">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">System Admin Panel</h1>
          <p className="text-slate-500 mt-2 text-lg">Central hub for reviewing and managing all resource allocations.</p>
        </div>

      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-white shadow-2xl shadow-slate-200/50 rounded-2xl border border-slate-100 overflow-hidden">
          {/* Panel Header */}
          <div className="bg-slate-800 px-6 py-5 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Live Booking Registry
            </h3>
            <span className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">{bookings.length} Total Records</span>
          </div>

          {/* Table Data */}
          {bookings.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-500 font-medium text-lg">The registry is currently empty.</p>
              <p className="text-slate-400 text-sm mt-1">Bookings made by users will securely appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest">
                    <th className="p-5 font-bold">Trace ID</th>
                    <th className="p-5 font-bold">Requester</th>
                    <th className="p-5 font-bold">Resource Target</th>
                    <th className="p-5 font-bold">Date & Purpose</th>
                    <th className="p-5 font-bold text-center">Status</th>
                    <th className="p-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-blue-50/50 transition-colors group">
                      {/* ID */}
                      <td className="p-5 text-xs text-slate-400 font-mono tracking-wider align-middle">
                        #{booking._id?.toString().slice(-8) || 'SYS_REC'}
                      </td>
                      
                      {/* User */}
                      <td className="p-5 align-middle">
                        <div className="font-bold text-slate-800">{booking.studentName || 'Anonymous User'}</div>
                      </td>
                      
                      {/* Resource */}
                      <td className="p-5 align-middle">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold border border-slate-200">
                          {booking.resourceName}
                        </div>
                      </td>
                      
                      {/* Date & Purpose */}
                      <td className="p-5 align-middle">
                        <div className="font-semibold text-slate-800 text-sm">
                           Event Date: {booking.eventDate ? new Date(booking.eventDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                           Requested On: {new Date(booking.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-slate-500 max-w-[200px] truncate mt-1" title={booking.purpose}>
                          {booking.purpose || 'General usage'}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="p-5 align-middle text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ring-1 ring-inset ${
                          booking.status === 'Booked' ? 'bg-rose-50 text-rose-700 ring-rose-500/20' : 
                          booking.status === 'Pending' ? 'bg-amber-50 text-amber-700 ring-amber-500/20' : 
                          booking.status === 'Rejected' ? 'bg-slate-100 text-slate-500 ring-slate-400/20' : 
                          'bg-emerald-50 text-emerald-700 ring-emerald-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            booking.status === 'Booked' ? 'bg-rose-500' :
                            booking.status === 'Pending' ? 'bg-amber-500' :
                            booking.status === 'Rejected' ? 'bg-slate-400' :
                            'bg-emerald-500'
                          }`}></span>
                          {booking.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-5 align-middle text-right">
                        {booking.status === 'Pending' ? (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => updateBookingStatus(booking._id, 'Rejected')}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => updateBookingStatus(booking._id, 'Booked')}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-sm"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
