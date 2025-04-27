// src/app/(main)/helldivers-2/studio/page.tsx

import React from 'react';
import Link from 'next/link';
// Import client components
import BotAvatar from '@/app/components/BotAvatar'; // For displaying avatar with error handling
import BotCardActions from '@/app/components/BotCardActions'; // Handles Apply button/form logic
// DB and Auth related imports
import dbConnect from '@/lib/dbConnect';
import BotModel, { IBotLean } from '@/models/Bot'; // Ensure models/Bot.ts exports IBotLean
import BotApplicationModel from '@/models/BotApplication'; // Adjust path if needed
import mongoose, { Types } from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/authOptions';
// Icons
import { FaEnvelope, FaVideo, FaServer, FaCheckCircle, FaDiscord } from 'react-icons/fa';
// Styling
import styles from './StudioPage.module.css'; // Assumes StudioPage.module.css is in the same directory

// --- Interfaces ---
interface BotDisplayData {
    _id: string;
    botIdentifier: string;
    name: string;
    discordClientId: string;
    description?: string;
    serverCount: number;
    videoUrl?: string;
    applyEmailSubject: string; // Still needed to pass to BotCardActions if form uses it
    applyEmailBody: string; // Still needed to pass to BotCardActions if form uses it
    hasApplied?: boolean; // Status fetched from DB initially
    isVerified?: boolean; // For showing the checkmark
}
type ApplicationStatusMap = Record<string, boolean>;

// --- Server-Side Data Fetching Functions ---
async function getBots(): Promise<IBotLean[]> {
    try {
        await dbConnect(); // Connect inside try block
        const bots = await BotModel.find({})
                                    .sort({ order: 1, name: 1 })
                                    .lean<IBotLean>();

        if (!Array.isArray(bots)) {
            console.error("RUNTIME ERROR in getBots: Expected array, received:", typeof bots);
            return []; // Return empty array if not an array
        }
        // Using assertion as TS inference sometimes struggles here
        return bots as IBotLean[];
    } catch (error) {
        console.error("Failed to fetch bots:", error);
        return []; // Ensure an empty array is returned on any error
    }
}

async function getUserApplicationStatuses(userId: string | undefined): Promise<ApplicationStatusMap> {
    // Check userId validity first
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return {}; // Return empty object if userId is invalid
    }
    try {
        await dbConnect(); // Connect inside try block
        // Assuming 'botId' in BotApplication model stores the 'botIdentifier' string from the Bot model
        const applications = await BotApplicationModel.find(
            { userId: new mongoose.Types.ObjectId(userId) },
            'botId'
        ).lean();

        const statusMap: ApplicationStatusMap = {};
        if (Array.isArray(applications)) {
            applications.forEach(app => {
                // Ensure app is an object and botId exists and is a string
                if (app && typeof app === 'object' && typeof app.botId === 'string') {
                    statusMap[app.botId] = true;
                }
            });
        } else {
            console.error("RUNTIME ERROR in getUserApplicationStatuses: Expected array, received:", typeof applications);
            return {}; // Return empty map to prevent errors later
        }
        return statusMap; // Return the populated (or empty) map
    } catch (error) {
        console.error("Failed to fetch application statuses:", error);
        return {}; // Ensure an empty object is returned on any error
    }
}
// --- End Data Fetching ---


