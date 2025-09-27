// src/types/alerts.ts

export type AlertKind = 'info' | 'success' | 'warning' | 'error';

export interface Alert {
  id: string;                 // unique id for list keys / dismissal
  kind: AlertKind;            // visual style / severity
  message: string;            // text to display
  href?: string;              // optional link target
  dismissible?: boolean;      // whether a close button is shown
  startsAt?: string;          // ISO timestamp (optional scheduling)
  endsAt?: string;            // ISO timestamp (optional scheduling)
}
