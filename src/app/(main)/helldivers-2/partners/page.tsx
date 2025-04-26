// src/app/(main)/helldivers-2/partners/page.tsx

import React from 'react';
import Link from 'next/link';
// Import the client component we created
import PartnerIcon from '@/components/partners/PartnerIconClient'; // Adjust path as needed
import dbConnect from '@/lib/dbConnect';
import ServerListingModel, { IServerListing } from '@/models/ServerListing';
import mongoose from 'mongoose';
import { FaDiscord, FaExternalLinkAlt, FaUsers, FaCircle } from 'react-icons/fa';
// Import the CSS module
import styles from './PartnersPage.module.css';

// --- Data Structure for Display (Expanded) ---
interface PartnerDisplayData {
    id: string; name: string; inviteLink: string;
    guildId?: string | null; guildName?: string | null;
    iconHash?: string | null; description?: string | null;
    memberCount?: number | null; presenceCount?: number | null; // online / total
}


// --- Server-Side Data Fetching Function (With Sorting) ---
async function getPartnerServers(): Promise<PartnerDisplayData[]> {
    try {
        await dbConnect(); // Connect first
        let initialPartners: any[] = [];
        try {
            initialPartners = await ServerListingModel.find({})
                .select('_id discord_server_name discord_invite_link')
                .lean();
            if (!initialPartners || initialPartners.length === 0) {
                console.log("[PartnersPage] No partner servers found in DB."); return [];
            }
        } catch (dbError) { console.error("[PartnersPage] Failed to fetch initial partner list from DB:", dbError); return []; }

        const partnerDetailPromises = initialPartners.map(async (p): Promise<PartnerDisplayData | null> => {
            if (!p?._id || !p.discord_server_name || !p.discord_invite_link) return null;
            const partnerIdString = p._id.toString();
            const partnerDbName = p.discord_server_name;
            const partnerInviteLink = p.discord_invite_link;
            const inviteCode = partnerInviteLink.split('/').pop()?.split('?')[0]; // Extract code more reliably

            // Basic fallback structure if Discord API fails or no invite code
            const fallbackData = { id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink };

            if (!inviteCode) return fallbackData;

            try {
                const discordApiUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`;
                const response = await fetch(discordApiUrl, { next: { revalidate: 3600 } }); // Cache for 1 hour

                if (!response.ok) {
                    console.warn(`[PartnersPage] Discord fetch failed for ${inviteCode}: ${response.status}`);
                    // Return fallback data instead of null to still show the partner from DB
                    return fallbackData;
                }
                const inviteData = await response.json();

                // Check if guild data exists
                if (!inviteData.guild) {
                     console.warn(`[PartnersPage] No guild data found in invite response for ${inviteCode}`);
                     return fallbackData;
                }

                return {
                    id: partnerIdString,
                    name: partnerDbName, // Keep name from DB as primary
                    inviteLink: partnerInviteLink,
                    guildId: inviteData.guild.id || null,
                    guildName: inviteData.guild.name || partnerDbName, // Fallback to DB name
                    iconHash: inviteData.guild.icon || null,
                    description: inviteData.guild.description || null,
                    memberCount: inviteData.approximate_presence_count || 0, // Online count
                    presenceCount: inviteData.approximate_member_count || 0, // Total count
                };
            } catch (apiError) {
                console.error(`[PartnersPage] Error fetching Discord details for ${inviteCode}:`, apiError);
                return fallbackData; // Return fallback data on API error
            }
        });

        const resolvedPartners = await Promise.all(partnerDetailPromises);
        let finalPartners = resolvedPartners.filter((p): p is PartnerDisplayData => p !== null);

        // Sort by presenceCount (Total Members) DESCENDING
        finalPartners.sort((a, b) => (b.presenceCount ?? 0) - (a.presenceCount ?? 0));

        console.log(`[PartnersPage] getPartnerServers: Returning ${finalPartners.length} processed partners.`);
        // Use JSON stringify/parse for deep cloning Server Component props if needed, but lean objects are often fine
        return JSON.parse(JSON.stringify(finalPartners));
    } catch (error) {
        // Catch errors from dbConnect or other top-level issues
        console.error("[PartnersPage] General error in getPartnerServers:", error);
        return [];
    }
}

// --- Styles for Client Component (Passed as props) ---
// Define these outside the main component if they don't change per instance
const partnerIconStyle: React.CSSProperties = {
    width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover',
    border: '2px solid #4b5563' // border-gray-600
};
const partnerIconPlaceholderStyle: React.CSSProperties = {
    width: '64px', height: '64px', borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#374151', // bg-gray-700
    border: '2px solid #4b5563', // border-gray-600
    fontSize: '1.8rem', color: '#9ca3af' // text-gray-400
};

// --- Main Component ---
export default async function PartnersPage() {
    const partners = await getPartnerServers();
    const mainDiscordLink = "https://discord.gg/gptfleet";

    // Helper to construct Discord icon URL
    const getDiscordIconUrl = (guildId?: string | null, iconHash?: string | null): string | null => {
        if (!guildId || !iconHash) return null;
        const format = iconHash.startsWith('a_') ? 'gif' : 'png'; // Handle animated icons
        return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${format}?size=128`;
    };

    return (
        // Apply CSS Module classes
        <main className={styles.partnersMainContainer}>
            <h1 className={styles.partnersPageTitle}>GPT HD2 Partners</h1>
            <p className={styles.partnersIntroText}>
                We are proud to collaborate with dedicated communities across the galaxy. Explore our partners and join their ranks!
            </p>

            <div className={styles.partnersGrid}>
                {partners.length > 0 ? (
                    partners.map((partner) => {
                        const iconUrl = getDiscordIconUrl(partner.guildId, partner.iconHash);
                        // Determine display name, prioritize fetched guild name
                        const displayName = partner.guildName || partner.name;

                        return (
                            <article key={partner.id} className={styles.partnerCard}>
                                <header className={styles.partnerCardHeader}>
                                    <div className={styles.partnerIconContainer}>
                                        {/* Use Client Component, passing styles as props */}
                                        <PartnerIcon
                                            src={iconUrl}
                                            alt={`${displayName} server icon`}
                                            iconStyle={partnerIconStyle}
                                            placeholderStyle={partnerIconPlaceholderStyle}
                                        />
                                    </div>
                                    <div className={styles.partnerHeaderText}>
                                        <h2 className={styles.partnerName} title={displayName}>
                                            {displayName}
                                        </h2>
                                        <div className={styles.partnerStats}>
                                            {/* Online Count */}
                                            {typeof partner.memberCount === 'number' && partner.memberCount > 0 && (
                                                <span className={styles.statItem} title={`${partner.memberCount} members online`}>
                                                    {/* Green circle for online status */}
                                                    <FaCircle style={{ color: '#3ba55c', fontSize: '0.7em', marginRight: '0.3em'}} aria-hidden="true" />
                                                    {partner.memberCount} Online
                                                </span>
                                            )}
                                            {/* Total Members Count */}
                                             {typeof partner.presenceCount === 'number' && partner.presenceCount > 0 && (
                                                <span className={styles.statItem} title={`${partner.presenceCount} total members`}>
                                                    <FaUsers className={styles.icon} aria-hidden="true" />
                                                    {partner.presenceCount} Members
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </header>

                                <div className={styles.partnerCardBody}>
                                    {/* Use fetched description or fallback */}
                                    {partner.description ? (
                                         <p className={styles.partnerDescription}>{partner.description}</p>
                                    ) : (
                                         <p className={styles.partnerDescriptionEmpty}>No description provided.</p>
                                    )}
                                    {/* Join Button */}
                                    <a
                                        href={partner.inviteLink}
                                        target="_blank" rel="noopener noreferrer"
                                        className={styles.joinButtonLink}
                                    >
                                        Join Server <FaExternalLinkAlt className={styles.joinButtonIcon} aria-hidden="true"/>
                                    </a>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    // Message shown when no partners are found
                    <div className={styles.noPartnersContainer}>
                        <p className={styles.noPartnersText}>
                            No Alliance Partners are currently listed. Check back soon for updates!
                        </p>
                    </div>
                )}
            </div>

             {/* Concluding Text Section */}
            <section className={styles.concludingSection}>
                 <p className={styles.textParagraph}>
                    Interested in joining the GPT Alliance? Reach out to our leadership on the main{' '}
                    <a href={mainDiscordLink} target="_blank" rel="noopener noreferrer" className={styles.textLink}>GPT HD2 Discord</a>.
                 </p>
             </section>
        </main>
    );
}