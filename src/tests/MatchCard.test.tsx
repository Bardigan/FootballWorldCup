import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchCard } from '../components/MatchCard';
import type { Match } from '../types';

const mockMatch: Match = {
  id: 'test-match-1',
  homeTeam: 'Spain',
  awayTeam: 'Brazil',
  homeScore: 2,
  awayScore: 1,
  startTime: new Date('2023-01-01T15:30:00Z'),
};

describe('MatchCard Component', () => {
  const mockOnUpdateScore = vi.fn();
  const mockOnFinishGame = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders match information correctly', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    expect(screen.getByText('Spain')).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Total: 3')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  test('displays formatted start time', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    expect(screen.getByText(/Started at/)).toBeInTheDocument();
  });

  test('shows action buttons in view mode', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    expect(screen.getByText('Update Score')).toBeInTheDocument();
    expect(screen.getByText('Finish Match')).toBeInTheDocument();
  });

  test('enters edit mode when Update Score is clicked', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    fireEvent.click(screen.getByText('Update Score'));
    
    expect(screen.getByText('Save Score')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2);
  });

  test('updates score inputs in edit mode', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    fireEvent.click(screen.getByText('Update Score'));
    
    const inputs = screen.getAllByRole('spinbutton');
    const homeInput = inputs[0];
    const awayInput = inputs[1];
    
    expect(homeInput).toHaveValue(2);
    expect(awayInput).toHaveValue(1);
    
    fireEvent.change(homeInput, { target: { value: '3' } });
    fireEvent.change(awayInput, { target: { value: '2' } });
    
    expect(homeInput).toHaveValue(3);
    expect(awayInput).toHaveValue(2);
  });

  test('saves valid scores and exits edit mode', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    fireEvent.click(screen.getByText('Update Score'));
    
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    
    fireEvent.click(screen.getByText('Save Score'));
    
    expect(mockOnUpdateScore).toHaveBeenCalledWith('test-match-1', 3, 2);
    expect(screen.getByText('Update Score')).toBeInTheDocument();
  });

  test('shows alert for invalid scores', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    fireEvent.click(screen.getByText('Update Score'));
    
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '-1' } });
    
    fireEvent.click(screen.getByText('Save Score'));
    
    expect(window.alert).toHaveBeenCalledWith('Please enter valid scores (0 or higher)');
    expect(mockOnUpdateScore).not.toHaveBeenCalled();
  });

  test('cancels edit mode and resets values', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    fireEvent.click(screen.getByText('Update Score'));
    
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '5' } });
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.getByText('Update Score')).toBeInTheDocument();
    expect(mockOnUpdateScore).not.toHaveBeenCalled();
    
    fireEvent.click(screen.getByText('Update Score'));
    const newInputs = screen.getAllByRole('spinbutton');
    expect(newInputs[0]).toHaveValue(2);
  });

  test('calls onFinishGame when Finish Match is clicked', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    fireEvent.click(screen.getByText('Finish Match'));
    
    expect(mockOnFinishGame).toHaveBeenCalledWith('test-match-1');
  });

  test('handles NaN scores correctly', () => {
    render(
      <MatchCard 
        match={mockMatch}
        onUpdateScore={mockOnUpdateScore}
        onFinishGame={mockOnFinishGame}
      />
    );
    
    fireEvent.click(screen.getByText('Update Score'));
    
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: 'abc' } });
    
    fireEvent.click(screen.getByText('Save Score'));
    
    expect(window.alert).toHaveBeenCalledWith('Please enter valid scores (0 or higher)');
    expect(mockOnUpdateScore).not.toHaveBeenCalled();
  });
});