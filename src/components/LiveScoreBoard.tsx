import React from "react";
import { useScoreBoard } from "../hooks/useScoreBoard";
import { useConfirmation } from "../hooks/useConfirmation";
import { MatchCard } from "./MatchCard";
import { AddMatchForm } from "./AddMatchForm";
import { ConfirmationModal } from "./modal/ConfirmationModal";
import { Button } from "./ui/Button";

export const LiveScoreBoard: React.FC = () => {
  const { matches, actions } = useScoreBoard();
  const { isOpen, options, showConfirmation, hideConfirmation } =
    useConfirmation();

  const showError = (message: string) => {
    showConfirmation({
      title: "Error",
      message,
      buttons: [
        {
          text: "OK",
          variant: "primary",
          onClick: hideConfirmation,
        },
      ],
    });
  };

  const handleAddMatch = (homeTeam: string, awayTeam: string) => {
    try {
      actions.startGame(homeTeam, awayTeam);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to start match");
    }
  };

  const handleUpdateScore = (
    matchId: string,
    homeScore: number,
    awayScore: number
  ) => {
    try {
      actions.updateScore(matchId, homeScore, awayScore);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to update score");
    }
  };

  const handleFinishGame = (matchId: string) => {
    showConfirmation({
      title: "Finish Match",
      message:
        "Are you sure you want to finish this match? This will remove it from the scoreboard.",
      buttons: [
        {
          text: "Cancel",
          variant: "secondary",
          onClick: hideConfirmation,
        },
        {
          text: "Finish Match",
          variant: "danger",
          onClick: () => {
            actions.finishGame(matchId);
            hideConfirmation();
          },
        },
      ],
    });
  };

  const handleClearAll = () => {
    showConfirmation({
      title: "Clear All Matches",
      message:
        "Are you sure you want to clear all matches? This will remove all matches from the scoreboard.",
      buttons: [
        {
          text: "Cancel",
          variant: "secondary",
          onClick: hideConfirmation,
        },
        {
          text: "Keep Matches",
          variant: "primary",
          onClick: hideConfirmation,
        },
        {
          text: "Clear All",
          variant: "danger",
          onClick: () => {
            actions.clearAll();
            hideConfirmation();
          },
        },
      ],
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-500 p-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              Live Score Board
              
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Track ongoing World Cup matches and scores in real-time
            </p>
          </header>

          <AddMatchForm onAddMatch={handleAddMatch} />

          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Current Matches
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {matches.length} active matches
                </span>
                {matches.length > 0 && (
                  <Button variant="danger" size="sm" onClick={handleClearAll}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {matches.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex justify-center items-center mb-6">
                  <img src="/ball.svg" alt="Football stadium" className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No active matches
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Start a new match to see it appear on the scoreboard
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div key={match.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <MatchCard
                        match={match}
                        onUpdateScore={handleUpdateScore}
                        onFinishGame={handleFinishGame}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="text-center mt-8 text-sm text-gray-500 bg-white rounded-lg p-4 shadow">
            <p>
              Matches are sorted by total score (highest first). Matches with
              the same total score are ordered by most recently added.
            </p>
          </footer>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        title={options?.title || ""}
        message={options?.message || ""}
        buttons={options?.buttons || []}
        onClose={hideConfirmation}
      />
    </>
  );
};
