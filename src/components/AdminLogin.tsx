import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem('ibbani_admin_token', data.token);
      }

      // Login successful
      onLoginSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to connect to server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-dew-50 to-gold-50/80 flex items-center justify-center p-4">
      
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-dew-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-100/20 rounded-full blur-3xl" />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Header branding */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gold-500 text-white rounded-2xl mb-2">
            <LogIn className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gold-950">Ibbani Admin</h1>
          <p className="text-xs text-gold-600 font-sans">Central Management Portal</p>
        </div>

        {/* Login form card */}
        <div className="bg-white rounded-[32px] border border-gold-200/50 shadow-lg p-8 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error message */}
            {error && (
              <div className="flex items-start space-x-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm font-sans text-rose-700">{error}</p>
              </div>
            )}

            {/* Username field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-xs font-mono font-bold text-gold-700 uppercase tracking-wider">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                disabled={isLoading}
                className="w-full bg-gold-50 border border-gold-200/60 rounded-xl px-4 py-3 text-sm font-sans text-gold-950 placeholder-gold-400 focus:outline-none focus:ring-2 focus:ring-dew-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-mono font-bold text-gold-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={isLoading}
                  className="w-full bg-gold-50 border border-gold-200/60 rounded-xl px-4 py-3 pr-12 text-sm font-sans text-gold-950 placeholder-gold-400 focus:outline-none focus:ring-2 focus:ring-dew-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500 hover:text-dew-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-dew-600 to-dew-700 hover:from-dew-700 hover:to-dew-800 text-white font-mono font-bold text-sm py-3.5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating…</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login to Dashboard</span>
                </span>
              )}
            </button>

          </form>

          {/* Footer info */}
          <div className="pt-4 border-t border-gold-100/50">
            <p className="text-[11px] text-gold-600 text-center font-sans leading-relaxed">
              Admin credentials required. Contact management for access.
            </p>
          </div>

        </div>

        {/* Security notice */}
        <p className="text-center text-[10px] text-gold-500/60 font-mono uppercase tracking-wider mt-6">
          🔒 Secure Admin Portal
        </p>

      </div>

    </div>
  );
}
