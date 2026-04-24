import React, { useState } from 'react';
import { LayoutDashboard, Package, CalendarCheck, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentUser = localStorage.getItem('currentUser') || "Student";
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || currentUser === 'Admin';
  
  // Hide Sidebar on login page
  if (location.pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 bg-[#1e293b] text-white flex justify-between items-center z-50 fixed w-full top-0">
        <div className="flex items-center gap-2 font-bold tracking-tight text-sm">Smart Event Resource Planning</div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        fixed md:sticky top-0 left-0 h-screen w-64
        bg-[#1e293b] text-white flex flex-col flex-shrink-0 z-40 transition-transform
      `}>
        <div className="p-6 border-b border-slate-700 mt-16 md:mt-0">
          <h1 className="text-lg leading-tight font-extrabold tracking-tight mb-6">Smart Event Resource Planning</h1>
          
          <div className="flex items-center gap-3 mb-6">
            <UserCircle className="w-10 h-10 text-blue-400" />
            <div>
              <p className="font-bold text-sm leading-tight">{currentUser}</p>
              <p className="text-xs text-slate-400">{isAdmin ? 'Admin' : 'Student'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {!isAdmin && (
            <>
              <Link to="/" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === '/' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <LayoutDashboard size={20} />
                Resource Gallery
              </Link>
              <Link to="/my-bookings" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === '/my-bookings' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <CalendarCheck size={20} />
                My Bookings
              </Link>
            </>
          )}
          
          {isAdmin && (
            <>
              <Link to="/admin" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === '/admin' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <LayoutDashboard size={20} />
                Live Registry
              </Link>
              <Link to="/admin/inventory" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === '/admin/inventory' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <Package size={20} />
                Manage Inventory
              </Link>
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
      
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  );
};
export default Sidebar;