// --- Main React Server Component ---
export default async function StudioPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string | undefined;

    // Fetch data concurrently
    const [botsFromDb, applicationStatuses] = await Promise.all([
        getBots(),
        getUserApplicationStatuses(userId)
    ]);

    // --- Transform Data for Display (with safety check) ---
    const botsToDisplay: BotDisplayData[] = (botsFromDb || []).map((bot: IBotLean) => ({
        _id: bot._id.toString(),
        botIdentifier: bot.botIdentifier,
        name: bot.name,
        description: bot.description,
        discordClientId: bot.discordClientId,
        videoUrl: bot.videoUrl,
        serverCount: bot.serverCount ?? 0,
        applyEmailSubject: bot.applyEmailSubject, // Pass through needed data
        applyEmailBody: bot.applyEmailBody,      // Pass through needed data
        hasApplied: applicationStatuses[bot.botIdentifier] === true, // Initial status
        // TODO: Replace 'true' with actual verification logic based on your data
        isVerified: true, // Currently hardcoded to show checkmark for all bots
    }));

    // Your specific YouTube Video ID for instructions
    const youtubeVideoId = "ea6P191gXLg";

    // --- JSX Rendering ---
    return (
        <main className={styles.studioMainContainer}>
            {/* Page Title and Intro */}
            <h1 className={styles.studioPageTitle}>GPT HD2 Studio</h1>
            <p className={styles.studioIntroText}>
                Explore the custom bots developed by GPT Fleet, designed to enhance gameplay and community management for Helldivers 2 servers within our Alliance. Server Owners can apply to integrate these tools.
            </p>

            {/* Sign-in Prompt */}
            {!session?.user && (
                 <div className={styles.signInPrompt}>
                    Please{' '}
                    <Link href={`/api/auth/signin?callbackUrl=/helldivers-2/studio`} className={styles.textLink}>
                        sign in
                    </Link>
                    {' '}to view application status and apply for bots.
                 </div>
            )}

            {/* Content Wrapper for 2-Column Layout */}
            {session?.user && (
                <div className={styles.contentWrapper}>

                    {/* Left Column: Bot List */}
                    <div className={styles.botListColumn}>
                        {botsToDisplay.length > 0 ? (
                            botsToDisplay.map((bot) => {
                                const discordAvatarUrl = `https://cdn.discordapp.com/avatars/${bot.discordClientId}.png`;
                                // Pass initial applied status to the client component
                                const initialHasApplied = bot.hasApplied ?? false;

                                return (
                                    <section key={bot.botIdentifier} className={styles.botCard}>
                                        <header className={styles.botHeader}>
                                            <div className={styles.botIconWrapper}>
                                                <BotAvatar
                                                    src={discordAvatarUrl}
                                                    alt={`${bot.name} Discord Avatar`}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-full border-2 border-gray-500" // Pass minimal style needed
                                                />
                                            </div>
                                            <div className={styles.botHeaderText}>
                                                 <h2 className={styles.botName}>
                                                    <span className={styles.botNameText}>{bot.name}</span>
                                                    {/* Render checkmark if bot is verified */}
                                                    {bot.isVerified && (
                                                        <FaCheckCircle
                                                            className={styles.verifiedIcon}
                                                            aria-label="Verified Bot"
                                                            title="Verified Bot"
                                                        />
                                                    )}
                                                 </h2>
                                                 <div className={styles.botStats}>
                                                    <span className={styles.statItem} title={`${bot.serverCount} servers`}>
                                                        <FaServer className={styles.icon} aria-hidden="true" /> {bot.serverCount} Servers
                                                    </span>
                                                    <span className={styles.statItem} title={`Discord Application ID: ${bot.discordClientId}`}>
                                                        <FaDiscord className={styles.icon} aria-hidden="true"/> ID: {bot.discordClientId.substring(0, 6)}...
                                                    </span>
                                                 </div>
                                            </div>
                                        </header>
                                        <div className={styles.botBody}>
                                            <div>
                                                <p className={styles.botDescription}>{bot.description || 'No description available.'}</p>
                                                {bot.videoUrl && (
                                                    <div className={styles.videoLinkContainer}>
                                                        <a href={bot.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                                                            <FaVideo className={styles.icon} aria-hidden="true" /> Watch Demo
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            {/* === Use the BotCardActions Client Component === */}
                                            {/* It handles showing Apply/Applied and the form */}
                                            <BotCardActions
                                                bot={bot} // Pass necessary bot data (name, identifier, etc.)
                                                initialHasApplied={initialHasApplied} // Pass initial status from server
                                            />
                                        </div>
                                    </section>
                                );
                            })
                        ) : (
                            // Message if no bots are found
                            <p className={styles.textParagraph}>
                                No bots are currently available for application. Check back later!
                            </p>
                        )}
                    </div>

                    {/* Right Column: YouTube Video */}
                    <div className={styles.videoColumn}>
                        {/* Optional Title - Uncomment and style in CSS if desired */}
                        {/* <h3 className={styles.videoTitle}>How to Use Our Bots</h3> */}
                        <div className={styles.videoWrapper}>
                            <iframe
                                className={styles.youtubeEmbed}
                                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                                title="YouTube video player - Bot Instructions" // Descriptive title
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        {/* Optional description - Uncomment and style in CSS if desired */}
                        {/* <p className={styles.videoDescription}>
                            Watch this video for a general overview of setting up and using GPT Fleet alliance bots.
                        </p> */}
                    </div>

                </div> // End contentWrapper
            )}
        </main>
    );
}