// src/app/(main)/dune-awakening/worldpvp/page.tsx
"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaDiscord } from 'react-icons/fa';
// Removed Image import as no specific images were provided for sections here

// --- Data Structure ---
interface SectionData {
    id: string;
    title: string;
    summary: string;
    content: string;
}

// --- Structured Content ---
const introText = `
Dune: Awakening is set in an alternate Dune timeline, creating a unique political landscape on Arrakis. In this MMO survival game, players rise from stranded nobodies to power-brokers amid warring factions. Two Great Houses – House Atreides and House Harkonnen – are confirmed playable factions locked in conflict. Beyond these, several influential organizations shape the struggle for Spice and power, even if they aren’t directly playable.

This page provides a comprehensive breakdown of Dune: Awakening’s combat systems and open-world PvP, including mechanics, zones, gear, roles, balancing, environmental effects, the role of spice, and insights from developers and early previews. Click on a section below to expand its details.
`;

const pvpSections: SectionData[] = [
    {
        id: 'combat-mechanics',
        title: 'Combat Mechanics on Arrakis',
        summary: 'Action-based melee/ranged combat, shield interactions, abilities, and resource management.',
        content: `Dune: Awakening’s combat is **action-based** with a blend of melee and ranged fighting, plus special abilities. It strives to feel “Herbertian” – reflecting Dune’s lore in gameplay. Key combat elements include:

        - **Melee Combat and Shields:** Melee fights revolve around timing and proper weapon use. The game uses a **parry and block system** (though not directional or Souls-like pacing). Notably, personal **Holtzman shields** play a huge role. Fast attacks and bullets *cannot* penetrate shields, but slow, deliberate strikes can – the classic Dune “slow blade penetrates the shield” rule applies. Players (and NPCs like CHOAM mercenaries) with shields are almost invulnerable to regular gunfire; you must use a **“slow-blade” plunge attack** in melee or a specialized **disruptor firearm** designed to counter shields. This creates a tactical dance: if an enemy’s shield is up, switch to a slower melee approach or specific tech. A heavy slow attack can disable the shield, opening the target to damage. Rapid attacks or dart rounds simply “ping” off shields harmlessly. Shields **don’t gradually wear down from normal hits** – only the proper counter works. Shields have limits: high total damage can temporarily overload them, and they regenerate after downtime. Using a shield risks attracting sandworms due to vibrations.

        - **Ranged Weapons and Gunplay:** Firearms range from improvised pistols to advanced guns (maula pistol, possibly lasguns/dart guns). Gunplay is described as **“weighty and impactful,”** with headshots dealing significant damage. Effective early on is **stealth** + headshots. Against shielded enemies, conventional guns are useless unless the shield is down. This forces tactical decisions when facing **mixed enemies** (e.g., ranged shooters + shielded melee charger). Prioritizing targets and **weapon swapping** is key. Gunplay feels good, but some NPCs might be “bullet sponges” without critical hits. **Ammo and resource management** are crucial (crafting/finding ammo, weapon maintenance).

        - **Abilities and Skills:** Players gain **active abilities and passive perks** via skill development. Archetypes (Bene Gesserit, Trooper, Mentat, Swordmaster) provide unique starting abilities. Examples: Bene Gesserit **“compel”** (mind-control pull/stun), brief **invisibility**. Abilities help manage outnumbered situations. Skills are **unlocked via XP** and talent trees, with steady progression. Players can **slot different abilities/passives** (loadouts). Crucially, you **aren't locked to your initial class** and can **mix and match** skills from other archetypes later, allowing flexible builds.

        - **Resource Management in Combat:** Survival requires managing extra resources: **Stamina** (sprinting, dodging, heavy attacks), **Health** (red bar), **Water/Hydration** (blue bar - dehydration weakens/kills), and **Energy/Fuel** (yellow bar - powers shields/gadgets). Wearing heavy armor in heat increases water loss, forcing a trade-off between defense (armor) and survival (stillsuit). Combat demands balancing offense, defense, and survival resources. Preparedness (water, ammo, charged shields) is vital.

        - **Vehicles in Combat:** Ground cars and ornithopters can be used. **Air-to-air ornithopter combat** is confirmed. Ground vehicles might mount weapons or offer mobility. Combined arms gameplay is suggested. Fighting over spice fields in armored harvesters or strafing runs are plausible. Transport progresses from foot -> ground -> air.

        Combat is **actively being refined**, with recent overhauls based on beta feedback. Melee impact/parry timing were noted as areas needing polish, which Funcom acknowledged.
        `
    },
    {
        id: 'pvp-systems',
        title: 'Open-World PvP Systems',
        summary: 'Zone-based, opt-in PvP focused on resource conflict, with safe zones and high-risk areas.',
        content: `Open-world PvP is **zone-based and entirely opt-in**. The world is divided into areas with different rules, focusing PvP on meaningful objectives (resources) and reducing griefing.

        - **Safe Zones vs PvP Zones:**
          - **Hagga Basin (Starting Area):** Largely **PvE safe zone**. Players cannot attack each other in most areas. Allows safe exploration/questing/building. Some limited PvP pockets exist (e.g., **shipwreck sites**) with warnings (*entering a “Kanly War of Assassins”*). Step out to remain safe.
          - **Deep Desert:** Mostly **PvP zone** beyond the Shield Wall. Designed for PvP battles and competition over endgame resources. Entering is opting into PvP. A small southern strip is PvE-only.
          - **Social Hubs (Arrakeen, Harko Village):** Entirely **non-combat zones** for meeting, trading, questing, and faction interaction. Faction enclaves within hubs are also safe.
        This creates a gradual escalation from safe starting zones to riskier PvP areas.

        - **Opt-In PvP and Progression:** PvP is **optional and not forced for progression**. Players can focus on PvE (harvesting, crafting, base-building) and still advance. Hagga Basin offers hours of PvE gameplay. However, **avoiding PvP makes endgame progression slower**, as high-end resources (especially spice) are more abundant in PvP areas. PvE players gather these *“at a much slower rate.”*
        - **Base Raiding:** Effectively opt-in. Bases in the **starting map are largely safe**. In the **Deep Desert**, bases are protected by a **Sub-fief Console shield**. Raids are only possible if the shield is **intentionally disabled or power expires**. You decide vulnerability. Rare events (mega sandstorms) might temporarily disable shields, timed to avoid offline griefing. The focus is on **world conflict over resources, not base destruction**. Devs: *“We don’t want to attract the people that want to just kick over your sandcastle.”*

        - **High-Risk PvP in the Deep Desert:** Designed for **“high-risk high-reward”** gameplay. Players should *“only take what you want to risk”* losing. Death has more severe consequences (see Loot). The terrain **shifts weekly** due to Coriolis storms (the **“Shifting Sands”** mechanic), wiping structures and scrambling resource locations. This creates a cyclical PvP loop: weekly races to establish forward bases and contest resources, preventing permanent domination. PvP areas use the lore term **“Kanly”** (sanctioned feud) for context. Retreating to a PvE zone border ceases hostilities.

        - **Loot and Death Consequences:** **Not a full-loot game by default**. Upon death, players drop a **percentage of carried resources**, *all* carried **spice**, and all **currency (Solaris)**. **Normally, other players cannot loot these dropped items** (they are lost/scattered). The penalty hits the defeated without directly enriching the victor's gear. Equipped gear likely stays or is recoverable. The focus is fighting over objectives (spice), not killing for loot.
          - **Exceptions:** The **Landsraad** can enact temporary server rules like **“Right of Salvage,” enabling full loot** for a period. **Shipwreck sites** (PvP events even in PvE zones) operate under salvage rules, likely allowing looting.
          - **PvE/Environmental Deaths:** Likely involve resource loss but no player looting. Worms might destroy some gear.

        - **Faction Mechanics (Kanly Warfare):** Players typically align with **House Atreides** or **House Harkonnen**. PvP often occurs along these faction lines (proxy wars). Gameplay likely restricts friendly fire within factions in open PvP. **Guilds** and player-created **Minor Houses** coordinate for territory/spice, adding large-scale strategy. The **Landsraad** system provides faction-wide objectives. PvP has purpose within the lore (feuds over resources/honor).

        - **Structured PvP vs Open PvP:** Blends both.
          - **Open PvP:** Organic, player-driven fights in PvP zones (ambushes, skirmishes).
          - **Structured PvP (Open World Events):**
            - **Spice Blow Events:** Periodic geysers of spice create hotspots for resource rushes and conflict. Focuses PvP on a clear objective.
            - **Crashed Ships/Dungeons:** Some PvE locations become PvP-enabled (Shipwrecks under salvage law, contested dungeons). PvPvE scenarios.
            - **Landsraad Politics (Meta-PvP):** Endgame system where guilds/Minor Houses compete through influence, voting on server-wide policies (e.g., enabling full loot, granting faction buffs). Adds strategic layer beyond direct combat. Inspired by *“Bingo Brawlers”* (diverse objectives contributing to competition).
        This blend provides purpose and breaks monotony. Early reactions are positive regarding opt-in nature and resource focus.
        `
    },
    {
        id: 'gear-impact',
        title: 'Gear, Equipment, and PvP Impact',
        summary: 'Situational gear advantages, shield counters, tech levels, and crafting influence.',
        content: `Gear plays a huge role, but emphasizes situational counters over raw tier.

        - **Weapons:** Wide arsenal (knives, swords, pistols, rifles, potentially lasguns/disruptors).
          - **Melee:** Requires timing/skill. **“Slow blade”** needed to penetrate shields. Swordmaster archetype specializes here.
          - **Ranged:** Firearms like maula pistols effective against unshielded targets. **Disruptors** specifically counter shields. Lasguns likely powerful but cannot hit active shields (no lore explosion).
          - **Switching:** Adapting weapon choice (melee vs ranged, shield counter vs standard) based on opponent's gear is crucial.
          - **Rarity/Crafting:** Weapons have rarities. Unique schematics (e.g., for a lasgun) might drop with limited uses, making top-tier weapons rare and valuable. Controlling resources for blueprints is strategic.
          - **Ammo:** Required for guns, must be crafted/found. Adds resource management layer.

        - **Armor and Attire:** Affects protection and survival stats.
          - **Trade-offs:** Heavy combat armor offers protection but causes overheating/dehydration in heat. Stillsuits conserve water but offer less protection. Gear choice depends on environment and activity.
          - **Shields:** Personal Holtzman shield belts provide near-immunity to fast attacks but require energy management and attract sandworms. PvP often revolves around shield presence/absence and landing slow counters. Shields regenerate after downtime.
          - **Counters:** Slow blades, disruptors, possibly shaped charges or specific explosives might bypass/overwhelm shields.

        - **Unique & High-Tech Gear:** Late-game introduces exotic options.
          - **Lasguns:** Potentially high damage vs unshielded, ineffective vs shielded.
          - **Gadgets:** Thumpers (worm manipulation), deployable shields, traps, spice stimulants offer tactical advantages.
          - **Vehicles:** Armed ornithopters (air-to-air combat confirmed) and ground vehicles add layers. Require specific counters (turrets?).

        - **Gear Progression and Crafting:** Unlock recipes via tech trees. Early gear is scavenged, late gear needs rare materials (often from PvP zones). Controlling resources = better gear. Limited-use schematics prevent mass production of OP items. Equipment requires upkeep (repairs, base taxes using spice).

        **Overall Impact:** Skill and preparedness often trump raw gear. Using appropriate gear counters is key. A well-equipped player has an advantage, but tactics and environment can overcome it. The game aims for **“sharpened edge” survival combat**, balancing fun and fairness (e.g., no shield-lasgun nukes). Balancing is ongoing. Controlling resources strategically leads to better gear, driving conflict.
        `
    },
    {
        id: 'player-roles',
        title: 'Player Roles and Build Flexibility',
        summary: 'Archetype-based starts (Bene Gesserit, Trooper, Mentat, Swordmaster) with flexible skill mixing.',
        content: `No rigid classes; offers **archetypes** with flexible progression.

        - **Archetypes (Starting Classes):** Define initial skills/playstyle.
          - **Bene Gesserit:** Manipulation, psychic abilities, crowd control (compel, stun, invisibility), debuffs. Support/assassin role.
          - **Trooper:** Combat soldier, conventional weapons, durability, explosives. Straightforward DPS/tank mix.
          - **Mentat:** Recon, intelligence, strategy. Scanning, marking targets, buffs, gadgets (drones?). Scout/support role.
          - **Swordmaster:** Melee specialist. Dashing, parrying, high melee damage, shield counters. Agile fighter.

        - **No Class Lock:** Players are **not tied to their first specialty**. Can **mix and match** skills learned from different archetypes later.

        - **Skill Trees and Progression:** Earn **skill points** (via XP) for talent trees and **Tech points** (via discovery/crafting) for recipes. Skill acquisition feels reasonably paced early on. Max progression likely long-term, possibly skill-based rather than level-capped.

        - **Loadouts and Build Customization:** Equip a selection of learned active/passive abilities. Can tailor loadouts for specific situations (PvP event vs solo exploration). Allows **“wild combinations”** and adaptation. No permanent role lock during gameplay. Respec system likely or sufficient points to learn widely.

        - **Player Roles in Group PvP:** Can form classic compositions (tanky Trooper, melee Swordmaster, CC Bene Gesserit, recon Mentat). No dedicated healer; survival relies on self-management (dodging, cover, items). Support focuses on control/buffs.

        - **Progression Beyond Combat:** Includes **Major Faction progression** (Atreides/Harkonnen ranks) and **Landsraad political progression** (forming Minor Houses). Endgame shifts towards **political survival**. Roles like diplomat or schemer emerge.

        - **Solo vs Group Flexibility:** Game supports both. Solos might build self-sufficient characters. Groups can specialize roles. Co-op building system. Flexibility allows adapting role based on context.

        **Summary:** Roles are fluid. Start with an archetype identity, then customize through skills/gear. Build creativity encouraged. Fulfills Dune power fantasies (fighter, mastermind). Expect community theorycrafting on synergies. Devs are polishing skills, especially melee.
        `
    },
    {
        id: 'balancing-fairness',
        title: 'Balancing and PvP Fairness',
        summary: 'Optional PvP zones, anti-griefing measures, risk-reward systems, and ongoing iteration.',
        content: `Funcom aims for fair, enjoyable competition, welcoming PvP newcomers and satisfying veterans.

        - **Optional PvP:** Zone-based system protects new players in PvE areas (Hagga Basin). No forced PvP for progression. Lowers entry barrier. PvP engagement is generally consensual (entering PvP zones).

        - **Matchmaking by Environment:** World design naturally separates power levels. Hagga Basin instances (~40 players) mix levels safely. Deep Desert network (500-900 players) attracts experienced players. Environmental difficulty (worms, heat) gates low-level players from Deep Desert prematurely.

        - **High Risk = High Reward:** Riskier actions (PvP zones, carrying spice) offer greater rewards but higher potential loss. Safer play yields slower, steady gains. Balances economy/progression. Endgame power tied to PvP participation over spice. Upkeep costs (taxes, spice addiction) act as wealth sinks.

        - **Anti-Griefing Measures:**
          - **Base Shields:** Prevent uninvited raids unless shields are down (player choice or rare event). Discourages offline griefing.
          - **No Full Loot by Default:** Dying drops resources/spice but not equipped gear normally. Reduces discouragement. Full loot reserved for special opt-in rules (Landsraad vote).
          - **Safe Social Hubs:** Allow safe interaction, trade, community building (Arrakeen).
          - **Scaling/Level Advantage:** Likely no hard scaling. Higher levels have advantages, but environment (worms) and skill counters provide balance.
          - **Continuous Iteration:** Devs committed to monitoring feedback and balancing post-launch (QoL, tweaks).

        - **Group vs Solo Balance:** Game supports both. Groups have coordination advantages. Solo players can use environment (worms) or stealth. Weekly map reset mitigates permanent dominance by large groups.

        - **Economy Balancing:** Spice as upkeep prevents infinite accumulation. Landsraad policies can introduce temporary buffs/debuffs, potentially favoring underdogs or rewarding performance, creating push-pull dynamics.

        - **Combat Balancing:** Ongoing process for abilities/weapons. Aware of melee feedback. PvP damage might be tuned separately. Deliberate lore adjustments for balance (no shield-lasgun nukes, vehicle shield interactions limited).

        **Overall:** Fairness addressed by design (zones, loot rules, anti-griefing). Aims for purposeful conflict. Structure inherently balances risk/reward. Balancing is iterative. Goal is political survival endgame, suggesting self-correcting power dynamics.
        `
    },
    {
        id: 'environmental-hazards',
        title: 'Environmental Hazards and Combat Effects',
        summary: 'Sandworms, sandstorms, and climate impact survival and combat tactics.',
        content: `Arrakis itself is an antagonist, affecting combat and PvP.

        - **Sandworms (Shai-Hulud):** "Largely unavoidable" threat in open desert, attracted by rhythmic vibrations (movement, shields). Act as world-balancing force. Can destroy players, groups, vehicles, structures instantly (effective instant death/destruction). Cannot be killed or ridden at launch.
          - **Combat Impact:** Interrupts fights on open sand. Can be used tactically (luring enemies, thumpers). Personal shields attract them faster, forcing tactical decisions (disable shield vs risk worm). Encourages fighting near/on rock. Forces careful base placement. Creates risk/reward in travel routes. A natural "third party" in PvP.

        - **Sandstorms (Coriolis Storms):**
          - **World Reshaping:** Massive weekly storms reshape the Deep Desert, resetting structures, scrambling resources ("Shifting Sands"). Provides "infinite exploration," prevents stagnation, balances territory control.
          - **Combat Impact:** Creates low visibility, high danger (damage, getting lost). Can enable escapes or ambushes. May ground vehicles. Forces pauses or tactical shifts.
          - **Base Impact:** Powerful storms can temporarily disable base shields via static charge (rare, timed events). Creates raid opportunities during chaos.

        - **Extreme Climate (Heat & Sun):** Brutal heat affects survival.
          - **Sunstroke:** Prolonged sun exposure causes debuffs (reduced stamina/health?). Requires protection or skills.
          - **Tactics:** Staying in shadows conserves resources. Luring heavily armored foes into sun can weaken them. Time of day matters.
          - **Water Management:** Crucial for combat endurance. Dehydration imposes penalties. Stillsuits help but reduce armor. Outlasting thirsty opponents is viable.
        `
    },
    {
        id: 'spice-role',
        title: 'Spice: The Ultimate Resource and Combat Wildcard',
        summary: 'Spice fuels the economy, powers abilities, causes addiction, and drives conflict.',
        content: `Spice Melange is central to gameplay.

        - **Economic Driver:** Most coveted resource for crafting, trade, and **Imperial taxes** for land upkeep. PvP centers on **spice blows** (resource hotspots). Dying causes **loss of all carried spice**.
        - **Combat Enhancement:** Consuming spice (via items) grants short bursts of **prescient abilities** ("see a little into the future"), improving reactions or foresight. Spice saturation can alter abilities uniquely.
        - **Addiction & Penalties:** Spice use is **addictive**. Lack of spice leads to **withdrawal penalties** (blurred vision, weakened stats). Heavy use causes **hallucinatory visions**.
        - **Gameplay Loop:** Spice empowers combat (**PvE & PvP**) but creates dependence, requiring constant acquisition (often via PvP) to maintain power and avoid crashes. Fuels the cycle of conflict and progression. Controlling spice = controlling power.
        `
    },
];

