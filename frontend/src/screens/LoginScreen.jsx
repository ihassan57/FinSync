import React, { useState, useContext } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';
import { Eye, EyeOff, Fingerprint, Mail, Lock } from 'lucide-react';

export default function LoginScreen() {
  const { navigateTo } = useContext(FinSyncContext);
  const [email, setEmail] = useState('hassan@finsync.pk');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    navigateTo('dashboard', 'forward');
  };

  return (
    <div className="flex flex-col h-full bg-white px-6 py-8 overflow-y-auto no-scrollbar">
      {/* Top Logo */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center text-3xl font-extrabold tracking-tight">
          <span className="text-primary">Fin</span>
          <span className="text-slate-900">Sync</span>
        </div>
      </div>

      {/* Welcome Heading */}
      <div className="mt-8 text-center">
        <h1 className="text-title text-textPrimary">Welcome back 👋</h1>
        <p className="mt-1 text-sm text-textSecondary">Sign in to your account</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-5">
        {/* Email Input */}
        <div>
          <label className="text-label text-textPrimary block mb-1">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 w-5 h-5 text-textSecondary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white transition-all"
              placeholder="name@email.com"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-label text-textPrimary">Password</label>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-caption text-primary font-medium hover:underline">
              Forgot?
            </a>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 w-5 h-5 text-textSecondary" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-borderColor rounded-xl text-body text-textPrimary focus:outline-none focus:border-primary focus:bg-white transition-all"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 focus:outline-none text-textSecondary hover:text-textPrimary"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full mt-2 py-3 bg-primary text-white text-label font-semibold rounded-xl hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md shadow-blue-200"
        >
          Login
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-borderColor"></div>
        <span className="px-3 text-caption text-textSecondary uppercase tracking-wider font-semibold">or</span>
        <div className="flex-grow border-t border-borderColor"></div>
      </div>

      {/* Biometric CTA */}
      <button
        onClick={() => handleLogin()}
        type="button"
        className="w-full py-3 bg-slate-50 border border-borderColor rounded-xl text-label font-semibold text-textPrimary flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-[0.98] transition-all"
      >
        <Fingerprint className="w-5 h-5 text-primary animate-pulse" />
        Use Biometric Authentication
      </button>

      {/* Mock Footer links */}
      <div className="mt-auto pt-6 text-center">
        <p className="text-caption text-textSecondary">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-primary font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
