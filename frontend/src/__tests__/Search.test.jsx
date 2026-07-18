import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchFilter from '../components/SearchFilter';

describe('SearchFilter Component', () => {
  it('renders search input and filter fields', () => {
    render(<SearchFilter onSearch={vi.fn()} />);
    
    expect(screen.getByPlaceholderText(/search make or model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch with correct parameters when form is submitted', async () => {
    const mockOnSearch = vi.fn();
    render(<SearchFilter onSearch={mockOnSearch} />);
    
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText(/search make or model/i), 'Toyota');
    // Using selectOptions for select element if it's a native select
    await user.selectOptions(screen.getByLabelText(/category/i), 'SUV');
    await user.type(screen.getByPlaceholderText(/min price/i), '20000');
    
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      make: 'Toyota',
      category: 'SUV',
      minPrice: '20000',
      maxPrice: ''
    });
  });

  it('calls onSearch with empty strings when reset is clicked', async () => {
    const mockOnSearch = vi.fn();
    render(<SearchFilter onSearch={mockOnSearch} />);
    
    const user = userEvent.setup();
    
    await user.type(screen.getByPlaceholderText(/search make or model/i), 'Toyota');
    await user.click(screen.getByRole('button', { name: /reset/i }));
    
    expect(screen.getByPlaceholderText(/search make or model/i)).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith({
      make: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
  });
});
