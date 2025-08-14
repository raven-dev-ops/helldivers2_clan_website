// src/components/BotCardActions.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import ApplyForm from './ApplyForm'; // Import the form component
// Import shared styles if needed from StudioPage.module.css or create specific ones
import styles from '@/app/(main)/helldivers-2/studio/StudioPage.module.css'; // Reuse styles

interface BotCardActionsProps {
    bot: { // Pass necessary bot data
        botIdentifier: string;
        name: string;
        applyEmailSubject: string; // Although not used for mailto, might be useful
        applyEmailBody: string; // Might be useful
    };
    initialHasApplied: boolean; // Status from server on initial load
}

export default function BotCardActions({ bot, initialHasApplied }: BotCardActionsProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    // Local state to immediately reflect submission success, initialized from server prop
    const [hasApplied, setHasApplied] = useState(initialHasApplied);

    // Update local state if the prop changes (e.g., after a page refresh/revalidation)
    useEffect(() => {
        setHasApplied(initialHasApplied);
    }, [initialHasApplied]);


    const handleApplyClick = () => {
        setIsFormOpen(true);
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
    };

    const handleFormSuccess = () => {
        setHasApplied(true); // Update button state visually
        setIsFormOpen(false); // Close form
        // Optionally trigger a re-fetch or revalidation if needed for parent state
    };

    return (
        <div className={styles.actionsContainer}>
            {hasApplied ? (
                <button className={styles.appliedButton} disabled>
                    <FaCheckCircle className={styles.icon} /> Joined
                </button>
            ) : (
                <button onClick={handleApplyClick} className={styles.applyButtonLink}>
                    <FaEnvelope className={styles.icon} /> Join Now!
                </button>
            )}

            {/* Conditionally render the form as a modal/overlay */}
            {isFormOpen && (
                <ApplyForm
                    botName={bot.name}
                    botIdentifier={bot.botIdentifier}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </div>
    );
}