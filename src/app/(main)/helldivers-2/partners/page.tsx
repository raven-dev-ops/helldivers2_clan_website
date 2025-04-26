// src/app/(main)/helldivers-2/partners/page.tsx

import React from 'react';
import Link from 'next/link';
// Import the client component we created
import PartnerIcon from '@/components/partners/PartnerIconClient'; // Adjust path as needed
import dbConnect from '@/lib/dbConnect';
import ServerListingModel, { IServerListing } from '@/models/ServerListing';
import mongoose from 'mongoose';
import { FaDiscord, FaExternalLinkAlt, FaUsers, FaCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns'; // Import if needed for last post later

// --- Data Structure for Display (Expanded) ---
interface PartnerDisplayData {
    id: string; name: string; inviteLink: string;
    guildId?: string | null; guildName?: string | null;
    iconHash?: string | null; description?: string | null;
    memberCount?: number | null; presenceCount?: number | null;
}


// --- Server-Side Data Fetching Function (With Sorting) ---
async function getPartnerServers(): Promise<PartnerDisplayData[]> {
    await dbConnect();
    let initialPartners: any[] = [];
    try {
        initialPartners = await ServerListingModel.find({})
            .select('_id discord_server_name discord_invite_link')
            // Remove initial sort, we sort after fetching details
            // .sort({ discord_server_name: 1 })
            .lean();
        if (!initialPartners || initialPartners.length === 0) {
            console.log("No partner servers found in DB."); return [];
        }
    } catch (error) { console.error("[PartnersPage] Failed to fetch initial partner list from DB:", error); return []; }

    const partnerDetailPromises = initialPartners.map(async (p): Promise<PartnerDisplayData | null> => {
        if (!p?._id || !p.discord_server_name || !p.discord_invite_link) return null;
        const partnerIdString = p._id.toString();
        const partnerDbName = p.discord_server_name;
        const partnerInviteLink = p.discord_invite_link;
        const inviteCode = partnerInviteLink.split('/').pop();
        if (!inviteCode) return { id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink };
        try {
            const discordApiUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`;
            const response = await fetch(discordApiUrl, { next: { revalidate: 3600 } }); // Cache for 1 hour
            if (!response.ok) { console.warn(`Discord fetch failed ${response.status}`); return { id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink }; }
            const inviteData = await response.json();
            return {
                id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink,
                guildId: inviteData.guild?.id || null, guildName: inviteData.guild?.name || partnerDbName,
                iconHash: inviteData.guild?.icon || null, description: inviteData.guild?.description || null,
                memberCount: inviteData.approximate_presence_count || 0, // Online
                presenceCount: inviteData.approximate_member_count || 0, // Total
            };
        } catch (apiError) { console.error(`Error fetching details for ${inviteCode}:`, apiError); return { id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink }; }
    });

    const resolvedPartners = await Promise.all(partnerDetailPromises);
    let finalPartners = resolvedPartners.filter((p): p is PartnerDisplayData => p !== null);

    // --- Sort by presenceCount (Total Members) DESCENDING ---
    finalPartners.sort((a, b) => (b.presenceCount ?? 0) - (a.presenceCount ?? 0));

    console.log(`[PartnersPage] getPartnerServers: Returning ${finalPartners.length} processed and sorted partners.`);
    return JSON.parse(JSON.stringify(finalPartners));
}

// --- Define Styles needed by the Client Component ---
// These styles remain defined here to be passed as props
const partnerIconStyle: React.CSSProperties = {
    width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)'
};
const partnerIconPlaceholderStyle: React.CSSProperties = {
    width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', border: '2px solid var(--color-border)', fontSize: '1.8rem', color: 'var(--color-text-muted)'
};

// --- Main Component ---
export default async function PartnersPage() {
    const partners = await getPartnerServers();
    const mainDiscordLink = "https://discord.gg/gptfleet";

    // Helper to construct Discord icon URL
    const getDiscordIconUrl = (guildId?: string | null, iconHash?: string | null): string | null => {
        if (!guildId || !iconHash) return null;
        const format = iconHash.startsWith('a_') ? 'gif' : 'png';
        return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${format}?size=128`;
    };

    return (
        // Use global container or specific one from CSS
        <main className="partners-main-container"> {/* Use Class */}
            <h1 className="partners-page-title">GPT HD2 Partners</h1> {/* Use Class */}
            <p className="partners-intro-text"> {/* Use Class */}
                We are proud to collaborate with dedicated communities across the galaxy. Explore our partners and join their ranks!
            </p>

            {/* Use grid container class */}
            <div className="partners-grid">
                {partners.length > 0 ? (
                    partners.map((partner) => {
                        const iconUrl = getDiscordIconUrl(partner.guildId, partner.iconHash);
                        return (
                            // Apply card class
                            <article key={partner.id} className="partner-card">
                                {/* Header */}
                                <header className="partner-card-header"> {/* Use Class */}
                                    <div className="partner-icon-container"> {/* Use Class */}
                                        {/* Use the Client Component for the icon */}
                                        <PartnerIcon
                                            src={iconUrl}
                                            alt={`${partner.guildName || partner.name} server icon`}
                                            iconStyle={partnerIconStyle} // Pass style object
                                            placeholderStyle={partnerIconPlaceholderStyle} // Pass style object
                                        />
                                    </div>
                                    <div className="partner-header-text"> {/* Use Class */}
                                        <h2 className="partner-name">{partner.guildName || partner.name}</h2> {/* Use Class */}
                                        <div className="partner-stats"> {/* Use Class */}
                                            {typeof partner.memberCount === 'number' && partner.memberCount > 0 && (
                                                <span className="stat-item" title={`${partner.memberCount} members online`}> {/* Use Class */}
                                                    <FaCircle style={{ color: '#3ba55c', fontSize: '0.7em'}} aria-hidden="true" />
                                                    {partner.memberCount} Online
                                                </span>
                                            )}
                                             {typeof partner.presenceCount === 'number' && partner.presenceCount > 0 && (
                                                <span className="stat-item" title={`${partner.presenceCount} total members`}> {/* Use Class */}
                                                    <FaUsers className="icon" aria-hidden="true" /> {/* Use Class */}
                                                    {partner.presenceCount} Members
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </header>

                                {/* Body */}
                                <div className="partner-card-body"> {/* Use Class */}
                                    {partner.description ? (
                                         <p className="partner-description">{partner.description}</p> /* Use Class */
                                    ) : (
                                         <p className="partner-description-empty">No description provided.</p> /* Use Class */
                                    )}
                                    <a
                                        href={partner.inviteLink}
                                        target="_blank" rel="noopener noreferrer"
                                        className="join-button-link" // Use Class
                                    >
                                        Join Server <FaExternalLinkAlt className="join-button-icon" aria-hidden="true"/> {/* Use Class */}
                                    </a>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    // Apply class to the container div for centering if needed, or use text-center utility
                    <div className="col-span-full text-center"> {/* Example for grid spanning */}
                        <p className="no-partners-text"> {/* Use Class */}
                            No Alliance Partners are currently listed. Check back soon for updates!
                        </p>
                    </div>
                )}
            </div>

             {/* Concluding Text */}
            <section className="concluding-section"> {/* Use Class */}
                 <p className="text-paragraph"> {/* Use Class */}
                    Interested in joining the GPT Alliance? Reach out to our leadership on the main{' '}
                    <a href={mainDiscordLink} target="_blank" rel="noopener noreferrer" className="text-link">GPT HD2 Discord</a>. {/* Use Class */}
                 </p>
             </section>
        </main>
    );
}