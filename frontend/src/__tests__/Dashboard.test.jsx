import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

vi.mock('axios');
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockVehicles = [
  { _id: '1', make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
  { _id: '2', make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 0 },
];

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Never resolves
    renderDashboard();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders list of vehicles', async () => {
    axios.get.mockResolvedValueOnce({ data: { vehicles: mockVehicles } });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    });

    // Check formatting
    expect(screen.getByText('25,000')).toBeInTheDocument();
    // "in stock" text appears in both the stat card and vehicle card
    expect(screen.getAllByText(/in stock/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThan(0);
  });

  it('calls toast.error on API failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderDashboard();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load vehicles. Please try again later.');
    });
  });
});
