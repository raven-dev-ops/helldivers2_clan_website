// src/app/(main)/dune-awakening/partners/page.tsx
import React from 'react';
import Link from 'next/link'; // Keep for internal links like the footer one
import { FaDiscord, FaExternalLinkAlt } from 'react-icons/fa'; // Icons

// --- Data Structure for Display ---
interface PartnerDisplayData {
    id: string; // Use a unique identifier (e.g., placeholder ID or server ID)
    name: string;
    inviteLink: string;
}

// --- Hardcoded Partner Data (PLACEHOLDER - Replace with actual Dune partners) ---
const placeholderDunePartners: PartnerDisplayData[] = [
    {
        id: 'dune-partner-1',
        name: 'Arrakis Spice Traders Guild', // Example Name
        inviteLink: 'https://discord.gg/example1' // Example Link
    },
    {
        id: 'dune-partner-2',
        name: 'Sietch Tabr Survivors', // Example Name
        inviteLink: 'https://discord.gg/example2' // Example Link
    },
    {
        id: 'dune-partner-3',
        name: 'Caladan Veterans League', // Example Name
        inviteLink: 'https://discord.gg/example3' // Example Link
    },
     {
        id: 'gptfleet-main', // Include main fleet for cross-promotion?
        name: 'GPT Fleet Command (Main)',
        inviteLink: 'https://discord.gg/gptfleet'
    },
    // Add more placeholder partners as needed
];


// --- Style Object (Adopted from previous partner page) ---
const styles: { [key: string]: React.CSSProperties } = {
    // Using styles similar to the Helldivers partners page for consistency
    mainContainer: { maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', padding: '2rem 1rem 4rem', fontFamily: 'var(--font-sans, sans-serif)', color: 'var(--color-text-primary)' },
    pageTitle: { fontSize: 'clamp(1.8rem, 5vw, 2.25rem)', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary, #f9a825)', /* Dune Theme Color */ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', textAlign: 'center', },
    introText: { color: 'var(--color-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '70ch', marginInline: 'auto' },
    partnerListContainer: { display: 'flex', flexDirection: 'column', gap: '1.5rem', },
    partnerCard: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '1.5rem', gap: '1rem', },
    partnerInfo: { display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1, width: '100%', },
    partnerIcon: { fontSize: '2rem', color: '#7289DA', flexShrink: 0, },
    partnerText: { minWidth: 0, },
    partnerName: { fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem', },
    joinButtonLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#7289DA', color: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: 'var(--border-radius-md)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)', transition: 'background-color 0.2s ease, transform 0.1s ease', flexShrink: 0, marginTop: '0.5rem', alignSelf: 'flex-start', },
    joinButtonIcon: { fontSize: '1em', },
    noPartnersText: { textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-secondary)', fontSize: '1.1rem', },
    paragraph: { color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.7, },
    link: { color: 'var(--color-primary-hover, #fbc02d)', /* Dune hover */ textDecoration: 'underline', textUnderlineOffset: '2px', },
    concludingSection: { marginTop: '3rem', paddingTop: '1.5rem', borderTop: `1px solid var(--color-border)`, textAlign: 'center', },
};

// --- Main Component (Using placeholder data) ---
export default function DunePartnersPage() {
    // Use the hardcoded placeholder data
    const partners = placeholderDunePartners;
    // Link to the specific Dune discord
    const duneDiscordLink = "https://discord.gg/gptdune";

    return (
        <main style={styles.mainContainer}>
            <h1 style={styles.pageTitle}>Dune: Awakening Alliance Partners</h1>
            <p style={styles.introText}>
                On the harsh sands of Arrakis, alliances are essential. Discover the Houses and communities partnered with the GPT Fleet's Dune Division.
            </p>

            <div style={styles.partnerListContainer}>
                {partners.length > 0 ? (
                    partners.map((partner) => (
                        // Partner Card
                        <article key={partner.id} style={styles.partnerCard}>
                            <div style={styles.partnerInfo}>
                                <FaDiscord style={styles.partnerIcon} aria-hidden="true" />
                                <div style={styles.partnerText}>
                                    <h2 style={styles.partnerName}>{partner.name}</h2>
                                    {/* Optional: Add description if needed */}
                                </div>
                            </div>
                             {/* Use <a> for external Discord link */}
                            <a
                                href={partner.inviteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.joinButtonLink}
                            >
                                Join Server <FaExternalLinkAlt style={styles.joinButtonIcon} aria-hidden="true"/>
                            </a>
                        </article>
                    ))
                ) : (
                    <p style={styles.noPartnersText}>
                        No Dune Alliance Partners are currently listed. Help us forge alliances!
                    </p>
                )}
            </div>

             {/* Concluding Text */}
            <section style={styles.concludingSection}>
                 <p style={styles.paragraph}>
                    Wish to see your House or Sietch listed here? Discuss potential alliances with leadership on the{' '}
                    {/* Use <a> tag for the external Discord link */}
                    <a href={duneDiscordLink} target="_blank" rel="noopener noreferrer" style={styles.link}>GPT Dune Division Discord</a>.
                 </p>
             </section>
        </main>
    );
}