// Choosing Faction Advice (copied from previous response, ensure it's up-to-date)
const choosingFactionAdvice = {
    // ... (Keep the choosingFactionAdvice object from the previous response)
    title: "Choosing Your Faction: Advice for New and Veteran Players",
    introduction: `Choosing which faction to align with (at least at launch between Atreides or Harkonnen) is a significant decision that shapes your Dune: Awakening experience. Here are some recommendations based on player type:`,
    newPlayers: `**For New Players:** House Atreides is often the best starter choice. They provide a more forgiving entry with NPC allies, cooperative ethos, and structured quests. The "good guy" narrative and safer zones make learning survival basics easier. You'll face challenges, but likely with more community support.`,
    experiencedPlayers: `**For Experienced or Competitive Players:** House Harkonnen offers depth and challenge. Ideal for veterans seeking adrenaline, cunning strategies, and PvP dominance. The "only the strong survive" environment rewards skill and ruthlessness. Leverage game knowledge to dominate, ambush rivals, and climb the power ladder in a cutthroat political landscape. Expect a steeper curve but high rewards for success.`,
    neutralTraders: `**Neutral/Trade-Focused Players:** Your House choice might matter less than server community. Atreides may offer a calmer environment, but smart traders can operate in either faction using neutral CHOAM/Guild hubs. Consider server population balance. Joining a faction still provides protection and market access.`,
    futureExpansions: `**Future Faction Expansions:** Potential post-launch factions like House Corrino (Imperial) could offer strategic enforcement roles for endgame players. Playable Fremen would likely appeal to hardcore survivalists seeking independence and unique mechanics (worm-riding). These would likely suit experienced players wanting fresh challenges.`,
    personalPref: `**Personal Preference and Lore Alignment:** Ultimately, choose the faction that resonates. Follow your heart based on Dune lore. Both Atreides and Harkonnen offer rich endgame content and conflict. Don't assume Atreides is dull or Harkonnen too hard – play where you'll have fun and stay motivated.`,
    summary: `In summary, every faction and organization contributes to a living Arrakis. Understand their lore and mechanics to thrive. New players should leverage faction support; veterans can aim for leadership. Remember: “The spice must flow” – and your faction journey determines who controls it.`
};

