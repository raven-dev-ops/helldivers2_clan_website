// src/app/(main)/helldivers-2/studio/page.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect';
// --- Import Bot model and the IBotLean interface for lean results ---
import BotModel, { IBotLean } from '@/models/Bot'; // Ensure this path and export are correct
import BotApplicationModel from '@/models/BotApplication'; // Adjust path if needed
import mongoose, { Types } from 'mongoose'; // Import Types for ObjectId
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed
import { FaEnvelope, FaVideo, FaServer, FaCheckCircle, FaDiscord } from 'react-icons/fa';

// --- Data Structure for Bot Display ---
interface BotDisplayData {
    _id: string; // Document id as string
    botIdentifier: string;
    name: string;
    discordClientId: string;
    iconUrl?: string;
    description?: string;
    serverCount: number; // Ensure it's always a number
    videoUrl?: string;
    applyEmailSubject: string;
    applyEmailBody: string;
    hasApplied?: boolean;
}

// --- Type for Application Status Map ---
type ApplicationStatusMap = Record<string, boolean>; // { [botIdentifier: string]: boolean }

// --- Server-Side Data Fetching Functions ---

/**
 * Fetches Bot definitions from the database as plain JavaScript objects.
 * Uses the IBotLean interface for typing.
 */
async function getBots(): Promise<IBotLean[]> { // Function signature expects IBotLean[]
    await dbConnect();
    try {
        const bots = await BotModel.find({})
                                    .sort({ order: 1, name: 1 })
                                    .lean<IBotLean>(); // Type hint for the lean result

        // OPTIONAL BUT RECOMMENDED: Add a runtime check to be safe
        if (!Array.isArray(bots)) {
            console.error("RUNTIME ERROR in getBots: Expected an array from BotModel.find().lean(), but received type:", typeof bots);
            return []; // Fulfill the Promise<IBotLean[]> signature
        }

        // *** Add type assertion here to override incorrect TS inference ***
        return bots as IBotLean[];
    } catch (error) {
        console.error("Failed to fetch bots:", error);
        return []; // Return empty array matching Promise<IBotLean[]>
    }
}


/**
 * Fetches the application statuses for a given user.
 */
async function getUserApplicationStatuses(userId: string | undefined): Promise<ApplicationStatusMap> {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return {};
    }
    await dbConnect();
    try {
        const applications = await BotApplicationModel.find(
            { userId: new mongoose.Types.ObjectId(userId) },
            'botId'
        ).lean();

        const statusMap: ApplicationStatusMap = {};
        // Ensure applications is an array before iterating
        if (Array.isArray(applications)) {
             applications.forEach(app => {
                if (app && typeof app === 'object' && app.botId) {
                    statusMap[String(app.botId)] = true;
                }
            });
        } else {
             console.error("RUNTIME ERROR in getUserApplicationStatuses: Expected an array, received:", typeof applications);
        }
        return statusMap;
    } catch (error) {
        console.error("Failed to fetch application statuses:", error);
        return {};
    }
}

