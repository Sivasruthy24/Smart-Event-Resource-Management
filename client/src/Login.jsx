import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setLoading(true);
    setError('');

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      // NOTE: User must replace these strings with their actual EmailJS credentials
      await emailjs.send(
        'your_service_id', 
        'your_template_id', 
        { 
          to_email: email, 
          otp_code: generatedOtp 
        }, 
        'your_public_key'
      );
      console.log('OTP Sent successfully:', generatedOtp);
      setStep(2);
    } catch (err) {
      console.error('EmailJS Error:', err);
      // Fallback for demo purposes if EmailJS isn't configured yet
      alert(`For demo purposes, the OTP is ${generatedOtp} (EmailJS failed to send due to missing credentials. Check console!)`);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    
    // Mock Logic: Allow any 6 digit code for demo
    if (otp.length === 6) {
      if (email.toLowerCase() === 'admin@erp.com') {
        localStorage.setItem('currentUser', 'Admin');
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        localStorage.setItem('currentUser', email.split('@')[0]);
        localStorage.setItem('isAdmin', 'false');
        navigate('/');
      }
    } else {
      setError('Please enter a valid 6-digit code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-4xl font-extrabold text-slate-800 tracking-tight">
          Smart Event Resource Planning
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Secure Authentication System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-100">
          
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}

          {step === 1 ? (
            <form className="space-y-6" onSubmit={sendOTP}>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Enter Your Email</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="mt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu or admin@erp.com"
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-blue-300"
              >
                {loading ? 'Sending Code...' : 'Send OTP Code'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={verifyOTP}>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Verify OTP</h3>
              <p className="text-sm text-slate-500 text-center flex-col flex mb-6">
                <span>Code sent to: <strong className="text-slate-700">{email}</strong></span>
                <span className="text-xs mt-1 text-blue-600 cursor-pointer hover:underline" onClick={() => setStep(1)}>Change Email</span>
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-700 text-center">6-Digit Code</label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="appearance-none block w-full px-4 py-4 text-center text-2xl tracking-widest font-mono border border-slate-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
              >
                Secure Login
              </button>
              <div className="mt-4 text-center text-xs text-slate-400">
                Mock Mode: Any 6 digits will be accepted.
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
