// src/app/(main)/dune-awakening/factions/page.tsx
"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaDiscord } from 'react-icons/fa';
import Image from 'next/image'; // Import Image component

// --- Data Structure ---

interface Faction {
    id: string;
    name: string;
    summary: string;
    imageUrl?: string; // Optional image URL
    lore: string;
    role: string;
    gameplay: string;
    idealPlaystyle: string;
    comparison?: string; // Optional comparison section
}

// --- Faction Data (Structured from provided text) ---
const duneFactions: Faction[] = [
    {
        id: 'atreides',
        name: 'House Atreides',
        summary: 'The noble house valuing honor, loyalty, and justice.',
        lore: `House Atreides is renowned for its moral integrity, honor, and loyalty, traits that have earned them great respect in the Imperium. Led by Duke Leto Atreides, this Great House has “served the Imperium for ten millennia” with a reputation for nobility and just rule. In the classic Dune lore, House Atreides comes from the ocean planet Caladan and values the loyalty of its people and allies. They have a longstanding feud with House Harkonnen, an ancient vendetta spanning thousands of years.\n\nIn Dune: Awakening’s alternate timeline, Lady Jessica (Leto’s concubine and a Bene Gesserit) bore a daughter (named Ariste) instead of a son (Paul), allowing Jessica to foresee and thwart Dr. Yueh’s treachery. As a result, Duke Leto survived the attempted coup on Arrakis, and House Atreides was not wiped out. Now the Atreides remain a major power on Arrakis, evenly matched in an ongoing war against the Harkonnens for the future of the planet. This conflict is formally a War of Assassins – a sanctioned, limited war of attrition and intrigue, rather than open battlefield slaughter. Lore-wise, Atreides forces are known for discipline and loyalty, and their leadership strives to do what is right for the people of Arrakis, earning goodwill among inhabitants.`,
        role: `In Dune: Awakening, House Atreides is one of the two player-alignable factions at launch. Players can choose to join the Atreides faction through the guild system, effectively becoming agents of House Atreides on Arrakis. The Atreides control territory (likely the city of Arrakeen or nearby regions) and are locked in the struggle for control of Spice against Harkonnen forces. Atreides presence provides a relative safe haven for players – expect Atreides-held settlements or outposts where the rule of law and honor is upheld.\n\nThe Atreides influence on Arrakis also means players aligned with them might encounter supportive NPCs (e.g. local villages trusting Atreides agents) and storylines involving defending the populace or forging alliances. Their political goal in-game is to win the upper hand both on the battlefield and in the Landsraad (the council of Great Houses). In the game’s dynamic events, Atreides leaders may call on players to complete objectives that sway other Houses’ support – for example, securing a large haul of Spice to win a Landsraad vote. Overall, Atreides represents the “protagonist” side of the conflict, emphasizing honor and protection.`,
        gameplay: `Choosing Atreides grants access to unique rewards and styles that reflect their noble ethos. Funcom has confirmed that aligning with a faction unlocks unique equipment, vehicles, and building pieces for players. For Atreides players, this likely means Atreides-themed armor and outfits (stylish, military gear in House colors), perhaps ornithopters or vehicles in Atreides design, and building components inspired by Atreides architecture (sleek, well-lit structures with decorative Caladanian aesthetics). The concept art suggests Atreides settlements feature open plazas and orderly markets, potentially translating to player bases.\n\nIn combat and strategy, Atreides faction might lend itself to defensive and supportive mechanics. Atreides gear might favor balanced protection and efficient weaponry. Players may receive more NPC assistance or easier diplomacy due to their reputation. House Atreides’ emphasis on strategy and coalition-building encourages forming player alliances (guilds) and coordinating large-scale events. The faction progression system allows players to rise in ranks, performing missions for Duke Leto or Lady Jessica and influencing faction-wide outcomes.`,
        idealPlaystyle: `House Atreides is well-suited for players who enjoy a heroic or diplomatic playstyle. Ideal for cooperation, protecting allies, and structured PvE content. Welcoming for new players due to the clear "good guy" narrative and support systems. Gameplay involves a mix of combat and negotiation. Suits players preferring balanced gameplay (combat, crafting, diplomacy) or fans of Atreides lore. Great for team-oriented players and those wanting a clear moral compass.`,
        comparison: `**Atreides vs. Harkonnen:** Atreides favor honorable tactics and loyalty, while Harkonnen use fear and treachery. Atreides may find alliances easier, while Harkonnens operate in a cutthroat environment. Atreides strategies often involve defense and counter-attacks, a reactive, justice-driven style. They leverage discipline and technology over brute force.`
    },
    {
        id: 'harkonnen',
        name: 'House Harkonnen',
        summary: 'The brutal house driven by ambition, fear, and ruthless tactics.',
        lore: `In stark contrast to the Atreides, House Harkonnen embodies brutality, cunning, and ruthless ambition. Originating from the industrial world of Giedi Prime, the Harkonnens are infamous for cruel tyranny and using fear as a tool of control. Led by the devious Baron Vladimir Harkonnen, they have hated House Atreides for millennia.\n\nIn Dune: Awakening’s alternate history, the Harkonnens' attempt to annihilate House Atreides failed due to Lady Jessica’s intervention. The conflict now continues as a protracted War of Assassins. The Baron and his nephews (Rabban and Feyd-Rautha) remain intent on seizing Arrakis’s riches. Harkonnen forces employ terror tactics, brutal oppression, and tactical deceit (poisons, assassins, sabotage). Their dark aesthetic broadcasts their philosophy: fear is the mind-killer – of their enemies. Their past rule of Arrakis was marked by cruelty, earning Fremen hatred. They likely control Carthag or other strategic locations, occupying heavily fortified bases.`,
        role: `House Harkonnen is the second player-alignable faction. Players joining Harkonnen serve the Baron's interests: aggressive expansion, sabotage of Atreides, and amassing Spice by any means. They provide the antagonistic force, instigating conflict and raiding resources. Missions may involve assassinations, terrorizing villages, or seizing Spice sites. Harkonnen competes politically through intimidation and dirty tricks. They control heavily defended bases, potentially featuring las-cannons and ornithopter pads. Harkonnen NPC presence makes controlled regions dangerous for enemies but supportive for allies. Their harsh rule can victimize neutral parties, creating dynamic events.`,
        gameplay: `Aligning with Harkonnen grants intimidating faction gear: heavy, spiked battle armor, grim helmets, and high-power weaponry. Vehicles might favor armor and firepower. Base-building allows for dark, oppressive, fortified structures with potential defenses like cannons. Gameplay encourages PvP and combat. Quests may push players to raid or duel rivals. Political objectives might involve coercion or theft. The internal culture rewards ruthlessness (bonuses for kills/assassinations). However, this breeds dissent: "Harkonnen Traitors" (NPC enemies) exist, hinting at potential mutiny or faction infighting quests. Harkonnen gameplay is tailored for wielding brute force and fear.`,
        idealPlaystyle: `Ideal for players relishing aggressive, high-stakes gameplay and playing the “villain.” Suits PvP enthusiasts and those enjoying dominance in sandbox games. Experienced players may prefer the unforgiving, challenging environment. Offers satisfaction through raiding and direct competition. Appeals to combat-heavy roles (brutes, snipers, assassins) and those intrigued by Dune's darker lore. New players should be prepared for a steeper learning curve due to more PvP and fewer safe havens. Ruthlessness and prowess are rewarded, allowing quick progression for skilled players.`,
        comparison: `**Harkonnen vs. Atreides:** Harkonnen thrive on fear, betrayal, and offense, contrasting Atreides' honor, alliances, and defense. Harkonnen players might solo objectives by eliminating competition, while Atreides team up. Harkonnen might ambush harvesters, Atreides guard them. Suits competitive/predatory gameplay versus cooperative/story-driven. Both factions are balanced in power but offer distinct ethical and tactical choices: chaos vs. order, cruelty vs. honor, domination vs. collaboration.`
    },
    {
        id: 'fremen',
        name: 'The Fremen',
        summary: 'The vanished indigenous desert survivors, central to Arrakis\'s mystery.',
        // No image provided specifically for Fremen section in the source text
        lore: `The Fremen are the indigenous people of Arrakis – hardened desert survivors known for blue-within-blue eyes, fierce warrior culture, and their dream of terraforming Arrakis. They master riding sandworms and wear stillsuits. Historically instrumental, they allied with Paul Atreides in the original timeline.\n\nHowever, in Dune: Awakening, the Fremen have vanished. Imperial propaganda claims they were wiped out. The game begins with this mystery: players are tasked with uncovering their fate. Did the Harkonnens/Sardaukar succeed, or are they underground? Their abandoned sietches and legends linger. There's an expectation they might return, making their disappearance a central narrative hook.`,
        role: `Though not initially playable, Fremen influence survival mechanics. Players "learn the ways of the Fremen" – using stillsuits, water discipline, respecting desert dangers. Their absence creates a power vacuum filled by off-world Houses. The storyline likely involves finding signs of survivors (like Chani?), exploring abandoned sietches for clues, and potentially encountering them later. Their potential return (as NPCs or a playable faction) is hinted at. They embody the spiritual aspect of Dune and represent the soul of Arrakis. They are the central mystery driving player discovery.`,
        gameplay: `Fremen influence gameplay through technology and environment. Stillsuits are key survival items players craft and use. Fremen weapons like crysknives might be discoverable high-end gear. The absence of Fremen allies makes the deep desert more dangerous for solo players. Empty sietches could be resource/lore locations. Potential future mechanics include worm-riding (unlocked via storyline progression). Faction choices might affect interactions with any surviving Fremen: Atreides might seek to aid them, Harkonnen to eliminate or exploit them. Currently, their impact is more environmental and narrative than direct faction mechanics.`,
        idealPlaystyle: `Engages players who love exploration, lore, and survival. Ideal for uncovering hidden stories and mastering the environment. Experienced players might adopt a "hardcore survivalist" playstyle, mimicking Fremen self-sufficiency. New players learn Fremen-like survival techniques through the main questline. If they become playable later, they would likely appeal to stealth, guerrilla tactics, and independence-focused players (survival MMO fans).`,
        comparison: `Fremen contrast the off-world factions by representing Arrakis itself, focused on freedom and survival over politics and profit. Engaging with their lore prompts questioning the Houses' goals. They are fundamentally different from political players like the Emperor or Bene Gesserit. If playable, they'd likely have unique mobility (worms), stealth, and challenging starting conditions, distinct from House infrastructure and warfare.`
    },
    {
        id: 'corrino',
        name: 'House Corrino (Imperium & Sardaukar)',
        summary: 'The ruling Imperial dynasty and their elite Sardaukar troops, overseeing Arrakis.',
        // No image provided specifically for Corrino section in the source text
        lore: `House Corrino is the Imperial dynasty ruling the Known Universe, led by Emperor Shaddam IV. They maintain control via political maneuvering and the brutal Sardaukar, elite terror troops trained on Salusa Secundus. In this timeline, the Emperor's plot against Atreides partially failed. Now, he allows a controlled War of Assassins between Atreides and Harkonnen, overseen by Sardaukar forces deployed to safeguard spice production. The Emperor plays a balancing role, preventing total victory for either House to maintain Corrino supremacy. He acts as a shadow faction, pulling strings and ensuring the spice flows.`,
        role: `Corrino manifests through Imperial decrees and Sardaukar encounters. Players cannot join initially. Imperial authority frames the conflict (War of Assassins rules). Periodic Imperial events/rules might occur (e.g., declaring truce zones, levying spice taxes). The Emperor is the "scorekeeper" in the Landsraad political meta-game, his favor courted by both factions. Sardaukar appear as high-level NPC enemies, potentially during missions, guarding spice blows, or enforcing Imperial edicts. Imperial representatives might appear in the story. Corrino influence is felt in the economy via CHOAM shares. A potential third playable faction post-launch, likely focusing on enforcement/mediation.`,
        gameplay: `Impact comes through world events and challenges. Sardaukar are tough PvE encounters, testing combat skills and dropping potentially valuable loot (like the Sardaukar Bator armor cosmetic). Imperial Edicts could create temporary gameplay shifts (PvP hotspots, ceasefire zones) with consequences for non-compliance (Sardaukar raids). Landsraad council votes, influenced by player actions, might result in Empire-sanctioned faction buffs/debuffs. If playable later, mechanics could include Sardaukar command (NPC support) and broader strategic interaction (off-world travel, CHOAM coordination).`,
        idealPlaystyle: `Currently interacts with players interested in story, politics, and high-level PvE challenges (fighting Sardaukar). Role-players might act as Imperial loyalists. If playable, would attract players preferring authoritative, structured gameplay, large-scale strategy, and enforcement roles, potentially appealing to veteran MMO players or organized guilds seeking to maintain server balance.`,
        comparison: `Corrino is above the Atreides/Harkonnen conflict, acting as referee and ultimate authority. Goal is Imperial supremacy, not direct spice harvesting. Aligned with CHOAM/Guild for stability but has own agenda (preventing challenges to the throne). Contrasts Bene Gesserit's soft power with overt command/force (Sardaukar). Balances between major powers (Landsraad, Guild, CHOAM, BG). Represents the established order and final authority.`
    },
    {
        id: 'landsraad',
        name: 'The Landsraad Council',
        summary: 'The assembly of Great Houses, providing political context and objectives.',
        // No image provided specifically for Landsraad section in the source text
        lore: `The Landsraad is the assembly of all Great Houses, acting as a political parliament under the Emperor. It serves as a check against Imperial power and regulates infighting via laws like kanly (formal feud). In Awakening, it's the political theater where Atreides and Harkonnen compete for legitimacy and support from minor Houses, each holding votes. Devs confirm factions try to win favor by gaining these votes.`,
        role: `Provides context for the regulated Atreides-Harkonnen conflict (War of Assassins) and offers faction-wide objectives. Server-wide competitions might arise (e.g., delivering spice tributes to minor Houses for votes). Accumulating votes influences faction standing. Explains why the conflict remains balanced (fear of Landsraad intervention against rule-breakers). Acts as the political equilibrium backdrop.`,
        gameplay: `Manifests through faction-wide meta objectives and timed events. A Landsraad Council phase might tally faction contributions (spice delivered, contracts completed), conferring temporary buffs/debuffs based on political standing (e.g., better trade prices for favored faction, increased upkeep for sanctioned one). Encourages participation in cooperative PvE tasks for the faction's cause, involving even non-PvP players. Ensures no faction achieves permanent elimination, fitting an ongoing MMO. Seasons or resets might be justified by Landsraad mandates.`,
        idealPlaystyle: `Engages organized guilds, strategic players, crafters, economists, and role-players interested in diplomacy. Provides long-term goals beyond individual progression. Experienced players might min-max contributions or control relevant resource regions.`,
        comparison: `A framework, not a faction. Represents collective noble power/opinion. Contrasts Corrino (enforcement) as influence/persuasion. Interacts with CHOAM/Guild (political pressure vs. economic/logistics). For players, it's a scoreboard for faction pride and a driver for large-scale cooperative efforts.`
    },
    {
        id: 'bene-gesserit-sisterhood',
        name: 'Bene Gesserit Sisterhood',
        summary: 'The secretive order influencing events through manipulation and foresight.',
        // No image provided specifically for BG section in the source text
        lore: `A secretive, ancient order of women trained in superhuman disciplines (prana-bindu, Voice, weirding way) with long-term goals like the Kwisatz Haderach breeding program. In Awakening's timeline, Lady Jessica obeyed the Sisterhood, bearing a daughter (Ariste), which kept the breeding plan on track and allowed her to save Duke Leto by exposing treachery via her Truthsayer training. Their fingerprints are everywhere: Paul Atreides wasn't born, the war unfolds differently, and Fremen disappearance might be linked.`,
        role: `An influential non-playable faction operating via storyline, trainers, and quest-givers. Key BG characters (Mohiam, Jessica) likely influence events. Ariste Atreides' existence is central to their plans. They may plant legends or manipulate religion. Players can choose a BG mentor at creation for the Voice ability. BG sisters might offer advanced training in hubs for skills like Voice or nerve strikes.`,
        gameplay: `Provides stealth and diplomacy layers. May offer missions requiring subtlety (espionage, retrieval) for special rewards (gadgets, training). The Voice ability allows non-lethal approaches. BG NPCs might affect dialogue/reputation based on player actions (discerning truth). Future storylines could involve protecting Ariste or thwarting plots against the breeding program. Their presence adds mysticism and prophecy themes.`,
        idealPlaystyle: `Favors players enjoying intrigue, cunning, lore, finesse over force. Appeals to stealth, charisma, or dialogue-focused players. Role-players can act as informal BG agents. Experienced players can exploit Voice mechanics cleverly. Offers depth beyond straightforward combat.`,
        comparison: `Covert and universal, wielding soft power (influence, espionage) unlike Corrino's hard power. Shares neutrality with Guild but focuses on bloodlines/stability vs. commerce/travel. Manipulates beliefs/people vs. CHOAM manipulating markets. Interaction involves conversation, investigation, moral ambiguity.`
    },
    {
        id: 'choam',
        name: 'CHOAM',
        summary: 'The universal corporation controlling commerce, particularly spice.',
        // No image provided specifically for CHOAM section in the source text
        lore: `Combine Honnete Ober Advancer Mercantiles (CHOAM) is the giant corporation managing all Imperial economic affairs, especially spice distribution. Great Houses, the Emperor, and others hold shares; profits are key to wealth/power. On Arrakis, CHOAM coordinates spice harvesting and sales. They field their own security ("CHOAM heavies"). Driven solely by profit, they work with anyone but turn ruthless if the bottom line is threatened.`,
        role: `Functions as the economic framework. Trading, currency exchange, spice selling fall under CHOAM. The Exchange (auction house) is likely CHOAM-run. Neutral CHOAM trading posts serve as safe zones. Offers missions (convoy escorts, clearing spice fields, cargo recovery). Employs armed personnel (heavies) who enforce peace in trade hubs or act as allies/enemies in missions. Favors factions securing more spice. May run banking systems (CHOAM credits).`,
        gameplay: `Tied to trading, PvE missions, world events. Spice Harvest events might involve turning spice in to CHOAM. Market dynamics (fluctuating spice prices based on supply/demand) could be CHOAM-driven. Issues bounties for disrupting trade routes. CHOAM heavies enforce no-combat zones in trade posts. Involved in endgame Deep Desert spice operations (organizing large-scale harvesting/sales).`,
        idealPlaystyle: `Appeals to economy-focused players, traders, crafters, PvEers. Players can engage via market manipulation, resource optimization, fulfilling CHOAM contracts. Merchant guilds might align implicitly. Pirates/smugglers might target CHOAM operations.`,
        comparison: `Purely profit-motivated, unlike Houses (ideology/politics) or BG (long-term plans). Aligned with Guild for stability/trade but operates planetside markets. Intertwined with Landsraad (shares = political clout) but priorities differ (profit vs. power). Neutral ground provider, unlike faction bases. Represents the business side of the war.`
    },
    {
        id: 'spacing-guild',
        name: 'Spacing Guild',
        summary: 'The monopolistic entity controlling interstellar travel and banking.',
        // No image provided specifically for Guild section in the source text
        lore: `Holds the monopoly on interstellar travel via Guild Navigators using spice for prescience to fold space. Controls all transport between planets. Apolitical, concerned with preserving commerce and spice supply. Extremely powerful due to travel monopoly; can paralyze the empire if angered. Generally operates in shadows.`,
        role: `Mostly off-world presence, defining setting rules (players confined to Arrakis). Operates spaceports (potential fast-travel hubs?). Maintains Guild Banks (currency exchange/storage NPCs). Involved in narrative quests requiring off-world communication or transport negotiation (likely demanding spice payment). Provides premium services (instant material transport via airlift? Orbital surveillance data?).`,
        gameplay: `Enforces Arrakis confinement, raising stakes. Indirectly emphasizes spice importance (needed for off-world economy/travel). Potential mechanic for refining/selling raw spice via Guild facilities. Limits PvP escalation (threat of Guild sanctions against prohibited weapons). Allows future expansion possibility (travel to stations/other worlds). Could provide background services (satellite network for mini-maps?).`,
        idealPlaystyle: `Appeals to big-picture thinkers, lore fans, logistics coordinators. Players focused on trade/supply chains interact indirectly. Role-players could act as neutral Guild bankers/agents. Experienced players might leverage Guild neutrality for truces.`,
        comparison: `Apolitical pillar of power alongside Emperor/Landsraad. Focuses on infrastructure/logistics vs. CHOAM's market focus. Collaborates with CHOAM/BG but unique due to Navigators/spacefolding leverage. Generally not fought directly; appeased and paid. Provides neutral ground like CHOAM. Represents the underlying necessity of spice for the wider universe.`
    },
];

