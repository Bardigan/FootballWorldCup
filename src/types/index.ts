export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  startTime: Date;
}

export interface ScoreBoardSummary {
  matches: Match[];
}

export interface ConfirmationButton {
  text: string;
  variant: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
