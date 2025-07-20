import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LiveScoreBoard } from '../components/LiveScoreBoard';

vi.mock('../components/AddMatchForm', () => ({
  AddMatchForm: vi.fn((props: any) => (
    <div data-testid="add-match-form">
      <button onClick={() => props.onAddMatch('Spain', 'Brazil')}>
        Add Match Button
      </button>
    </div>
  ))
}));

vi.mock('../components/MatchCard', () => ({
  MatchCard: vi.fn((props: any) => (
    <div data-testid="match-card">
      <span>{props.match.homeTeam} vs {props.match.awayTeam}</span>
      <button onClick={() => props.onUpdateScore(props.match.id, 2, 1)}>
        Update Score
      </button>
      <button onClick={() => props.onFinishGame(props.match.id)}>
        Finish Game
      </button>
    </div>
  ))
}));

vi.mock('../components/modal/ConfirmationModal', () => ({
  ConfirmationModal: vi.fn((props: any) => 
    props.isOpen ? (
      <div data-testid="confirmation-modal">
        <span>{props.title}</span>
        <span>{props.message}</span>
        {props.buttons.map((button: any, index: number) => (
          <button key={index} onClick={button.onClick}>
            {button.text}
          </button>
        ))}
      </div>
    ) : null
  )
}));

vi.mock('../hooks/useScoreBoard', () => ({
  useScoreBoard: vi.fn()
}));

vi.mock('../hooks/useConfirmation', () => ({
  useConfirmation: vi.fn()
}));

import { useScoreBoard } from '../hooks/useScoreBoard';
import { useConfirmation } from '../hooks/useConfirmation';

const mockUseScoreBoard = useScoreBoard as ReturnType<typeof vi.fn>;
const mockUseConfirmation = useConfirmation as ReturnType<typeof vi.fn>;