// --- Choosing Faction Text ---
const choosingFactionAdvice = {
    title: "Choosing Your Faction: Advice for New and Veteran Players",
    introduction: `Choosing which faction to align with (at least at launch between Atreides or Harkonnen) is a significant decision that shapes your Dune: Awakening experience. Here are some recommendations based on player type:`,
    newPlayers: `**For New Players:** House Atreides is often the best starter choice. They provide a more forgiving entry with NPC allies, cooperative ethos, and structured quests. The "good guy" narrative and safer zones make learning survival basics easier. You'll face challenges, but likely with more community support.`,
    experiencedPlayers: `**For Experienced or Competitive Players:** House Harkonnen offers depth and challenge. Ideal for veterans seeking adrenaline, cunning strategies, and PvP dominance. The "only the strong survive" environment rewards skill and ruthlessness. Leverage game knowledge to dominate, ambush rivals, and climb the power ladder in a cutthroat political landscape. Expect a steeper curve but high rewards for success.`,
    neutralTraders: `**Neutral/Trade-Focused Players:** Your House choice might matter less than server community. Atreides may offer a calmer environment, but smart traders can operate in either faction using neutral CHOAM/Guild hubs. Consider server population balance. Joining a faction still provides protection and market access.`,
    futureExpansions: `**Future Faction Expansions:** Potential post-launch factions like House Corrino (Imperial) could offer strategic enforcement roles for endgame players. Playable Fremen would likely appeal to hardcore survivalists seeking independence and unique mechanics (worm-riding). These would likely suit experienced players wanting fresh challenges.`,
    personalPref: `**Personal Preference and Lore Alignment:** Ultimately, choose the faction that resonates. Follow your heart based on Dune lore. Both Atreides and Harkonnen offer rich endgame content and conflict. Don't assume Atreides is dull or Harkonnen too hard – play where you'll have fun and stay motivated.`,
    summary: `In summary, every faction and organization contributes to a living Arrakis. Understand their lore and mechanics to thrive. New players should leverage faction support; veterans can aim for leadership. Remember: “The spice must flow” – and your faction journey determines who controls it.`
};


