// src/app/(main)/helldivers-2/studio/page.tsx // <<< ENSURE .tsx EXTENSION

import React from 'react';
import Link from 'next/link'; // For internal links if needed
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect'; // Ensure correct path
import BotApplicationModel from '@/models/BotApplication'; // Import your model
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed
import { FaEnvelope, FaVideo, FaServer, FaCheckCircle } from 'react-icons/fa'; // Icons

// --- Data Structure for Bot Display ---
interface BotData {
    id: string; // Unique identifier for the bot (used for application tracking)
    name: string;
    iconUrl: string; // Path relative to /public folder
    description: string;
    serverCount: number; // Static for now, fetch dynamically later
    videoUrl?: string; // Optional YouTube/Vimeo embed URL or link
    applyEmailSubject: string;
    applyEmailBody: string;
}

// --- Hardcoded Bot Data (Replace with actual bot info) ---
const botsData: BotData[] = [
    {
        id: 'gpt-lfg-linker-v1',
        name: 'GPT LFG Linker',
        iconUrl: '/images/bots/lfg-bot-icon.png', // Placeholder path
        description: 'Connects LFG channels across multiple partnered Discord servers, allowing Helldivers to easily find squads across the GPT Fleet Alliance.',
        serverCount: 5, // Example static count
        videoUrl: 'https://www.youtube.com/embed/your_lfg_video_id', // Example embed URL
        applyEmailSubject: 'Application for GPT LFG Linker Bot',
        applyEmailBody: `Hello GPT Fleet,\n\nI am the owner of the Discord server listed below and would like to apply to integrate the GPT LFG Linker bot.\n\nMy Discord User ID: [Your Discord User ID - Find in Discord Settings > Advanced > Turn on Developer Mode, then right-click your name > Copy User ID]\nMy Discord Server Name: [Your Server Name]\nMy Discord Server ID: [Your Server ID - Find via Server Settings > Widget > Server ID, or enable Dev Mode and right-click server icon > Copy Server ID]\n\nPlease review our server for partnership.\n\nThanks,\n[Your Name]`,
    },
    {
        id: 'gpt-stats-tracker-v1',
        name: 'GPT Stat Tracker',
        iconUrl: '/images/bots/stats-bot-icon.png', // Placeholder path
        description: 'Tracks Helldivers 2 mission stats, progress, and contributions for members within partnered servers, displaying leaderboards and detailed reports.',
        serverCount: 3, // Example static count
        videoUrl: 'https://www.youtube.com/embed/your_stats_video_id', // Example embed URL
        applyEmailSubject: 'Application for GPT Stat Tracker Bot',
        applyEmailBody: `Hello GPT Fleet,\n\nI am the owner of the Discord server listed below and would like to apply to integrate the GPT Stat Tracker bot.\n\nMy Discord User ID: [Your Discord User ID - Find in Discord Settings > Advanced > Turn on Developer Mode, then right-click your name > Copy User ID]\nMy Discord Server Name: [Your Server Name]\nMy Discord Server ID: [Your Server ID - Find via Server Settings > Widget > Server ID, or enable Dev Mode and right-click server icon > Copy Server ID]\n\nPlease review our server for partnership.\n\nThanks,\n[Your Name]`,
    },
    // Add more bots here
];

// --- Type for Application Status ---
type ApplicationStatusMap = Record<string, boolean>; // { [botId: string]: boolean } -> true if applied

// --- Server-Side Data Fetching Function ---
async function getUserApplicationStatuses(userId: string | undefined): Promise<ApplicationStatusMap> {
    if (!userId) return {}; // Not logged in, cannot have applied

    // Validate if userId is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.warn("Invalid userId format for fetching application status:", userId);
        return {};
    }

    await dbConnect();
    try {
        // Ensure BotApplicationModel is imported and correct
        const applications = await BotApplicationModel.find(
            { userId: new mongoose.Types.ObjectId(userId) }, // Query by user ID
            'botId' // Select only the botId field
        ).lean();

        const statusMap: ApplicationStatusMap = {};
        applications.forEach(app => {
            // Ensure app and app.botId exist before assigning
            if (app && app.botId) {
                statusMap[app.botId] = true; // Mark botId as applied for
            }
        });
        return statusMap;
    } catch (error) {
        console.error("Failed to fetch user application statuses:", error);
        return {}; // Return empty map on error
    }
}