// Final summary text
const finalText = `By understanding the mechanics of combat, the rules of engagement in different zones, the impact of gear and environment, and the flexibility of player roles, you'll be better prepared to navigate the deadly beauty of Arrakis. Whether engaging in calculated Kanly duels, scrambling for spice under the watch of Shai-Hulud, or maneuvering through the Landsraad's political landscape, Dune: Awakening promises a deep and evolving PvP experience steeped in the iconic lore.`

// --- Style Object (Use styles from Factions page) ---
const styles = {
    pageContainer: {
        maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem 4rem',
        color: 'var(--color-text-primary, #e0e0e0)',
        fontFamily: 'var(--font-sans, sans-serif)',
    },
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
    paragraph: { color: 'var(--color-text-secondary, #b0b0b0)', marginBottom: '1.25rem', lineHeight: 1.7, whiteSpace: 'pre-line' } as React.CSSProperties,
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
    pvpSection: { // Renamed for clarity
        marginBottom: '1.5rem',
        border: '1px solid var(--color-border-alt, #4b5563)',
        borderRadius: 'var(--border-radius-md, 0.5rem)',
        backgroundColor: 'var(--color-surface-alt, #273140)',
        overflow: 'hidden',
    } as React.CSSProperties,
    pvpHeader: { // Renamed for clarity
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        backgroundColor: 'var(--color-surface, #1f2937)',
        borderBottom: '1px solid var(--color-border-alt, #4b5563)',
        transition: 'background-color 0.2s ease',
    } as React.CSSProperties,
    pvpHeaderHover: { // Renamed for clarity
        backgroundColor: 'var(--color-surface-hover, #374151)',
    } as React.CSSProperties,
    pvpTitle: { // Renamed for clarity
        fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-primary, #f9a825)', margin: 0,
    } as React.CSSProperties,
    pvpSummary: { // Renamed for clarity
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
        maxHeight: '15000px', // Increased further
        opacity: 1, padding: '1.5rem 1.25rem',
        transition: 'max-height 1.2s ease-in-out, opacity 0.7s ease-in 0.1s, padding 1.2s ease-in-out', // Slower transition
    } as React.CSSProperties,
    // Content inside collapsible section
    subHeading: { // Re-add if needed inside content rendering
        fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-primary, #e0e0e0)',
        marginTop: '1.5rem', marginBottom: '0.75rem',
        borderBottom: '1px dashed var(--color-border-alt, #4b5563)', paddingBottom: '0.4rem',
    } as React.CSSProperties,
    // List style for bullet points if needed within content
     contentList: {
        listStyleType: 'disc', // Use disc for standard bullets
        listStylePosition: 'outside',
        paddingLeft: '1.75rem', // Indent lists
        marginBottom: '1.25rem',
        color: 'var(--color-text-secondary, #b0b0b0)',
     } as React.CSSProperties,
     listItem: { // Style for list items
         marginBottom: '0.6rem',
         lineHeight: 1.6,
     } as React.CSSProperties,
};

