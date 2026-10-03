import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, User, Lock, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, register } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forms
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await login(formData.email, formData.password);
        if (user) {
          navigate(user.role === 'admin' ? '/admin' : redirect);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          addToast('Passwords do not match.', 'error');
          setLoading(false);
          return;
        }
        await register(formData.name, formData.email, formData.password, formData.phone);
        navigate(redirect);
      }
    } catch (err) {
      addToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, password) => {
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        navigate(user.role === 'admin' ? '/admin' : redirect);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {mode === 'login' 
              ? 'Sign in to access your saved wishlist, addresses, and tracking.' 
              : 'Join TECHNOVA for warranty tracking and exclusive tech deals.'}
          </p>
        </div>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700/80 space-y-2">
          <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick Demo 1-Click Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('demo@technova.com', 'User@123')}
              className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[11px] font-bold text-gray-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 shadow-sm transition-all"
            >
              👤 Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@technova.com', 'Admin@123')}
              className="py-2 px-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-bold hover:bg-brand-600 dark:hover:bg-brand-400 shadow-sm transition-all"
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Phone (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>SSL Secured 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}
