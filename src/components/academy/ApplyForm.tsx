// src/components/ApplyForm.tsx
'use client';

import React, { useState } from 'react';
import styles from './ApplyForm.module.css'; // Create this CSS module file
import { logger } from '@/lib/logger';

interface ApplyFormProps {
  botName: string;
  botIdentifier: string;
  onSuccess: () => void; // Callback on successful submission
  onCancel: () => void; // Callback to close the form
}

export default function ApplyForm({
  botName,
  botIdentifier,
  onSuccess,
  onCancel,
}: ApplyFormProps) {
  const [serverName, setServerName] = useState('');
  const [serverId, setServerId] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botIdentifier,
          serverName,
          serverId,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`
        );
      }

      setSuccessMessage(data.message || 'Application submitted!');
      // Clear form or call onSuccess after a delay
      setTimeout(() => {
        onSuccess(); // Notify parent component
      }, 1500); // Close form after 1.5 seconds
    } catch (err: any) {
      logger.error('Form submission error:', err);
      setError(
        err.message || 'Failed to submit application. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h3 className={styles.formTitle}>Join {botName}</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        {!successMessage && ( // Hide form after success message appears
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="serverName" className={styles.label}>
                Discord Server Name
              </label>
              <input
                type="text"
                id="serverName"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className={styles.input}
                placeholder="Your awesome server"
                maxLength={100}
                required // Example validation
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="serverId" className={styles.label}>
                Discord Server ID (Optional)
              </label>
              <input
                type="text"
                id="serverId"
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                className={styles.input}
                placeholder="123456789012345678"
                pattern="\d{17,20}" // Basic pattern for Discord IDs
                title="Should be a 17-20 digit number"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reason" className={styles.label}>
                Reason for Application (Optional)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Why would this bot be a great fit?"
                maxLength={500}
              ></textarea>
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={onCancel}
                className={`${styles.button} ${styles.cancelButton}`}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${styles.button} ${styles.submitButton}`}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
