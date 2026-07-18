import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, User } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Car className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl text-slate-900 tracking-tight">AutoVerse</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                    <User className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">{user.name || user.email}</span>
                    {user.role === 'admin' && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:outline-none transition-colors"
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

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AutoVerse Dealerships. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
