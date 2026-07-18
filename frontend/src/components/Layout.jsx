import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, User, Shield, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #0d0d1f 50%, #0a0a14 100%)' }}>
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full opacity-6" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
        <div className="grid-bg absolute inset-0" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(10, 10, 20, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99, 102, 241, 0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity glow-sm" />
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                  <Car className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-display font-800 text-xl text-white tracking-tight">AutoVerse</span>
              </div>
            </Link>

            {/* Nav Right */}
            <div className="flex items-center gap-3">
              {user && (
                <>
                  {/* User info chip */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass" style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                      {user.role === 'admin' ? (
                        <Shield className="h-3.5 w-3.5 text-white" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-300">{user.name || user.email}</span>
                    {user.role === 'admin' && (
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all hover:bg-white/5"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto" style={{ background: 'rgba(10,10,20,0.8)', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-slate-400">AutoVerse</span>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} AutoVerse Dealerships. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
