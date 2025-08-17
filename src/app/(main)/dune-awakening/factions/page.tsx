// src/app/(main)/factions/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './FactionsPage.module.css';

// --- Faction Type ---
interface Faction {
  id: string;
  name: string;
  summary: string;
  imageUrl?: string;
  lore: string;
  role: string;
  gameplay: string;
  idealPlaystyle: string;
  comparison?: string;
}

// --- Faction Data ---
const duneFactions: Faction[] = [
  {
    id: 'atreides',
    name: 'House Atreides',
    summary: 'The noble house valuing honor, loyalty, and justice.',
    imageUrl: '', // Add image path if available
    lore: `House Atreides is renowned across the Imperium for its moral integrity, leadership, and just rule. Descended from ancient Greek nobility, the Atreides are beloved by their subjects for treating people with dignity and respect. On Arrakis, their code of honor and alliance with the Fremen mark them as champions of the oppressed, fighting against tyranny and corruption.`,
    role: `In Dune: Awakening, House Atreides is one of two main player-alignable factions, serving as a bastion of hope and order on Arrakis. They enforce justice, mediate disputes, and inspire loyalty, striving to create a better world while resisting Harkonnen brutality.`,
    gameplay: `Choosing Atreides grants access to unique faction rewards such as ceremonial uniforms, banners, and advanced desert survival tools. Atreides players are known for their balanced approach, with bonuses to diplomacy, defense, and alliance-building. Faction missions emphasize negotiation, territory control, and assisting settlements.`,
    idealPlaystyle: `House Atreides is well-suited for players who enjoy a heroic or diplomatic playstyle, working together to overcome adversity, build alliances, and outmaneuver enemies through strategy and collaboration.`,
    comparison: `**Atreides vs. Harkonnen:** Atreides favor honorable tactics, teamwork, and long-term planning, while Harkonnen excel in ruthless aggression and subterfuge.`,
  },
  {
    id: 'harkonnen',
    name: 'House Harkonnen',
    summary: 'The brutal house driven by ambition, fear, and ruthless tactics.',
    lore: `House Harkonnen is infamous for its cruelty, cunning, and iron-fisted rule. Masters of manipulation and oppression, the Harkonnens use fear and brutality to dominate both their own subjects and enemies. From their industrial fortress on Giedi Prime, they scheme endlessly to expand their power, considering no act too vile in pursuit of victory.`,
    role: `House Harkonnen is the second main player-alignable faction. Their forces thrive on chaos, intimidation, and overwhelming force. Players join shock troops, saboteurs, and mercenaries in Harkonnen campaigns to destabilize Arrakis and crush Atreides influence.`,
    gameplay: `Aligning with Harkonnen grants access to menacing armor sets, exclusive weapon mods, and opportunities for sabotage missions. Harkonnen players gain bonuses to intimidation, resource plundering, and direct PvP. Faction objectives often focus on power struggles, sabotage, and brutal raids.`,
    idealPlaystyle: `Ideal for players relishing aggressive, high-stakes gameplay, underhanded tactics, and constant conflict. Harkonnen rewards those who thrive in chaos and seek domination at any cost.`,
    comparison: `**Harkonnen vs. Atreides:** Harkonnen thrive on fear, betrayal, and offense, while Atreides emphasize honor, defense, and unity.`,
  },
  {
    id: 'fremen',
    name: 'The Fremen',
    summary:
      "The vanished indigenous desert survivors, central to Arrakis's mystery.",
    lore: `The Fremen are the legendary native people of Arrakis, masters of survival in the planet's deadly deserts. Fiercely independent and spiritually connected to the land, the Fremen have perfected sandwalking, stillsuit use, and even sandworm riding. Though they seem to have vanished at the game’s outset, their legacy shapes the very soul of Arrakis.`,
    role: `Though not initially playable, Fremen influence survival mechanics, hidden lore, and environmental hazards. Players can discover Fremen technology, learn their techniques, and unravel the mystery of their disappearance by exploring deep desert ruins and ancient sietches.`,
    gameplay: `Fremen culture impacts gameplay through unique survival challenges and environmental storytelling. Their technology, such as improved stillsuits and crysknives, can be earned or discovered, granting major advantages in exploration and resource gathering.`,
    idealPlaystyle: `Engages players who love exploration, lore, and survival against the odds. Fremen-inspired quests reward ingenuity, patience, and mastery of the harsh environment.`,
    comparison: `Fremen contrast the off-world factions by representing Arrakis itself—favoring guerrilla tactics, environmental adaptation, and cultural resilience over brute force or politics.`,
  },
  {
    id: 'corrino',
    name: 'House Corrino (Imperium & Sardaukar)',
    summary:
      'The ruling Imperial dynasty and their elite Sardaukar troops, overseeing Arrakis.',
    // No image provided specifically for Corrino section in the source text
    lore: `House Corrino rules the Known Universe through the Padishah Emperor, Shaddam IV, wielding ultimate political power and the terrifying Sardaukar legions. These elite shock troops enforce the Emperor's will, trained from childhood in the death world of Salusa Secundus. In this timeline, Corrino balances the Atreides-Harkonnen war to maintain Imperial supremacy, acting through edicts, manipulation, and overwhelming force when needed.`,
    role: `Corrino manifests via Imperial decrees and Sardaukar enforcement. Not initially joinable, but their influence shapes the rules of war (kanly), world events, and political intrigue. Sardaukar appear as deadly PvE enemies, occasionally intervening to restore balance or punish excesses.`,
    gameplay: `Expect Imperial events that reshape server politics—truce zones, spice taxes, and surprise Sardaukar raids. Defeating Sardaukar yields rare loot and prestige. Corrino may become playable in future expansions, focusing on law, order, and command of elite NPCs.`,
    idealPlaystyle: `Currently appeals to players interested in story, politics, and high-level PvE. When playable, will attract fans of large-scale strategy, roleplay, and maintaining order.`,
    comparison: `Corrino stands above Atreides and Harkonnen, enforcing balance and Imperial law. They contrast Bene Gesserit’s subtlety with overt authority and military might.`,
  },
  {
    id: 'landsraad',
    name: 'The Landsraad Council',
    summary:
      'The assembly of Great Houses, providing political context and objectives.',
    // No image provided specifically for Landsraad section in the source text
    lore: `The Landsraad is the powerful council of all noble Houses, serving as a check on Imperial authority and a forum for negotiation, rivalry, and intrigue. The Landsraad enforces rules of warfare and manages collective interests through politics, feuds (kanly), and alliances. Minor Houses hold votes and sway, making the political arena as deadly as the desert.`,
    role: `The Landsraad frames the ongoing war, offering meta-objectives and political events. Its rulings justify server resets, buffs, or global events. Factions vie for favor, with the Atreides and Harkonnen both seeking advantage through diplomacy, tribute, or underhanded deals.`,
    gameplay: `Major server events, such as faction competitions, trade embargoes, and temporary alliances, are justified by Landsraad decisions. Contributing to faction objectives can earn players buffs, unique titles, or rewards tied to political standing.`,
    idealPlaystyle: `Best for guild leaders, min-maxers, crafters, and roleplayers interested in politics, long-term planning, and large-scale cooperation.`,
    comparison: `Unlike Corrino’s enforcement, Landsraad represents collective power and consensus, using influence and persuasion rather than direct force.`,
  },
  {
    id: 'bene-gesserit-sisterhood',
    name: 'Bene Gesserit Sisterhood',
    summary:
      'The secretive order influencing events through manipulation and foresight.',
    // No image provided specifically for BG section in the source text
    lore: `The Bene Gesserit are an ancient, secretive sisterhood, wielding influence through political marriages, prophecy, and superhuman training. They manipulate bloodlines, plant legends, and subtly steer the course of history. In this game’s alternate timeline, their plans have diverged, shaping the fates of Atreides, Harkonnen, and the Fremen in unexpected ways.`,
    role: `The Sisterhood acts as a non-playable faction, offering unique mentors, advanced training (like the Voice), and clandestine storylines. Key BG NPCs dispense wisdom, manipulate major plotlines, and occasionally offer rare abilities to players who gain their trust.`,
    gameplay: `Missions tied to the Bene Gesserit reward finesse, stealth, and persuasion over brute force. Players can unlock BG techniques for personal use, affecting social encounters and certain PvE scenarios.`,
    idealPlaystyle: `Perfect for those who enjoy intrigue, investigation, and support roles. Appeals to lore fans, social players, and stealth specialists.`,
    comparison: `BG contrasts Corrino’s overt authority with hidden influence and soft power, playing the long game for subtle control over Arrakis.`,
  },
  {
    id: 'choam',
    name: 'CHOAM',
    summary:
      'The universal corporation controlling commerce, particularly spice.',
    // No image provided specifically for CHOAM section in the source text
    lore: `CHOAM (Combine Honnete Ober Advancer Mercantiles) is the Imperium’s corporate giant, managing all spice production, trade, and finance. Shares are held by Houses and the Emperor alike, making profit the ultimate currency. On Arrakis, CHOAM agents run trade posts and auction houses, dealing with all sides but serving only the bottom line.`,
    role: `CHOAM acts as the economic engine. Its neutral trading posts serve as safe zones and market hubs, and its contracts drive both PvE and PvP gameplay. Players interact with CHOAM for crafting, currency exchange, and auctioning rare goods.`,
    gameplay: `Economic events, spice turn-ins, market fluctuations, and lucrative contracts all revolve around CHOAM. PvP and PvE alike can be shaped by their bounties and market-driven incentives.`,
    idealPlaystyle: `Suited for traders, crafters, economists, and anyone who enjoys the metagame of resource control and profit maximization.`,
    comparison: `CHOAM is pure capitalism—neutral but ruthless. Unlike Houses (politics) or BG (secrecy), they value only profit and control the lifeblood of Arrakis: spice.`,
  },
  {
    id: 'spacing-guild',
    name: 'Spacing Guild',
    summary:
      'The monopolistic entity controlling interstellar travel and banking.',
    // No image provided specifically for Guild section in the source text
    lore: `The Spacing Guild controls all interstellar travel via its prescient Navigators, made possible only by the spice melange. Guild neutrality is absolute—they transport anyone for a price, and their threat to "fold space" away from rebellious planets gives them unrivaled leverage. Little is known of their inner workings, but their power is felt everywhere.`,
    role: `The Guild is not joinable but shapes the very rules of the game. They operate spaceports (for fast travel and storage), enforce travel restrictions, and underpin the economy. Guild Bankers handle large transactions and currency conversion.`,
    gameplay: `Fast travel, cross-server trading, and premium logistics are all under Guild jurisdiction. Rare missions or services may require Guild favor, offering unique rewards and access to off-world information.`,
    idealPlaystyle: `Best for big-picture thinkers, logistics coordinators, and those interested in economy and infrastructure. Roleplayers can use Guild neutrality as a platform for diplomacy.`,
    comparison: `Apolitical pillar of power alongside Emperor/Landsraad. Focuses on infrastructure/logistics vs. CHOAM's market focus. Collaborates with CHOAM/BG but unique due to Navigators/spacefolding leverage. Generally not fought directly; appeased and paid. Provides neutral ground like CHOAM. Represents the underlying necessity of spice for the wider universe.`,
  },
];

