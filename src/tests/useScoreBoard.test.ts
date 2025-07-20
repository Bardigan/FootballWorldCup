import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScoreBoard } from '../hooks/useScoreBoard';
import type { Match } from '../types';

describe('useScoreBoard Hook', () => {
  test('Should start a game with initial score 0-0', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.startGame('Mexico', 'Canada');
    });

    const matches = result.current.matches;
    expect(matches).toHaveLength(1);
    
    const match = matches[0];
    expect(match.homeTeam).toBe('Mexico');
    expect(match.awayTeam).toBe('Canada');
    expect(match.homeScore).toBe(0);
    expect(match.awayScore).toBe(0);
    expect(match.id.length).toBeGreaterThan(0);
    expect(match.startTime).toBeInstanceOf(Date);
  });

  test('Should update match score', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.startGame('Spain', 'Brazil');
    });

    const matchId = result.current.matches[0].id;

    act(() => {
      result.current.actions.updateScore(matchId, 10, 2);
    });

    const updatedMatch = result.current.matches[0];
    expect(updatedMatch.homeScore).toBe(10);
    expect(updatedMatch.awayScore).toBe(2);
  });

  test('Should finish a game and remove it from scoreboard', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.startGame('Germany', 'France');
    });

    const matchId = result.current.matches[0].id;

    act(() => {
      result.current.actions.finishGame(matchId);
    });

    expect(result.current.matches).toHaveLength(0);
    expect(result.current.actions.getMatch(matchId)).toBeNull();
  });

  test('Should throw error for negative scores', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.startGame('Uruguay', 'Italy');
    });

    const matchId = result.current.matches[0].id;

    expect(() => {
      act(() => {
        result.current.actions.updateScore(matchId, -1, 5);
      });
    }).toThrow('Scores cannot be negative');
  });

  test('Should throw error for empty team names', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    expect(() => {
      act(() => {
        result.current.actions.startGame('', 'Canada');
      });
    }).toThrow('Team names cannot be empty');
  });

  test('Should return matches ordered by total score and start time', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.startGame('Mexico', 'Canada');
    });
    const match1Id = result.current.matches[0].id;

    act(() => {
      result.current.actions.startGame('Spain', 'Brazil');
    });
    const match2Id = result.current.matches.find((m: Match) => m.homeTeam === 'Spain')!.id;

    act(() => {
      result.current.actions.startGame('Germany', 'France');
    });
    const match3Id = result.current.matches.find((m: Match) => m.homeTeam === 'Germany')!.id;

    act(() => {
      result.current.actions.updateScore(match1Id, 0, 5);
      result.current.actions.updateScore(match2Id, 10, 2);
      result.current.actions.updateScore(match3Id, 2, 2);
    });

    const matches = result.current.matches;
    expect(matches).toHaveLength(3);

    const totalScores = matches.map((m: Match) => m.homeScore + m.awayScore);
    expect(totalScores[0]).toBe(12);
    expect(totalScores[1]).toBe(5);
    expect(totalScores[2]).toBe(4);
  });

  test('Should handle non-existent match update gracefully', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.updateScore('non-existent-id', 1, 1);
    });

    expect(result.current.matches).toHaveLength(0);
  });

  test('Should clear all matches', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.startGame('Test1', 'Test2');
      result.current.actions.startGame('Test3', 'Test4');
    });

    expect(result.current.matches).toHaveLength(2);

    act(() => {
      result.current.actions.clearAll();
    });

    expect(result.current.matches).toHaveLength(0);
  });

  test('Should trim whitespace from team names', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.startGame('  Mexico  ', '  Canada  ');
    });

    const match = result.current.matches[0];
    expect(match.homeTeam).toBe('Mexico');
    expect(match.awayTeam).toBe('Canada');
  });

  test('Should get specific match by ID', () => {
    const { result } = renderHook(() => useScoreBoard());
    
    act(() => {
      result.current.actions.startGame('Test1', 'Test2');
    });

    const matchId = result.current.matches[0].id;
    const foundMatch = result.current.actions.getMatch(matchId);
    
    expect(foundMatch).not.toBeNull();
    expect(foundMatch!.homeTeam).toBe('Test1');
    expect(foundMatch!.awayTeam).toBe('Test2');
  });
});

function runHookTests() {
  console.log('🧪 Running useScoreBoard Hook Tests...\n');
}

export { runHookTests };

if (import.meta.env.DEV) {
  runHookTests();
}
