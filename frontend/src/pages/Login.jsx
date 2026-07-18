import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, Car } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      login(response.data.token);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #0d0d1f 100%)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="grid-bg absolute inset-0" />
      </div>

      <div className="relative w-full max-w-md mx-auto px-4 py-8 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 glow" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
            <Car className="h-8 w-8 text-white animate-float" />
          </div>
          <h1 className="font-display text-3xl font-800 text-white">Welcome back</h1>
          <p className="mt-2 text-slate-400 text-sm">Sign in to your AutoVerse account</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 px-6 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:text-primary-light transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
