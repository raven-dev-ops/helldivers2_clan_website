// src/app/(main)/helldivers-2/studio/page.tsx

import React from 'react';
import Link from 'next/link';
import BotAvatar from '@/components/BotAvatar'; // Adjust path if needed
import dbConnect from '@/lib/dbConnect';
import BotModel, { IBotLean } from '@/models/Bot';
import BotApplicationModel from '@/models/BotApplication';
import mongoose, { Types } from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FaEnvelope, FaVideo, FaServer, FaCheckCircle, FaDiscord } from 'react-icons/fa';
import styles from './StudioPage.module.css';

// --- Interfaces ---
interface BotDisplayData {
    _id: string;
    botIdentifier: string;
    name: string;
    discordClientId: string;
    description?: string;
    serverCount: number;
    videoUrl?: string;
    applyEmailSubject: string;
    applyEmailBody: string;
    hasApplied?: boolean;
    isVerified?: boolean;
}
type ApplicationStatusMap = Record<string, boolean>;

// --- Server-Side Data Fetching Functions ---
async function getBots(): Promise<IBotLean[]> {
    try {
        // *** Moved dbConnect inside try ***
        await dbConnect();
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
        // *** Moved dbConnect inside try ***
        await dbConnect();
        const applications = await BotApplicationModel.find(
            { userId: new mongoose.Types.ObjectId(userId) },
            'botId' // Assuming 'botId' links to 'botIdentifier'
        ).lean();

        const statusMap: ApplicationStatusMap = {};
        if (Array.isArray(applications)) {
            applications.forEach(app => {
                if (app && typeof app === 'object' && typeof app.botId === 'string') {
                    statusMap[app.botId] = true;
                }
            });
        } else {
            console.error("RUNTIME ERROR in getUserApplicationStatuses: Expected array, received:", typeof applications);
            // Return empty map even if DB response is unexpected, to prevent errors later
            return {};
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
    // Use `botsFromDb || []` to ensure .map is called on an array even if getBots somehow fails unexpectedly
    const botsToDisplay: BotDisplayData[] = (botsFromDb || []).map((bot: IBotLean) => ({
        _id: bot._id.toString(),
        botIdentifier: bot.botIdentifier,
        name: bot.name,
        description: bot.description,
        discordClientId: bot.discordClientId,
        videoUrl: bot.videoUrl,
        serverCount: bot.serverCount ?? 0,
        applyEmailSubject: bot.applyEmailSubject,
        applyEmailBody: bot.applyEmailBody,
        hasApplied: applicationStatuses[bot.botIdentifier] === true,
        isVerified: true, // Replace with actual logic/data field later
    }));

    // Placeholder Video ID - Replace with your actual YouTube Video ID
    const youtubeVideoId = "dQw4w9WgXcQ"; // Example: Rick Astley :)

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
                                const hasApplied = bot.hasApplied;
                                const mailtoLink = `mailto:gptfleet@gmail.com?subject=${encodeURIComponent(bot.applyEmailSubject)}&body=${encodeURIComponent(bot.applyEmailBody)}`;
                                const discordAvatarUrl = `https://cdn.discordapp.com/avatars/${bot.discordClientId}.png`;

                                return (
                                    <section key={bot.botIdentifier} className={styles.botCard}>
                                        <header className={styles.botHeader}>
                                            <div className={styles.botIconWrapper}>
                                                <BotAvatar src={discordAvatarUrl} alt={`${bot.name} Discord Avatar`} width={64} height={64} className="rounded-full border-2 border-gray-500" />
                                            </div>
                                            <div className={styles.botHeaderText}>
                                                <h2 className={styles.botName}>
                                                    <span className={styles.botNameText}>{bot.name}</span>
                                                    {bot.isVerified && (<FaCheckCircle className={styles.verifiedIcon} aria-label="Verified Bot" title="Verified Bot" />)}
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
                                                {bot.videoUrl && (<div className={styles.videoLinkContainer}><a href={bot.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.videoLink}><FaVideo className={styles.icon} aria-hidden="true" /> Watch Demo</a></div>)}
                                            </div>
                                            <div className={styles.actionsContainer}>
                                                {hasApplied ? (<button className={styles.appliedButton} disabled><FaCheckCircle className={styles.icon} /> Applied</button>) : (<a href={mailtoLink} className={styles.applyButtonLink}><FaEnvelope className={styles.icon} /> Apply to Use</a>)}
                                            </div>
                                        </div>
                                    </section>
                                );
                            })
                        ) : (
                            <p className={styles.textParagraph}>
                                No bots are currently available for application. Check back later!
                            </p>
                        )}
                    </div>

                    {/* Right Column: YouTube Video */}
                    <div className={styles.videoColumn}>
                        {/* Optional Title */}
                        {/* <h3 className={styles.videoTitle}>How to Use Our Bots</h3> */}
                        <div className={styles.videoWrapper}>
                            <iframe
                                className={styles.youtubeEmbed}
                                src={`https://www.youtube.com/embed/ea6P191gXLg`}
                                title="YouTube video player - Bot Instructions"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        {/* Optional description */}
                        {/* <p className={styles.videoDescription}>
                            Watch this video for a general overview of setting up and using GPT Fleet alliance bots.
                        </p> */}
                    </div>

                </div> // End contentWrapper
            )}
        </main>
    );
}