// --- Choosing Faction Advice ---
const choosingFactionAdvice = {
  title: 'Choosing Your Faction: Advice for New and Veteran Players',
  introduction: `Choosing which faction to align with...`,
  newPlayers: `**For New Players:** House Atreides is often the best starter choice...`,
  experiencedPlayers: `**For Experienced or Competitive Players:** House Harkonnen offers depth and challenge...`,
  neutralTraders: `**Neutral/Trade-Focused Players:** Your House choice might matter less...`,
  futureExpansions: `**Future Faction Expansions:** Potential post-launch factions like House Corrino...`,
  personalPref: `**Personal Preference and Lore Alignment:** Ultimately, choose the faction that resonates...`,
  summary: `In summary, every faction and organization contributes to a living Arrakis...`,
};

// --- Main Component ---
export default function DuneFactionsPage() {
  const [expandedFactions, setExpandedFactions] = useState<
    Record<string, boolean>
  >({});

  const toggleFactionExpansion = (id: string) =>
    setExpandedFactions((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderParagraph = (text?: string) => {
    if (!text) return null;
    return (
      <p className={styles.paragraph}>
        {text.split(/(\*\*.*?\*\*)/g).map(
          (
            part,
            i // Split by bold markers
          ) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={i} className={styles.strongText}>
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
        )}
      </p>
    );
  };

  const renderChoiceAdvice = (text: string) => (
    <p className={styles.choiceAdviceParagraph}>
      {text.split(/(\*\*.*?\*\*)/g).map(
        (
          part,
          i // Split by bold markers
        ) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <span key={i} className={styles.choiceAdviceHeading}>
              {part.slice(2, -2)}
            </span>
          ) : (
            part
          )
      )}
    </p>
  );

  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Factions of Dune: Awakening</h1>
        <p className={styles.paragraph}>
          Dune: Awakening is set in an alternate Dune timeline, creating a
          unique political landscape on Arrakis...{' '}
          {/* Introductory paragraph */}
        </p>
      </section>
      {/* Map over each faction to create a collapsible section */}
      {duneFactions.map((faction) => {
        const expanded = expandedFactions[faction.id];
        return (
          <div key={faction.id} className={styles.factionSection}>
            <div
              className={styles.factionHeader}
              onClick={() => toggleFactionExpansion(faction.id)}
              role="button"
              tabIndex={0}
              aria-expanded={!!expanded}
              aria-controls={`content-${faction.id}`}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') &&
                toggleFactionExpansion(faction.id)
              }
            >
              <div>
                <h2 className={styles.factionTitle}>{faction.name}</h2>{' '}
                {/* Faction name as title */}
                <p className={styles.factionSummary}>{faction.summary}</p>{' '}
                {/* Faction summary */}
              </div>
              {expanded ? (
                <FaChevronUp
                  className={`${styles.expandIcon} ${styles.expandIconRotated}`}
                  aria-label="Collapse section"
                />
              ) : (
                <FaChevronDown
                  className={styles.expandIcon}
                  aria-label="Expand section"
                />
              )}
            </div>
            <div
              id={`content-${faction.id}`}
              className={`${styles.collapsibleContent} ${expanded ? styles.collapsibleContentExpanded : ''}`}
            >
              <div className={styles.factionContentContainer}>
                {faction.imageUrl && (
                  <Image
                    src={faction.imageUrl}
                    alt={`${faction.name} image`}
                    width={600}
                    height={338}
                  />
                )}
                <h3 className={styles.subHeading}>Lore & Background</h3>
                {renderParagraph(faction.lore)}
                <h3 className={styles.subHeading}>Role in the Game</h3>
                {renderParagraph(faction.role)}
                <h3 className={styles.subHeading}>Gameplay Implications</h3>
                {renderParagraph(faction.gameplay)}
                <h3 className={styles.subHeading}>Ideal Playstyle</h3>
                {renderParagraph(faction.idealPlaystyle)}
                {faction.comparison && (
                  <>
                    <h3 className={styles.subHeading}>Comparison</h3>
                    {renderParagraph(faction.comparison)}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{choosingFactionAdvice.title}</h2>
        <p className={styles.paragraph}>{choosingFactionAdvice.introduction}</p>
        {renderChoiceAdvice(choosingFactionAdvice.newPlayers)}
        {renderChoiceAdvice(choosingFactionAdvice.experiencedPlayers)}
        {renderChoiceAdvice(choosingFactionAdvice.neutralTraders)}
        {renderChoiceAdvice(choosingFactionAdvice.futureExpansions)}
        {renderChoiceAdvice(choosingFactionAdvice.personalPref)}
        <p className={styles.paragraph}>{choosingFactionAdvice.summary}</p>
      </section>
    </div>
  );
}
