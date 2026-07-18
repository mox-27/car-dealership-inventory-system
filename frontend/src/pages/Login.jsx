import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Car, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm spec-panel animate-fade-in-up">
        {/* Header */}
        <div className="p-6 spec-border-b text-center bg-[var(--paper)]">
          <div className="inline-flex items-center justify-center mb-4 text-[var(--ink)]">
            <Car className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl text-[var(--ink)] tracking-widest uppercase">AutoVerse</h1>
          <p className="font-mono text-xs text-[var(--text-secondary)] mt-1 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        {/* Form body */}
        <div className="p-6 bg-[var(--panel)]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block font-mono text-xs text-[var(--text-secondary)] mb-1.5 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@dealership.com"
                  className="input-theme w-full pl-10 pr-4 py-3 text-sm font-mono"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block font-mono text-xs text-[var(--text-secondary)] mb-1.5 uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-theme w-full pl-10 pr-4 py-3 text-sm font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-signal w-full py-3 px-6 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'AUTHENTICATE'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 spec-border-t text-center">
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase">
              NO ACCOUNT?{' '}
              <Link to="/register" className="text-[var(--ink)] font-bold hover:underline underline-offset-4 decoration-[var(--signal)]">
                REGISTER
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