// --- Style Object (Using the same styles as the Class page for consistency) ---
const styles = {
    pageContainer: {
        maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem 4rem',
        color: 'var(--color-text-primary, #e0e0e0)',
        fontFamily: 'var(--font-sans, sans-serif)',
    },
    // Image style
    factionImage: {
        display: 'block', // Or 'inline-block' if needed
        maxWidth: '100%', // Responsive
        height: 'auto',
        borderRadius: 'var(--border-radius-md, 0.5rem)',
        margin: '1rem auto 1.5rem', // Center and add spacing
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        border: '1px solid var(--color-border-alt, #4b5563)',
    } as React.CSSProperties,
    // General Section styles
    section: {
        marginBottom: '2.5rem', padding: '1.5rem',
        backgroundColor: 'var(--color-surface, #1f2937)',
        borderRadius: 'var(--border-radius-lg, 0.75rem)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        border: '1px solid var(--color-border, #374151)',
    } as React.CSSProperties,
    sectionTitle: {
        fontSize: 'clamp(1.6rem, 4vw, 2rem)',
        fontWeight: 700, marginBottom: '1.5rem',
        color: 'var(--color-primary, #f9a825)',
        borderBottom: '1px solid var(--color-border, #374151)', paddingBottom: '0.75rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
    } as React.CSSProperties,
    paragraph: { color: 'var(--color-text-secondary, #b0b0b0)', marginBottom: '1.25rem', lineHeight: 1.7, whiteSpace: 'pre-line' } as React.CSSProperties, // Added pre-line
    strongText: { fontWeight: 600, color: 'var(--color-text-primary, #e0e0e0)' } as React.CSSProperties,
    link: { color: 'var(--color-primary-hover, #fbc02d)', textDecoration: 'underline', textUnderlineOffset: '3px' } as React.CSSProperties,
    // Discord icon styles
    discordIconLink: {
        display: 'inline-block', verticalAlign: 'middle',
        color: 'var(--color-primary, #f9a825)',
        transition: 'color 0.2s ease, transform 0.2s ease',
        fontSize: '1.1em',
    } as React.CSSProperties,
    discordIconLinkHover: {
        color: 'var(--color-primary-hover, #fbc02d)', transform: 'scale(1.1)',
    } as React.CSSProperties,
    discordIcon: {
         width: '1em', height: '1em', display: 'block',
     } as React.CSSProperties,
    // Collapsible Section Styles
    factionSection: { // Renamed from classSection
        marginBottom: '1.5rem',
        border: '1px solid var(--color-border-alt, #4b5563)',
        borderRadius: 'var(--border-radius-md, 0.5rem)',
        backgroundColor: 'var(--color-surface-alt, #273140)',
        overflow: 'hidden',
    } as React.CSSProperties,
    factionHeader: { // Renamed from classHeader
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        backgroundColor: 'var(--color-surface, #1f2937)',
        borderBottom: '1px solid var(--color-border-alt, #4b5563)',
        transition: 'background-color 0.2s ease',
    } as React.CSSProperties,
    factionHeaderHover: { // Renamed from classHeaderHover
        backgroundColor: 'var(--color-surface-hover, #374151)',
    } as React.CSSProperties,
    factionTitle: { // Renamed from classTitle
        fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-primary, #f9a825)', margin: 0,
    } as React.CSSProperties,
    factionSummary: { // Renamed from classSummary
        fontSize: '0.9rem', color: 'var(--color-text-secondary, #b0b0b0)',
        margin: '0.25rem 0 0 0', fontStyle: 'italic',
    } as React.CSSProperties,
    expandIcon: {
        fontSize: '1.2rem', color: 'var(--color-text-secondary, #b0b0b0)',
        transition: 'transform 0.3s ease',
    } as React.CSSProperties,
    expandIconRotated: {
        transform: 'rotate(180deg)',
    } as React.CSSProperties,
    collapsibleContent: {
        maxHeight: '0', opacity: 0, overflow: 'hidden',
        transition: 'max-height 0.5s ease-out, opacity 0.4s ease-in, padding 0.5s ease-out',
        padding: '0 1.25rem',
    } as React.CSSProperties,
    collapsibleContentExpanded: {
        maxHeight: '10000px', // Increased max-height for potentially long text
        opacity: 1, padding: '1.5rem 1.25rem',
        transition: 'max-height 1s ease-in-out, opacity 0.6s ease-in 0.1s, padding 1s ease-in-out', // Slower transition for long content
    } as React.CSSProperties,
    factionContentContainer: {
        backgroundColor: 'var(--color-surface, #1f2937)', // Use the same surface color as other sections
        padding: '1.5rem', // Add padding to the content
        borderRadius: 'var(--border-radius-md, 0.5rem)', // Match the outer container radius
        marginTop: '1rem', // Add some space between the header and content
        border: '1px solid var(--color-border-alt, #4b5563)', // Add a border
    } as React.CSSProperties,
    // Content inside collapsible section
    subHeading: {
        fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-primary, #e0e0e0)',
        marginTop: '1.5rem', marginBottom: '0.75rem',
        borderBottom: '1px dashed var(--color-border-alt, #4b5563)', paddingBottom: '0.4rem',
    } as React.CSSProperties,
     // Specific style for the choice advice section
     choiceAdviceParagraph: {
        color: 'var(--color-text-secondary, #b0b0b0)',
        marginBottom: '1rem',
        lineHeight: 1.7,
        whiteSpace: 'pre-line',
     } as React.CSSProperties,
     choiceAdviceHeading: { // Style for the sub-points like "For New Players"
         fontWeight: 700,
         color: 'var(--color-text-primary, #e0e0e0)',
         display: 'block', // Ensure it takes its own line
         marginBottom: '0.25rem',
     } as React.CSSProperties,
};

// --- Main Component ---
export default function DuneFactionsPage() {
    const discordServerLink = "https://discord.gg/gptdune";
    const [expandedFactions, setExpandedFactions] = useState<Record<string, boolean>>({});
    const [discordIconHover, setDiscordIconHover] = useState(false);
    const [hoveredFaction, setHoveredFaction] = useState<string | null>(null);

    const toggleFactionExpansion = (factionId: string) => {
        setExpandedFactions(prev => ({
            ...prev,
            [factionId]: !prev[factionId]
        }));
    };

    const discordIconFinalStyle = {
        ...styles.discordIconLink,
        ...(discordIconHover ? styles.discordIconLinkHover : {})
    };

    // Helper function to render paragraphs respecting newlines and emphasizing bold text
    const renderParagraph = (text: string | undefined) => {
        if (!text) return null;
        // Split text into parts based on markdown-like bold syntax (**text**)
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return (
            <p style={styles.paragraph}>
                {parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        // Render bold text
                        return <strong key={index} style={styles.strongText}>{part.slice(2, -2)}</strong>;
                    }
                    // Render normal text
                    return part;
                })}
            </p>
        );
    };
     // Helper function for choice advice rendering
    const renderChoiceAdvice = (text: string) => {
        // Split specifically for the advice section format
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return (
             <p style={styles.choiceAdviceParagraph}>
                 {parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        // Render bold text as a heading-like element
                        return <span key={index} style={styles.choiceAdviceHeading}>{part.slice(2, -2)}</span>;
                    }
                     // Render normal text, preserving spaces around the bold part
                     // Check if the previous part was bold to add a space if needed
                    const needsLeadingSpace = index > 0 && parts[index - 1].startsWith('**');
                    return (needsLeadingSpace ? ' ' : '') + part;
                 })}
             </p>
        );
    };

    return (
        <div style={styles.pageContainer}>

            {/* Introduction Section */}
            <section style={styles.section}>
                <h1 style={styles.sectionTitle}>
                    Factions of Dune: Awakening
                </h1>
                 <p style={styles.paragraph}>
                     Dune: Awakening is set in an alternate Dune timeline, creating a unique political landscape on Arrakis. In this MMO survival game, players rise from stranded nobodies to power-brokers amid warring factions. Two Great Houses – House Atreides and House Harkonnen – are confirmed playable factions locked in conflict.
                 </p>
                 <p style={styles.paragraph}>
                     Beyond these, several influential organizations shape the struggle for Spice and power, even if they aren’t directly playable. Below is an in-depth look at each major faction, covering their lore background, role in the game’s setting, gameplay mechanics (where applicable), ideal playstyles, and comparisons. Click on a faction to expand its details.
                  </p>
            </section>

            {/* Faction Sections */}
            {duneFactions.map((faction) => {
                const isExpanded = !!expandedFactions[faction.id];
                const isHovered = hoveredFaction === faction.id;

                return (
                    <div key={faction.id} style={styles.factionSection}>
                        <div
                            style={{ ...styles.factionHeader, ...(isHovered ? styles.factionHeaderHover : {}) }}
                            onClick={() => toggleFactionExpansion(faction.id)}
                            onMouseEnter={() => setHoveredFaction(faction.id)}
                            onMouseLeave={() => setHoveredFaction(null)}
                            role="button" aria-expanded={isExpanded} aria-controls={`content-${faction.id}`}
                            tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFactionExpansion(faction.id)}
                        >
                            <div>
                                <h2 style={styles.factionTitle}>{faction.name}</h2>
                                <p style={styles.factionSummary}>{faction.summary}</p>
                            </div>
                            {isExpanded
                                ? <FaChevronUp style={{...styles.expandIcon, ...styles.expandIconRotated}} aria-label="Collapse section"/>
                                : <FaChevronDown style={styles.expandIcon} aria-label="Expand section"/>
                            }
                        </div>
                        <div
                            id={`content-${faction.id}`}
                            style={{ ...styles.collapsibleContent, ...(isExpanded ? styles.collapsibleContentExpanded : {}) }}
                        >
                            {/* Add the new container div */}
                            <div style={styles.factionContentContainer}>
                                {faction.imageUrl && (
                                    <Image
                                        src={faction.imageUrl}
                                        alt={`${faction.name} illustrative image`}
                                        width={600} // Provide appropriate default width
                                        height={338} // Provide appropriate default height (16:9 ratio example)
                                        style={styles.factionImage}
                                        priority={faction.id === 'atreides' || faction.id === 'harkonnen'} // Prioritize loading images for main factions
                                        unoptimized={faction.imageUrl.startsWith('/')} // Consider if using external URLs later
                                    />
                                )}
                                <h3 style={styles.subHeading}>Lore & Background</h3>
                                {renderParagraph(faction.lore)}

                                <h3 style={styles.subHeading}>Role in the Game</h3>
                                {renderParagraph(faction.role)}

                                <h3 style={styles.subHeading}>Gameplay Implications</h3>
                                {renderParagraph(faction.gameplay)}

                                <h3 style={styles.subHeading}>Ideal Playstyle</h3>
                                {renderParagraph(faction.idealPlaystyle)}

                                {faction.comparison && (<><h3 style={styles.subHeading}>Comparison</h3>{renderParagraph(faction.comparison)}</>)}
                            </div>
                        </div>
                    </div>
                );
            })}

             {/* Choosing Faction Advice Section */}
            <section style={styles.section}>
                 <h2 style={styles.sectionTitle}>{choosingFactionAdvice.title}</h2>
                 <p style={styles.paragraph}>{choosingFactionAdvice.introduction}</p>
                 {renderChoiceAdvice(choosingFactionAdvice.newPlayers)}
                 {renderChoiceAdvice(choosingFactionAdvice.experiencedPlayers)}
                 {renderChoiceAdvice(choosingFactionAdvice.neutralTraders)}
                 {renderChoiceAdvice(choosingFactionAdvice.futureExpansions)}
                 {renderChoiceAdvice(choosingFactionAdvice.personalPref)}
                 <p style={{...styles.paragraph, marginTop: '1.5rem'}}>{choosingFactionAdvice.summary}</p>
            </section>

            {/* Final Tips Section (If applicable, maybe redundant now) */}
            {/*
            <section style={styles.section}>
                 <h2 style={{...styles.sectionTitle, fontSize: '1.5rem'}}>Final Tips & Adaptability</h2>
                 <p style={styles.paragraph}>
                     All classes in Dune: Awakening share one important feature... (Keep the finalTips constant content if desired)
                  </p>
            </section>
            */}


        </div> // End pageContainer
    );
}