import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { AuthProvider } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

// Mock axios
vi.mock('axios');
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const renderWithRouterAndAuth = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Auth Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Login Component', () => {
    it('renders login form', () => {
      renderWithRouterAndAuth(<Login />);
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows error on failed login', async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { error: { message: 'Invalid credentials' } } },
      });

      renderWithRouterAndAuth(<Login />);
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
      });
    });
  });

  describe('Register Component', () => {
    it('renders register form', () => {
      renderWithRouterAndAuth(<Register />);
      expect(screen.getByRole('heading', { name: /join autoverse/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('shows error on failed registration', async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { error: { message: 'Email already exists' } } },
      });

      renderWithRouterAndAuth(<Register />);
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Email already exists');
      });
    });
  });
});