describe('LiveScoreBoard Component', () => {
  const defaultScoreBoardMock = {
    matches: [],
    actions: {
      addMatch: vi.fn(),
      updateScore: vi.fn(),
      finishMatch: vi.fn(),
      clearAll: vi.fn(),
    }
  };

  const defaultConfirmationMock = {
    isOpen: false,
    options: null,
    showConfirmation: vi.fn(),
    hideConfirmation: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseScoreBoard.mockReturnValue(defaultScoreBoardMock);
    mockUseConfirmation.mockReturnValue(defaultConfirmationMock);
  });

  it('renders main layout with header and empty state', () => {
    render(<LiveScoreBoard />);
    
    expect(screen.getByText('Live Score Board')).toBeInTheDocument();
    expect(screen.getByText('No active matches')).toBeInTheDocument();
    expect(screen.getByText('Track ongoing World Cup matches and scores in real-time')).toBeInTheDocument();
    expect(screen.getByText('Start a new match to see it appear on the scoreboard')).toBeInTheDocument();
  });

  it('renders AddMatchForm component', () => {
    render(<LiveScoreBoard />);
    expect(screen.getByTestId('add-match-form')).toBeInTheDocument();
  });

  it('displays correct match count in empty state', () => {
    render(<LiveScoreBoard />);
    expect(screen.getByText('0 active matches')).toBeInTheDocument();
  });

  it('renders Current Matches section header', () => {
    render(<LiveScoreBoard />);
    expect(screen.getByText('Current Matches')).toBeInTheDocument();
  });

  it('renders footer with sorting information', () => {
    render(<LiveScoreBoard />);
    expect(screen.getByText(/Matches are sorted by total score/)).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<LiveScoreBoard />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Live Score Board');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Current Matches');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays matches when available', () => {
    const mockMatches = [
      {
        id: '1',
        homeTeam: 'Spain',
        awayTeam: 'Brazil',
        homeScore: 2,
        awayScore: 1,
        startTime: new Date(),
      }
    ];

    mockUseScoreBoard.mockReturnValue({
      matches: mockMatches,
      actions: {
        addMatch: vi.fn(),
        updateScore: vi.fn(),
        finishMatch: vi.fn(),
        clearAll: vi.fn(),
      }
    });

    render(<LiveScoreBoard />);
    expect(screen.getByTestId('match-card')).toBeInTheDocument();
    expect(screen.getByText('Spain vs Brazil')).toBeInTheDocument();
  });

  it('shows Clear All button when matches exist', () => {
    const mockMatches = [
      {
        id: '1',
        homeTeam: 'Spain',
        awayTeam: 'Brazil',
        homeScore: 2,
        awayScore: 1,
        startTime: new Date(),
      }
    ];

    mockUseScoreBoard.mockReturnValue({
      matches: mockMatches,
      actions: {
        addMatch: vi.fn(),
        updateScore: vi.fn(),
        finishMatch: vi.fn(),
        clearAll: vi.fn(),
      }
    });

    render(<LiveScoreBoard />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('displays correct match count when matches exist', () => {
    const mockMatches = [
      { id: '1', homeTeam: 'Spain', awayTeam: 'Brazil', homeScore: 2, awayScore: 1, startTime: new Date() },
      { id: '2', homeTeam: 'France', awayTeam: 'Germany', homeScore: 0, awayScore: 0, startTime: new Date() }
    ];

    mockUseScoreBoard.mockReturnValue({
      matches: mockMatches,
      actions: {
        addMatch: vi.fn(),
        updateScore: vi.fn(),
        finishMatch: vi.fn(),
        clearAll: vi.fn(),
      }
    });

    render(<LiveScoreBoard />);
    expect(screen.getByText('2 active matches')).toBeInTheDocument();
  });

  it('calls addMatch when Add Match Button is clicked', () => {
    const mockAddMatch = vi.fn();
    mockUseScoreBoard.mockReturnValue({
      matches: [],
      actions: {
        startGame: mockAddMatch,
        updateScore: vi.fn(),
        finishGame: vi.fn(),
        clearAll: vi.fn(),
      }
    });

    render(<LiveScoreBoard />);
    fireEvent.click(screen.getByText('Add Match Button'));
    
    expect(mockAddMatch).toHaveBeenCalledWith('Spain', 'Brazil');
  });

  it('calls startGame when Add Match Button is clicked', () => {
    const mockStartGame = vi.fn();
    mockUseScoreBoard.mockReturnValue({
      matches: [],
      actions: {
        startGame: mockStartGame,
        updateScore: vi.fn(),
        finishGame: vi.fn(),
        clearAll: vi.fn(),
      }
    });

    render(<LiveScoreBoard />);
    fireEvent.click(screen.getByText('Add Match Button'));
    
    expect(mockStartGame).toHaveBeenCalledWith('Spain', 'Brazil');
  });

  it('shows error modal when startGame throws an exception', () => {
    const mockStartGame = vi.fn().mockImplementation(() => {
      throw new Error('Teams already playing');
    });
    const mockShowConfirmation = vi.fn();
    
    mockUseScoreBoard.mockReturnValue({
      matches: [],
      actions: {
        startGame: mockStartGame,
        updateScore: vi.fn(),
        finishGame: vi.fn(),
        clearAll: vi.fn(),
      }
    });
    
    mockUseConfirmation.mockReturnValue({
      isOpen: false,
      options: null,
      showConfirmation: mockShowConfirmation,
      hideConfirmation: vi.fn(),
    });

    render(<LiveScoreBoard />);
    fireEvent.click(screen.getByText('Add Match Button'));
    
    expect(mockStartGame).toHaveBeenCalledWith('Spain', 'Brazil');
    expect(mockShowConfirmation).toHaveBeenCalledWith({
      title: 'Error',
      message: 'Teams already playing',
      buttons: expect.arrayContaining([
        expect.objectContaining({ text: 'OK', variant: 'primary' })
      ])
    });
  });

  it('calls updateScore when Update Score button is clicked', () => {
    const mockUpdateScore = vi.fn();
    const mockMatches = [
      {
        id: '1',
        homeTeam: 'Spain',
        awayTeam: 'Brazil',
        homeScore: 0,
        awayScore: 0,
        startTime: new Date(),
      }
    ];
    
    mockUseScoreBoard.mockReturnValue({
      matches: mockMatches,
      actions: {
        startGame: vi.fn(),
        updateScore: mockUpdateScore,
        finishGame: vi.fn(),
        clearAll: vi.fn(),
      }
    });

    render(<LiveScoreBoard />);
    fireEvent.click(screen.getByText('Update Score'));
    
    expect(mockUpdateScore).toHaveBeenCalledWith('1', 2, 1);
  });

  it('shows confirmation modal when Finish Game button is clicked', () => {
    const mockShowConfirmation = vi.fn();
    const mockMatches = [
      {
        id: '1',
        homeTeam: 'Spain',
        awayTeam: 'Brazil',
        homeScore: 2,
        awayScore: 1,
        startTime: new Date(),
      }
    ];
    
    mockUseScoreBoard.mockReturnValue({
      matches: mockMatches,
      actions: {
        startGame: vi.fn(),
        updateScore: vi.fn(),
        finishGame: vi.fn(),
        clearAll: vi.fn(),
      }
    });
    
    mockUseConfirmation.mockReturnValue({
      isOpen: false,
      options: null,
      showConfirmation: mockShowConfirmation,
      hideConfirmation: vi.fn(),
    });

    render(<LiveScoreBoard />);
    fireEvent.click(screen.getByText('Finish Game'));
    
    expect(mockShowConfirmation).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Finish Match',
      buttons: expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Finish Match' })
      ])
    }));
  });

  it('calls clearAll when Clear All button is clicked after confirmation', () => {
    const mockClearAll = vi.fn();
    const hideConfirmationMock = vi.fn();
    const showConfirmationMock = vi.fn();
    
    let confirmationCallback: (() => void) | undefined;
    
    showConfirmationMock.mockImplementation(({ buttons }: { buttons: Array<{ text: string; onClick?: () => void }> }) => {
      const clearAllButton = buttons.find(b => b.text === 'Clear All');
      if (clearAllButton && clearAllButton.onClick) {
        confirmationCallback = clearAllButton.onClick;
      }
    });
    
    mockUseScoreBoard.mockReturnValue({
      matches: [{ id: '1', homeTeam: 'Spain', awayTeam: 'Brazil', homeScore: 2, awayScore: 1, startTime: new Date() }],
      actions: {
        startGame: vi.fn(),
        updateScore: vi.fn(),
        finishGame: vi.fn(),
        clearAll: mockClearAll,
      }
    });
    
    mockUseConfirmation.mockReturnValue({
      isOpen: false,
      options: null,
      showConfirmation: showConfirmationMock,
      hideConfirmation: hideConfirmationMock,
    });

    render(<LiveScoreBoard />);
    fireEvent.click(screen.getByText('Clear All'));
    
    expect(showConfirmationMock).toHaveBeenCalled();
    
    if (confirmationCallback) {
      confirmationCallback();
    }
    
    expect(mockClearAll).toHaveBeenCalled();
    expect(hideConfirmationMock).toHaveBeenCalled();
  });

  it('displays confirmation modal when isOpen is true', () => {
    mockUseConfirmation.mockReturnValue({
      isOpen: true,
      options: {
        title: 'Test Title',
        message: 'Test Message',
        buttons: [{ text: 'OK', variant: 'primary', onClick: vi.fn() }]
      },
      showConfirmation: vi.fn(),
      hideConfirmation: vi.fn(),
    });

    render(<LiveScoreBoard />);
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('does not display confirmation modal when isOpen is false', () => {
    mockUseConfirmation.mockReturnValue({
      isOpen: false,
      options: null,
      showConfirmation: vi.fn(),
      hideConfirmation: vi.fn(),
    });

    render(<LiveScoreBoard />);
    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
  });
});