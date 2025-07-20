import { useReducer, useMemo, useCallback } from 'react';
import type { Match } from '../types';

type ScoreBoardAction =
  | { type: 'START_GAME'; payload: { homeTeam: string; awayTeam: string } }
  | { type: 'UPDATE_SCORE'; payload: { matchId: string; homeScore: number; awayScore: number } }
  | { type: 'FINISH_GAME'; payload: { matchId: string } }
  | { type: 'CLEAR_ALL' };

function scoreBoardReducer(state: Match[], action: ScoreBoardAction): Match[] {
  switch (action.type) {
    case 'START_GAME': {
      const { homeTeam, awayTeam } = action.payload;
      
      if (!homeTeam.trim() || !awayTeam.trim()) {
        throw new Error('Team names cannot be empty');
      }

      const id = `${homeTeam.trim()}-${awayTeam.trim()}-${Date.now()}`;
      const newMatch: Match = {
        id,
        homeTeam: homeTeam.trim(),
        awayTeam: awayTeam.trim(),
        homeScore: 0,
        awayScore: 0,
        startTime: new Date(),
      };

      return [...state, newMatch];
    }

    case 'UPDATE_SCORE': {
      const { matchId, homeScore, awayScore } = action.payload;
      
      if (homeScore < 0 || awayScore < 0) {
        throw new Error('Scores cannot be negative');
      }

      return state.map(match =>
        match.id === matchId
          ? { ...match, homeScore, awayScore }
          : match
      );
    }

    case 'FINISH_GAME': {
      const { matchId } = action.payload;
      return state.filter(match => match.id !== matchId);
    }

    case 'CLEAR_ALL': {
      return [];
    }

    default:
      return state;
  }
}

export const useScoreBoard = () => {
  const [matches, dispatch] = useReducer(scoreBoardReducer, []);

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      const totalScoreA = a.homeScore + a.awayScore;
      const totalScoreB = b.homeScore + b.awayScore;
      
      if (totalScoreA !== totalScoreB) {
        return totalScoreB - totalScoreA;
      }
      
      return b.startTime.getTime() - a.startTime.getTime();
    });
  }, [matches]);

  const startGame = useCallback((homeTeam: string, awayTeam: string) => {
    dispatch({ type: 'START_GAME', payload: { homeTeam, awayTeam } });
  }, []);

  const updateScore = useCallback((matchId: string, homeScore: number, awayScore: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { matchId, homeScore, awayScore } });
  }, []);

  const finishGame = useCallback((matchId: string) => {
    dispatch({ type: 'FINISH_GAME', payload: { matchId } });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const getMatch = useCallback((matchId: string) => {
    return matches.find(match => match.id === matchId) || null;
  }, [matches]);

  const actions = useMemo(() => ({
    startGame,
    updateScore,
    finishGame,
    clearAll,
    getMatch,
  }), [startGame, updateScore, finishGame, clearAll, getMatch]);

  return {
    matches: sortedMatches,
    actions,
  };
};
