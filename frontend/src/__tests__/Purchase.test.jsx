import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VehicleCard from '../components/VehicleCard';
import axios from 'axios';

vi.mock('axios');

describe('VehicleCard Purchase Flow', () => {
  const mockVehicle = {
    _id: '123',
    make: 'Toyota',
    model: 'Corolla',
    category: 'Sedan',
    price: 20000,
    quantity: 1,
  };

  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a Purchase button when in stock', () => {
    render(<VehicleCard vehicle={mockVehicle} onUpdate={mockOnUpdate} />);
    const button = screen.getByRole('button', { name: /purchase/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders a disabled Purchase button when out of stock', () => {
    render(<VehicleCard vehicle={{ ...mockVehicle, quantity: 0 }} onUpdate={mockOnUpdate} />);
    const button = screen.getByRole('button', { name: /purchase/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('calls purchase API and triggers onUpdate on click', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Purchase successful' } });
    render(<VehicleCard vehicle={mockVehicle} onUpdate={mockOnUpdate} />);
    
    const button = screen.getByRole('button', { name: /purchase/i });
    const user = userEvent.setup();
    await user.click(button);

    expect(axios.post).toHaveBeenCalledWith('/api/vehicles/123/purchase');
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });
  
  it('disables the button while loading', async () => {
    let resolveApi;
    axios.post.mockReturnValueOnce(new Promise((resolve) => {
      resolveApi = resolve;
    }));
    
    render(<VehicleCard vehicle={mockVehicle} onUpdate={mockOnUpdate} />);
    
    const button = screen.getByRole('button', { name: /purchase/i });
    const user = userEvent.setup();
    await user.click(button);
    
    expect(button).toBeDisabled();
    
    // Resolve the promise to finish the test cleanly
    resolveApi({ data: {} });
  });
});
