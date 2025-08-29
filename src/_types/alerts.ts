export type AlertVariant = 'purple' | 'red' | 'green' | 'blue';
export type AlertType =
  | 'twitch_live'
  | 'youtube_live'
  | 'mission_submitted'
  | 'major_order'
  | 'leaderboard_update';
export interface Alert {
  id: string;
  type: AlertType;
  variant: AlertVariant;
  message: string;
  url?: string | null;
  createdAt: string;
  meta?: Record<string, any>;
}