// --- Main Component ---
export default function WorldPvPPage() {
    const discordServerLink = "https://discord.gg/gptdune";
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [discordIconHover, setDiscordIconHover] = useState(false);
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    const toggleSectionExpansion = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const discordIconFinalStyle = {
        ...styles.discordIconLink,
        ...(discordIconHover ? styles.discordIconLinkHover : {})
    };

    // Helper to render paragraphs respecting newlines and bold tags
    const renderParagraphWithBoldAndLists = (text: string | undefined) => {
        if (!text) return null;

        // Split into paragraphs first by double newline
        const paragraphs = text.trim().split(/\n\s*\n/);

        return paragraphs.map((para, pIndex) => {
             // Check if paragraph looks like a list item (starts with - or *)
            if (para.trim().startsWith('- ') || para.trim().startsWith('* ')) {
                 // Render as a list item - needs context of being inside a <ul>
                 // We'll handle lists more directly if needed, this is basic
                 const listItemContent = para.trim().substring(2); // Remove "- " or "* "
                 const parts = listItemContent.split(/(\*\*.*?\*\*)/g);
                 return (
                     <li key={`p${pIndex}-li`} style={styles.listItem}>
                          {parts.map((part, index) =>
                                part.startsWith('**') && part.endsWith('**')
                                ? <strong key={index} style={styles.strongText}>{part.slice(2, -2)}</strong>
                                : part
                           )}
                     </li>
                 );

            } else {
                // Render as a standard paragraph
                const parts = para.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={`p${pIndex}`} style={styles.paragraph}>
                        {parts.map((part, index) =>
                            part.startsWith('**') && part.endsWith('**')
                            ? <strong key={index} style={styles.strongText}>{part.slice(2, -2)}</strong>
                            : part
                        )}
                    </p>
                );
            }
        });
    };


    return (
        <div style={styles.pageContainer}>

            {/* Introduction Section */}
            <section style={styles.section}>
                <h1 style={styles.sectionTitle}>
                    World PvP & Combat Guide  
                </h1>
                 {renderParagraphWithBoldAndLists(introText)}
            </section>

            {/* PvP Sections */}
            {pvpSections.map((section) => {
                const isExpanded = !!expandedSections[section.id];
                const isHovered = hoveredSection === section.id;

                return (
                    <div key={section.id} style={styles.pvpSection}>
                        <div
                            style={{ ...styles.pvpHeader, ...(isHovered ? styles.pvpHeaderHover : {}) }}
                            onClick={() => toggleSectionExpansion(section.id)}
                            onMouseEnter={() => setHoveredSection(section.id)}
                            onMouseLeave={() => setHoveredSection(null)}
                            role="button" aria-expanded={isExpanded} aria-controls={`content-${section.id}`}
                            tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSectionExpansion(section.id)}
                        >
                            <div>
                                <h2 style={styles.pvpTitle}>{section.title}</h2>
                                <p style={styles.pvpSummary}>{section.summary}</p>
                            </div>
                            {isExpanded
                                ? <FaChevronUp style={{...styles.expandIcon, ...styles.expandIconRotated}} aria-label="Collapse section"/>
                                : <FaChevronDown style={styles.expandIcon} aria-label="Expand section"/>
                            }
                        </div>
                        <div
                            id={`content-${section.id}`}
                            style={{ ...styles.collapsibleContent, ...(isExpanded ? styles.collapsibleContentExpanded : {}) }}
                        >
                            {/* Render the content, processing paragraphs, lists, and bold text */}
                            {renderParagraphWithBoldAndLists(section.content)}
                        </div>
                    </div>
                );
            })}

            {/* Final Text Section */}
            <section style={{...styles.section, marginTop: '3rem'}}>
                 <h2 style={{...styles.sectionTitle, fontSize: '1.5rem', borderBottom: 'none'}}>Conclusion</h2>
                 {renderParagraphWithBoldAndLists(finalText)}
            </section>


        </div> // End pageContainer
    );
}