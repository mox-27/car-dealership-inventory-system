import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../pages/Dashboard';
import VehicleForm from '../components/VehicleForm';
import VehicleCard from '../components/VehicleCard';
import * as AuthContextModule from '../context/AuthContext';
import axios from 'axios';

vi.mock('axios');

describe('Admin Controls', () => {
  const mockVehicle = {
    _id: '123',
    make: 'Ford',
    model: 'F-150',
    category: 'Truck',
    price: 35000,
    quantity: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('VehicleCard Admin Actions', () => {
    it('does not show admin buttons for regular users', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ user: { role: 'user' } });
      render(<VehicleCard vehicle={mockVehicle} onUpdate={vi.fn()} />);
      
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /restock/i })).not.toBeInTheDocument();
    });

    it('shows admin buttons for admin users', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ user: { role: 'admin' } });
      render(<VehicleCard vehicle={mockVehicle} onUpdate={vi.fn()} />);
      
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /restock/i })).toBeInTheDocument();
    });

    it('calls delete API when delete is clicked', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ user: { role: 'admin' } });
      const mockOnUpdate = vi.fn();
      axios.delete.mockResolvedValueOnce({ data: {} });
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      render(<VehicleCard vehicle={mockVehicle} onUpdate={mockOnUpdate} />);
      const user = userEvent.setup();
      
      await user.click(screen.getByRole('button', { name: /delete/i }));
      
      expect(axios.delete).toHaveBeenCalledWith('/api/vehicles/123');
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled();
      });
    });

    it('calls restock API when restock is clicked', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ user: { role: 'admin' } });
      const mockOnUpdate = vi.fn();
      axios.post.mockResolvedValueOnce({ data: {} });
      
      render(<VehicleCard vehicle={mockVehicle} onUpdate={mockOnUpdate} />);
      const user = userEvent.setup();
      
      // Assume restock prompts or just sends a default quantity, or we have a prompt mock.
      // We will implement restock by calling prompt(). Let's mock window.prompt
      vi.spyOn(window, 'prompt').mockReturnValue('5');
      
      await user.click(screen.getByRole('button', { name: /restock/i }));
      
      expect(window.prompt).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith('/api/vehicles/123/restock', { quantity: 5 });
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('VehicleForm Component', () => {
    it('renders form fields', () => {
      render(
        <BrowserRouter>
          <VehicleForm onSubmit={vi.fn()} onCancel={vi.fn()} />
        </BrowserRouter>
      );
      
      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    });
  });
});
