import React, { useState } from 'react';
import type { Match } from '../types';
import { Button } from './ui/Button';

interface MatchCardProps {
  match: Match;
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number) => void;
  onFinishGame: (matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onUpdateScore,
  onFinishGame,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [homeScore, setHomeScore] = useState(match.homeScore.toString());
  const [awayScore, setAwayScore] = useState(match.awayScore.toString());

  const handleSave = () => {
    const newHomeScore = parseInt(homeScore, 10);
    const newAwayScore = parseInt(awayScore, 10);

    if (isNaN(newHomeScore) || isNaN(newAwayScore) || newHomeScore < 0 || newAwayScore < 0) {
      alert('Please enter valid scores (0 or higher)');
      return;
    }

    onUpdateScore(match.id, newHomeScore, newAwayScore);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setHomeScore(match.homeScore.toString());
    setAwayScore(match.awayScore.toString());
    setIsEditing(false);
  };

  const totalScore = match.homeScore + match.awayScore;
  const formattedTime = match.startTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="font-medium">LIVE</span>
          <span className="text-gray-400">•</span>
          <span>Started at {formattedTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            Total: {totalScore}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-8 w-full max-w-md">
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-800 mb-2 truncate">
              {match.homeTeam}
            </div>
            {isEditing ? (
              <input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="w-16 h-12 text-2xl font-bold text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <div className="text-3xl font-bold text-blue-600">
                {match.homeScore}
              </div>
            )}
          </div>

          <div className="flex-shrink-0 text-gray-400 font-semibold">
            VS
          </div>

          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-800 mb-2 truncate">
              {match.awayTeam}
            </div>
            {isEditing ? (
              <input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="w-16 h-12 text-2xl font-bold text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <div className="text-3xl font-bold text-blue-600">
                {match.awayScore}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        {isEditing ? (
          <>
            <Button variant="success" onClick={handleSave}>
              Save Score
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Update Score
            </Button>
            <Button variant="danger" onClick={() => onFinishGame(match.id)}>
              Finish Match
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
