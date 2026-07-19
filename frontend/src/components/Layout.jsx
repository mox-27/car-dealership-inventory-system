import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Car, LogOut, User, Shield, Moon, Sun, Package } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[var(--paper)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--paper)] spec-border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <Car className="h-5 w-5 text-[var(--ink)]" />
              <div>
                <span className="font-display text-2xl text-[var(--ink)] tracking-widest">AutoVerse</span>
              </div>
            </Link>

            {/* Nav Right */}
            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center border spec-border bg-[var(--panel)] text-[var(--ink)] hover:bg-[var(--bg-input-hover)] transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {user ? (
                <>
                  {/* User info chip */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border spec-border bg-[var(--panel)]">
                    <div className="w-5 h-5 flex items-center justify-center bg-[var(--ink)] text-[var(--paper)]">
                      {user.role === 'admin' ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-xs font-mono font-medium text-[var(--ink)] uppercase tracking-wider">{user.name || user.email}</span>
                    {user.role === 'admin' && (
                      <span className="stamp-badge border-[var(--ink)] text-[var(--ink)]">
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Orders link */}
                  <Link
                    to="/orders"
                    className="flex items-center gap-1.5 text-xs font-mono font-medium uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">Orders</span>
                  </Link>

                  {/* Logout button */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 text-xs font-mono font-medium uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="btn-outline px-4 py-1.5 text-xs font-mono uppercase tracking-wider"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex flex-col ${isHome ? 'overflow-y-auto no-scrollbar' : 'overflow-hidden'}`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto bg-[var(--paper)] spec-border-t">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-[var(--ink)]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--ink)]">AutoVerse</span>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            © {new Date().getFullYear()} AUTOVERSE DEALERSHIPS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
