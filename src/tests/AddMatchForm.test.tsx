import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddMatchForm } from '../components/AddMatchForm';

describe('AddMatchForm Component', () => {
  const mockOnAddMatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders collapsed state initially', () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    expect(screen.getByText('Start New Match')).toBeInTheDocument();
    expect(screen.queryByText('Add New Match')).not.toBeInTheDocument();
  });

  test('expands form when Start New Match button is clicked', () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    expect(screen.getByText('Add New Match')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter home team name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter away team name')).toBeInTheDocument();
  });

  test('closes form when X button is clicked', () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    fireEvent.click(screen.getByLabelText('Close form'));
    
    expect(screen.getByText('Start New Match')).toBeInTheDocument();
    expect(screen.queryByText('Add New Match')).not.toBeInTheDocument();
  });

  test('closes form when Cancel button is clicked', () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.getByText('Start New Match')).toBeInTheDocument();
  });

  test('disables submit button when form is invalid', () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const submitButton = screen.getByText('Start Match');
    expect(submitButton).toBeDisabled();
  });

  test('enables submit button when form is valid', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByRole('textbox', { name: /home team/i });
    const awayTeamInput = screen.getByRole('textbox', { name: /away team/i });
    
    fireEvent.change(homeTeamInput, { target: { value: 'Spain' } });
    fireEvent.change(awayTeamInput, { target: { value: 'Brazil' } });
    
    await waitFor(() => {
      const submitButton = screen.getByText('Start Match');
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('shows validation errors on blur', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    
    fireEvent.focus(homeTeamInput);
    fireEvent.blur(homeTeamInput);
    
    await waitFor(() => {
      expect(screen.getByText('Home team name is required')).toBeInTheDocument();
    });
  });

  test('shows error for teams being the same', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    const awayTeamInput = screen.getByPlaceholderText('Enter away team name');
    
    fireEvent.change(homeTeamInput, { target: { value: 'Spain' } });
    fireEvent.blur(homeTeamInput);
    
    fireEvent.change(awayTeamInput, { target: { value: 'Spain' } });
    fireEvent.blur(awayTeamInput);
    
    await waitFor(() => {
      const errorMessages = screen.getAllByText('Teams must be different');
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  test('shows error for names too short', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    
    fireEvent.change(homeTeamInput, { target: { value: 'A' } });
    fireEvent.blur(homeTeamInput);
    
    await waitFor(() => {
      expect(screen.getByText('Home team name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    const awayTeamInput = screen.getByPlaceholderText('Enter away team name');
    
    fireEvent.change(homeTeamInput, { target: { value: 'Spain' } });
    fireEvent.change(awayTeamInput, { target: { value: 'Brazil' } });
    
    await waitFor(() => {
      const submitButton = screen.getByText('Start Match');
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(screen.getByText('Start Match'));
    
    expect(mockOnAddMatch).toHaveBeenCalledWith('Spain', 'Brazil');
    expect(screen.getByText('Start New Match')).toBeInTheDocument();
  });

  test('trims whitespace from team names', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    const awayTeamInput = screen.getByPlaceholderText('Enter away team name');
    
    fireEvent.change(homeTeamInput, { target: { value: '  Spain  ' } });
    fireEvent.change(awayTeamInput, { target: { value: '  Brazil  ' } });
    
    await waitFor(() => {
      const submitButton = screen.getByText('Start Match');
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(screen.getByText('Start Match'));
    
    expect(mockOnAddMatch).toHaveBeenCalledWith('Spain', 'Brazil');
  });

  test('resets form after successful submission', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    const awayTeamInput = screen.getByPlaceholderText('Enter away team name');
    
    fireEvent.change(homeTeamInput, { target: { value: 'Spain' } });
    fireEvent.change(awayTeamInput, { target: { value: 'Brazil' } });
    
    await waitFor(() => {
      const submitButton = screen.getByText('Start Match');
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(screen.getByText('Start Match'));
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    expect(screen.getByPlaceholderText('Enter home team name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter away team name')).toHaveValue('');
  });

  test('shows away team validation error on blur', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const awayTeamInput = screen.getByPlaceholderText('Enter away team name');
    
    fireEvent.focus(awayTeamInput);
    fireEvent.blur(awayTeamInput);
    
    await waitFor(() => {
      expect(screen.getByText('Away team name is required')).toBeInTheDocument();
    });
  });

  test('shows away team short name error', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const awayTeamInput = screen.getByPlaceholderText('Enter away team name');
    
    fireEvent.change(awayTeamInput, { target: { value: 'B' } });
    fireEvent.blur(awayTeamInput);
    
    await waitFor(() => {
      expect(screen.getByText('Away team name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  test('validates teams are different case insensitive', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    const awayTeamInput = screen.getByPlaceholderText('Enter away team name');
    
    fireEvent.change(homeTeamInput, { target: { value: 'SPAIN' } });
    fireEvent.blur(homeTeamInput);
    
    fireEvent.change(awayTeamInput, { target: { value: 'spain' } });
    fireEvent.blur(awayTeamInput);
    
    await waitFor(() => {
      // Use getAllByText to handle multiple elements
      const errorMessages = screen.getAllByText('Teams must be different');
      expect(errorMessages).toHaveLength(2); // Both fields should show the error
    });
  });

  test('clears errors when valid input is entered', async () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    
    // First trigger error
    fireEvent.focus(homeTeamInput);
    fireEvent.blur(homeTeamInput);
    
    await waitFor(() => {
      expect(screen.getByText('Home team name is required')).toBeInTheDocument();
    });
    
    // Then fix it
    fireEvent.change(homeTeamInput, { target: { value: 'Spain' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Home team name is required')).not.toBeInTheDocument();
    });
  });

  test('form resets when cancelled', () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const homeTeamInput = screen.getByPlaceholderText('Enter home team name');
    fireEvent.change(homeTeamInput, { target: { value: 'Spain' } });
    
    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.click(screen.getByText('Start New Match'));
    
    expect(screen.getByPlaceholderText('Enter home team name')).toHaveValue('');
  });

  test('prevents form submission on enter when invalid', () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const form = screen.getByRole('form', { name: 'Add match form' });
    fireEvent.submit(form);
    
    expect(mockOnAddMatch).not.toHaveBeenCalled();
    expect(screen.getByText('Add New Match')).toBeInTheDocument();
  });

  test('submit button has correct tooltip when disabled', () => {
    render(<AddMatchForm onAddMatch={mockOnAddMatch} />);
    
    fireEvent.click(screen.getByText('Start New Match'));
    
    const submitButton = screen.getByText('Start Match');
    expect(submitButton).toHaveAttribute('title', 'Please complete all required fields');
  });
});