// --- Main React Server Component ---
export default async function StudioPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string | undefined;

    const [botsFromDb, applicationStatuses] = await Promise.all([
        getBots(), // Fetches IBotLean[]
        getUserApplicationStatuses(userId)
    ]);

    // Transform the fetched bot data (IBotLean) into BotDisplayData
    const botsToDisplay: BotDisplayData[] = botsFromDb.map((bot: IBotLean) => ({
        _id: bot._id.toString(), // Convert ObjectId to string
        botIdentifier: bot.botIdentifier,
        name: bot.name,
        description: bot.description,
        discordClientId: bot.discordClientId,
        iconUrl: bot.iconUrl,
        videoUrl: bot.videoUrl,
        serverCount: bot.serverCount ?? 0,
        applyEmailSubject: bot.applyEmailSubject,
        applyEmailBody: bot.applyEmailBody,
        hasApplied: applicationStatuses[bot.botIdentifier] === true,
    }));

    // --- JSX Rendering ---
    return (
        <main className="studio-main-container p-4 md:p-8 bg-gray-900 text-gray-200 min-h-screen">
            <h1 className="studio-page-title text-3xl md:text-4xl font-bold mb-4 text-yellow-400 text-center">
                GPT HD2 Bot Studio
            </h1>
            <p className="studio-intro-text text-base md:text-lg text-gray-300 mb-8 max-w-3xl mx-auto text-center">
                Explore the custom bots developed by GPT Fleet, designed to enhance gameplay and community management for Helldivers 2 servers within our Alliance. Server Owners can apply to integrate these tools.
            </p>

            {!session?.user && (
                 <div className="sign-in-prompt bg-gray-800 p-4 rounded-lg text-center mb-8 max-w-md mx-auto">
                    Please{' '}
                    <Link href={`/api/auth/signin?callbackUrl=/helldivers-2/studio`} className="text-link text-yellow-400 hover:text-yellow-300 font-semibold underline">
                        sign in
                    </Link>
                    {' '}to view application status and apply for bots.
                </div>
            )}

            {session?.user && (
                <div className="studio-bot-list-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {botsToDisplay.length > 0 ? (
                        botsToDisplay.map((bot) => {
                            const hasApplied = bot.hasApplied;
                            const mailtoLink = `mailto:gptfleet@gmail.com?subject=${encodeURIComponent(bot.applyEmailSubject)}&body=${encodeURIComponent(bot.applyEmailBody)}`;

                            return (
                                <section key={bot.botIdentifier} className="bot-card bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
                                    <header className="bot-header flex items-center p-4 bg-gray-700 border-b border-gray-600">
                                        {bot.iconUrl ? (
                                            <Image
                                                src={bot.iconUrl}
                                                alt={`${bot.name} Icon`}
                                                width={64}
                                                height={64}
                                                className="bot-icon rounded-full mr-4 border-2 border-gray-500"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = '/images/placeholder.png';
                                                 }}
                                            />
                                        ) : (
                                            <div className="bot-icon-placeholder w-16 h-16 rounded-full mr-4 bg-gray-600 flex items-center justify-center text-xl font-bold text-gray-400 border-2 border-gray-500">
                                                ?
                                            </div>
                                        )}
                                        <div className="bot-header-text flex-grow">
                                            <h2 className="bot-name text-xl font-semibold text-white">{bot.name}</h2>
                                            <div className="bot-stats flex items-center text-sm text-gray-400 mt-1 space-x-3">
                                                <span className="stat-item flex items-center" title={`${bot.serverCount} servers currently using this bot`}>
                                                    <FaServer className="icon mr-1" aria-hidden="true" /> {bot.serverCount} Servers
                                                </span>
                                                <span className="stat-item flex items-center" title={`Bot Application ID: ${bot.discordClientId}`}>
                                                    <FaDiscord className="icon mr-1" aria-hidden="true"/> ID: {bot.discordClientId.substring(0, 6)}...
                                                </span>
                                            </div>
                                        </div>
                                    </header>

                                    <div className="bot-body p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <p className="bot-description text-gray-300 mb-4">
                                                {bot.description || 'No description available.'}
                                            </p>
                                            {bot.videoUrl && (
                                                <div className="video-link-container mb-4">
                                                    <a href={bot.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link text-link text-blue-400 hover:text-blue-300 inline-flex items-center">
                                                        <FaVideo className="icon mr-2" aria-hidden="true" /> Watch Demo Video
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="actions-container mt-4">
                                            {hasApplied ? (
                                                <button className="applied-button w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center opacity-70 cursor-not-allowed" disabled>
                                                   <FaCheckCircle className="mr-2" /> Applied
                                                </button>
                                            ) : (
                                                <a href={mailtoLink} className="apply-button-link w-full block text-center bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center">
                                                    <FaEnvelope className="mr-2" /> Apply to Use
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            );
                        })
                    ) : (
                         <p className="text-paragraph text-center text-gray-400 md:col-span-2 lg:col-span-3">
                            No bots are currently available for application. Check back later!
                         </p>
                    )}
                </div>
            )}
        </main>
    );
}