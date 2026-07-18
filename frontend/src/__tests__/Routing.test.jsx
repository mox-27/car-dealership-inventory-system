import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import * as AuthContextModule from '../context/AuthContext';

describe('Routing Guards', () => {
  const renderWithRoutes = (initialRoute) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  describe('ProtectedRoute', () => {
    it('redirects to /login when user is not authenticated', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ token: null });
      renderWithRoutes('/protected');
      
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders child routes when user is authenticated', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ token: 'fake-token' });
      renderWithRoutes('/protected');
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  describe('AdminRoute', () => {
    it('redirects to /login when user is not authenticated', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ token: null, user: null });
      renderWithRoutes('/admin');
      
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects to / when user is authenticated but not an admin', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ 
        token: 'fake-token', 
        user: { role: 'user' } 
      });
      // Need a catch-all for '/' to test redirect
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<div>Admin Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
      
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('renders child routes when user is admin', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ 
        token: 'fake-token', 
        user: { role: 'admin' } 
      });
      renderWithRoutes('/admin');
      
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });
});
