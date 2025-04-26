// src/app/(main)/helldivers-2/partners/page.tsx

import React from 'react';
import Link from 'next/link'; // Keep for internal links like the footer one
// Import the client component we created
import PartnerIcon from '@/components/partners/PartnerIconClient';
import dbConnect from '@/lib/dbConnect'; // Ensure correct path
import ServerListingModel, { IServerListing } from '@/models/ServerListing'; // Import your model
import mongoose from 'mongoose';
import { FaDiscord, FaExternalLinkAlt, FaUsers, FaCircle } from 'react-icons/fa'; // Icons

// --- Data Structure for Display (Expanded) ---
interface PartnerDisplayData {
    id: string; // Document _id or unique identifier
    name: string; // Name from DB (can be overridden by API)
    inviteLink: string;
    // Fetched from Discord API
    guildId?: string | null; // Discord's Server ID
    guildName?: string | null; // Name according to Discord API
    iconHash?: string | null; // Hash for the server icon
    description?: string | null; // Server description from Discord
    memberCount?: number | null; // Approximate online members (presence_count from API)
    presenceCount?: number | null; // Approximate total members (member_count from API)
}


// --- Server-Side Data Fetching Function (Keep the corrected version) ---
async function getPartnerServers(): Promise<PartnerDisplayData[]> {
    console.log("[PartnersPage] getPartnerServers: Function called.");
    try {
        await dbConnect();
        console.log("[PartnersPage] getPartnerServers: Database connected successfully.");
    } catch (dbError) {
        console.error("[PartnersPage] getPartnerServers: Database connection FAILED:", dbError);
        return [];
    }

    let initialPartners: any[] = [];

    try {
        console.log(`[PartnersPage] getPartnerServers: Querying collection: '${ServerListingModel.collection.name}'`);
        initialPartners = await ServerListingModel.find({})
            .select('_id discord_server_name discord_invite_link')
            .sort({ discord_server_name: 1 })
            .lean();
        console.log(`[PartnersPage] getPartnerServers: Found ${initialPartners?.length ?? 0} raw documents from DB.`);
        if (!initialPartners || initialPartners.length === 0) {
            console.log("[PartnersPage] No partner server documents found in the specified collection.");
            return [];
        }
        if (initialPartners.length > 0) {
             console.log("[PartnersPage] First raw document:", JSON.stringify(initialPartners[0]));
        }
    } catch (error) {
        console.error("[PartnersPage] Failed to fetch initial partner list from DB:", error);
        return [];
    }

    const partnerDetailPromises = initialPartners.map(async (p): Promise<PartnerDisplayData | null> => {
        if (!p?._id || !p.discord_server_name || !p.discord_invite_link) {
            console.warn("[PartnersPage] Skipping partner due to missing base data:", p);
            return null;
        }
        const partnerIdString = p._id.toString();
        const partnerDbName = p.discord_server_name;
        const partnerInviteLink = p.discord_invite_link;
        const inviteCode = partnerInviteLink.split('/').pop();

        if (!inviteCode) {
            console.warn(`[PartnersPage] Could not extract invite code for partner: ${partnerDbName}`);
            return { id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink };
        }

        try {
            const discordApiUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`;
            const response = await fetch(discordApiUrl, { next: { revalidate: 3600 } });

            if (!response.ok) {
                console.warn(`[PartnersPage] Failed Discord fetch for ${inviteCode} (${partnerDbName}): ${response.status}`);
                 return { id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink };
            }

            const inviteData = await response.json();
            const displayData: PartnerDisplayData = {
                id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink,
                guildId: inviteData.guild?.id || null, guildName: inviteData.guild?.name || partnerDbName,
                iconHash: inviteData.guild?.icon || null, description: inviteData.guild?.description || null,
                memberCount: inviteData.approximate_presence_count || 0,
                presenceCount: inviteData.approximate_member_count || 0,
            };
            return displayData;

        } catch (apiError) {
            console.error(`[PartnersPage] Error fetching details for invite ${inviteCode} (${partnerDbName}):`, apiError);
            return { id: partnerIdString, name: partnerDbName, inviteLink: partnerInviteLink };
        }
    });

    const resolvedPartners = await Promise.all(partnerDetailPromises);
    const finalPartners = resolvedPartners.filter((p): p is PartnerDisplayData => p !== null);
    console.log(`[PartnersPage] getPartnerServers: Returning ${finalPartners.length} processed partners.`);
    return JSON.parse(JSON.stringify(finalPartners));
}


// --- Style Object (Keep as defined previously) ---
const styles: { [key: string]: React.CSSProperties } = {
    mainContainer: { maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', padding: '2rem 1rem 4rem', fontFamily: 'var(--font-sans, sans-serif)', color: 'var(--color-text-primary)' },
    pageTitle: { fontSize: 'clamp(1.8rem, 5vw, 2.25rem)', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary, #facc15)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', textAlign: 'center', },
    introText: { color: 'var(--color-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '70ch', marginInline: 'auto' },
    partnerListContainer: { display: 'flex', flexDirection: 'column', gap: '1.5rem', },
    partnerCard: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden', },
    partnerCardHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--color-surface-alt)', borderBottom: '1px solid var(--color-border-alt)', textAlign: 'center', },
    partnerIconContainer: { flexShrink: 0 },
    // Remove direct partnerIcon style, it's handled by the client component's props now
    // partnerIcon: { width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)'},
    partnerIconPlaceholder: { width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', border: '2px solid var(--color-border)', fontSize: '1.8rem', color: 'var(--color-text-muted)' },
    partnerHeaderText: { flexGrow: 1, minWidth: 0, textAlign: 'center', },
    partnerName: { fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem', },
    partnerStats: { fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center', },
    statItem: { display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' },
    partnerCardBody: { padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '1rem', },
    partnerDescription: { fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, flexGrow: 1, marginBottom: '1rem' },
    partnerDescriptionEmpty: { fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic', flexGrow: 1, marginBottom: '1rem' },
    joinButtonLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#7289DA', color: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: 'var(--border-radius-md)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)', transition: 'background-color 0.2s ease, transform 0.1s ease', alignSelf: 'flex-start', marginTop: 'auto', },
    joinButtonIcon: { fontSize: '1em', },
    noPartnersText: { textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-secondary)', fontSize: '1.1rem', },
    paragraph: { color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.7, },
    link: { color: 'var(--color-primary-hover)', textDecoration: 'underline', textUnderlineOffset: '2px', },
    concludingSection: { marginTop: '3rem', paddingTop: '1.5rem', borderTop: `1px solid var(--color-border)`, textAlign: 'center', },
    icon: { marginRight: '0.3rem', display: 'inline-block', verticalAlign: 'middle', fontSize: '0.9em', color: 'var(--color-text-muted)', }, // Keep icon style
};

// --- Define Styles needed by the Client Component ---
// These are extracted so they can be passed as props
const partnerIconStyle: React.CSSProperties = {
    width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)'
};
const partnerIconPlaceholderStyle: React.CSSProperties = {
    width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', border: '2px solid var(--color-border)', fontSize: '1.8rem', color: 'var(--color-text-muted)'
};


// --- Main Component ---
export default async function PartnersPage() {
    const partners = await getPartnerServers();
    const mainDiscordLink = "https://discord.gg/gptfleet"; // Main GPT Fleet link

    // Helper to construct Discord icon URL
    const getDiscordIconUrl = (guildId?: string | null, iconHash?: string | null): string | null => {
        if (!guildId || !iconHash) return null;
        const format = iconHash.startsWith('a_') ? 'gif' : 'png';
        return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${format}?size=128`;
    };

    return (
        <main style={styles.mainContainer}>
            <h1 style={styles.pageTitle}>GPT Fleet Alliance Partners</h1>
            <p style={styles.introText}>
                We are proud to collaborate with dedicated communities across the galaxy. Explore our partners and join their ranks!
            </p>

            <div style={styles.partnerListContainer}>
                {partners.length > 0 ? (
                    partners.map((partner) => {
                        const iconUrl = getDiscordIconUrl(partner.guildId, partner.iconHash);
                        return (
                            <article key={partner.id} style={styles.partnerCard}>
                                {/* Header */}
                                <header style={styles.partnerCardHeader}>
                                    <div style={styles.partnerIconContainer}>
                                        {/* Use the Client Component for the icon */}
                                        <PartnerIcon
                                            src={iconUrl}
                                            alt={`${partner.guildName || partner.name} server icon`}
                                            // Pass styles as props
                                            iconStyle={partnerIconStyle}
                                            placeholderStyle={partnerIconPlaceholderStyle}
                                        />
                                    </div>
                                    <div style={styles.partnerHeaderText}>
                                        <h2 style={styles.partnerName}>{partner.guildName || partner.name}</h2>
                                        <div style={styles.partnerStats}>
                                            {typeof partner.memberCount === 'number' && partner.memberCount > 0 && (
                                                <span style={styles.statItem} title={`${partner.memberCount} members online`}>
                                                    <FaCircle style={{ color: '#3ba55c', fontSize: '0.7em'}} aria-hidden="true" />
                                                    {partner.memberCount} Online
                                                </span>
                                            )}
                                            {typeof partner.presenceCount === 'number' && partner.presenceCount > 0 && (
                                                <span style={styles.statItem} title={`${partner.presenceCount} total members`}>
                                                    <FaUsers style={styles.icon} aria-hidden="true" />
                                                    {partner.presenceCount} Members
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </header>

                                {/* Body */}
                                <div style={styles.partnerCardBody}>
                                    {partner.description ? (
                                         <p style={styles.partnerDescription}>{partner.description}</p>
                                    ) : (
                                         <p style={styles.partnerDescriptionEmpty}>No description provided.</p>
                                    )}
                                    <a
                                        href={partner.inviteLink}
                                        target="_blank" rel="noopener noreferrer"
                                        style={styles.joinButtonLink}
                                    >
                                        Join Server <FaExternalLinkAlt style={styles.joinButtonIcon} aria-hidden="true"/>
                                    </a>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <p style={styles.noPartnersText}>
                        No Alliance Partners are currently listed. Check back soon for updates!
                    </p>
                )}
            </div>

             {/* Concluding Text */}
            <section style={styles.concludingSection}>
                 <p style={styles.paragraph}>
                    Interested in joining the GPT Fleet Alliance? Reach out to our leadership on the main{' '}
                    <a href={mainDiscordLink} target="_blank" rel="noopener noreferrer" style={styles.link}>GPT Fleet Discord</a>.
                 </p>
             </section>
        </main>
    );
}