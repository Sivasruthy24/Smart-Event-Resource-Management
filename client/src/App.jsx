import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const App = () => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [eventDate, setEventDate] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const currentUser = localStorage.getItem('currentUser') || "Student";
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || currentUser === 'Admin';
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      fetchData();
    }
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    try {
      const resData = await axios.get('http://localhost:5000/api/resources');
      const bookData = await axios.get('http://localhost:5000/api/bookings');
      setResources(resData.data);
      setBookings(bookData.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        resourceName: selectedResource.name,
        studentName: currentUser,
        date: new Date().toISOString(),
        eventDate: eventDate,
        purpose: purpose,
        status: 'Pending'
      });
      alert(`Booking request received for ${selectedResource.name}!`);
      setShowModal(false);
      setEventDate('');
      setPurpose('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || "Booking failed");
    }
  };

  const isBookedOnDate = (resourceName) => {
      if (!eventDate) return false;
      const existing = bookings.find(b => 
          b.resourceName === resourceName && 
          b.eventDate && b.eventDate.split('T')[0] === eventDate &&
          b.status !== 'Rejected'
      );
      return !!existing;
  };

  return (
    <div className="h-full bg-slate-50 font-sans p-4 md:p-8 overflow-y-auto">
      <header className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Select Event Date</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <input 
                type="date" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)} 
                min={new Date().toISOString().split('T')[0]}
                className="border-2 border-slate-300 p-3 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors w-full sm:w-auto"
            />
            {!eventDate && (
                <p className="text-slate-500 font-medium">Please select a date to see available resources.</p>
            )}
        </div>
      </header>

      {loading ? (
          <div className="text-slate-500 text-center py-10 font-bold">Loading Resources...</div>
      ) : !eventDate ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
              <CalendarCheck className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Waiting for date selection...</h3>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.map((item) => {
            const booked = isBookedOnDate(item.name);
            const displayStatus = booked ? 'Already Booked' : (item.status || 'Available');
            
            return (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    displayStatus === 'Available' ? 'bg-green-100 text-green-700' : 
                    displayStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    • {displayStatus}
                  </span>
                </div>
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                <p className="text-xs text-blue-600 font-bold uppercase mt-1">{item.category}</p>
                <p className="text-slate-600 mt-3 text-sm line-clamp-3">{item.description}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedResource(item);
                  setShowModal(true);
                }}
                disabled={displayStatus !== 'Available'}
                className={`mt-6 w-full py-3 rounded-lg font-bold text-sm transition-all ${
                  displayStatus === 'Available'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                {displayStatus === 'Available' ? 'Book Now' : 'Unavailable'}
              </button>
            </div>
          )})}
        </div>
      )}

      {/* BOOKING MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Book {selectedResource?.name}</h3>
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Selected Date</label>
                <input 
                  type='date' 
                  value={eventDate}
                  disabled
                  className='border border-slate-200 bg-slate-50 text-slate-500 w-full p-2.5 rounded-lg outline-none' 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Purpose</label>
                <textarea 
                  name='purpose' 
                  placeholder='Enter Purpose of Event (e.g., Club Meeting, Cultural Fest)' 
                  required 
                  rows="3"
                  className='border border-slate-300 w-full p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none'
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;