// --- Style Object (Removed invalid styles) ---
const styles: { [key: string]: React.CSSProperties } = {
    mainContainer: { maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', padding: '2rem 1rem 4rem', fontFamily: 'var(--font-sans, sans-serif)', color: 'var(--color-text-primary)' },
    pageTitle: { fontSize: 'clamp(1.8rem, 5vw, 2.25rem)', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary, #facc15)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', textAlign: 'center', },
    introText: { color: 'var(--color-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '70ch', marginInline: 'auto' },
    botListContainer: { display: 'flex', flexDirection: 'column', gap: '2rem', },
    botCard: { display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', overflow: 'hidden', },
    botHeader: { // Container for Icon, Name, Stats
        display: 'flex',
        flexDirection: 'column', // Stack header items on small screens
        alignItems: 'center', // Center items when stacked
        gap: '1rem',
        padding: '1.5rem',
        backgroundColor: 'var(--color-surface-alt)',
        borderBottom: '1px solid var(--color-border-alt)',
        textAlign: 'center',
        // Responsive row layout needs CSS Modules/Tailwind
    },
    botIcon: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--color-border)' },
    botIconPlaceholder: { width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', border: '2px solid var(--color-border)', fontSize: '2rem', color: 'var(--color-text-muted)' },
    botHeaderText: { flexGrow: 1, minWidth: 0 },
    botName: { fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem', },
    botStats: { fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' },
    statItem: { display: 'flex', alignItems: 'center', gap: '0.3rem' },
    botBody: { padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 },
    botDescription: { color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6, flexGrow: 1 },
    videoLinkContainer: { marginBottom: '1.5rem', textAlign: 'center', },
    videoLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-hover)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', },
    actionsContainer: { display: 'flex', justifyContent: 'center', marginTop: 'auto', paddingTop: '1rem', },
    applyButtonLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', padding: '0.6rem 1.2rem', borderRadius: 'var(--border-radius-md)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)', transition: 'background-color 0.2s ease, transform 0.1s ease', },
    appliedButton: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', padding: '0.6rem 1.2rem', borderRadius: 'var(--border-radius-md)', fontWeight: 600, fontSize: '0.9rem', cursor: 'default', opacity: 0.7, },
    signInPrompt: { textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-secondary)', fontSize: '1.1rem', backgroundColor: 'var(--color-surface)', borderRadius:'var(--border-radius-lg)', border: '1px solid var(--color-border)' },
    link: { color: 'var(--color-primary-hover)', textDecoration: 'underline', textUnderlineOffset: '2px', },
};

// --- Main Component ---
export default async function StudioPage() {
    const session = await getServerSession(authOptions);
    // Make sure session.user.id is correctly typed in your next-auth.d.ts
    const userId = session?.user?.id as string | undefined;

    const applicationStatuses = await getUserApplicationStatuses(userId);

    return (
        <main style={styles.mainContainer}>
            <h1 style={styles.pageTitle}>GPT Fleet Bot Studio</h1>
            <p style={styles.introText}>
                Explore the custom bots developed by GPT Fleet, designed to enhance gameplay and community management for Helldivers 2 servers within our Alliance. Server Owners can apply to integrate these tools.
            </p>

            {!session?.user && (
                 <div style={styles.signInPrompt}>
                    Please{' '}
                    <Link href={`/api/auth/signin?callbackUrl=/helldivers-2/studio`} style={styles.link}>
                        sign in
                    </Link>
                    {' '}to view application status and apply for bots.
                </div>
            )}

            {session?.user && (
                <div style={styles.botListContainer}>
                    {botsData.map((bot) => {
                        const hasApplied = applicationStatuses[bot.id] === true;
                        const mailtoLink = `mailto:gptfleet@gmail.com?subject=${encodeURIComponent(bot.applyEmailSubject)}&body=${encodeURIComponent(bot.applyEmailBody)}`;

                        return (
                            <section key={bot.id} style={styles.botCard}>
                                <header style={styles.botHeader}>
                                    {bot.iconUrl ? (
                                        <Image
                                            src={bot.iconUrl}
                                            alt={`${bot.name} Icon`}
                                            width={80}
                                            height={80}
                                            style={styles.botIcon}
                                        />
                                    ) : (
                                        <div style={styles.botIconPlaceholder}>?</div>
                                    )}
                                    <div style={styles.botHeaderText}>
                                        <h2 style={styles.botName}>{bot.name}</h2>
                                        <div style={styles.botStats}>
                                            <span style={styles.statItem} title={`${bot.serverCount} servers currently using this bot`}>
                                                <FaServer aria-hidden="true" /> {bot.serverCount} Servers
                                            </span>
                                        </div>
                                    </div>
                                </header>
                                <div style={styles.botBody}>
                                    <p style={styles.botDescription}>{bot.description}</p>
                                    {bot.videoUrl && (
                                        <div style={styles.videoLinkContainer}>
                                            <a href={bot.videoUrl} target="_blank" rel="noopener noreferrer" style={styles.videoLink}>
                                                <FaVideo aria-hidden="true" /> Watch Demo Video
                                            </a>
                                        </div>
                                    )}
                                    <div style={styles.actionsContainer}>
                                        {hasApplied ? (
                                            <button style={styles.appliedButton} disabled>
                                               <FaCheckCircle style={{marginRight: '0.5rem'}}/> Applied
                                            </button>
                                        ) : (
                                            <a href={mailtoLink} style={styles.applyButtonLink}>
                                                <FaEnvelope style={{marginRight: '0.5rem'}}/> Apply to Use
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </main>
    );
}