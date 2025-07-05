"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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

// --- Full Faction Data ---
const duneFactions: Faction[] = [
  {
    id: "atreides",
    name: "House Atreides",
    summary: "The noble house valuing honor, loyalty, and justice.",
    imageUrl: "", // optional image
    lore: `House Atreides is renowned for its moral integrity...`,
    role: `In Dune: Awakening, House Atreides is one of the two player-alignable factions...`,
    gameplay: `Choosing Atreides grants access to unique rewards...`,
    idealPlaystyle: `House Atreides is well-suited for players who enjoy a heroic or diplomatic playstyle.`,
    comparison: `**Atreides vs. Harkonnen:** Atreides favor honorable tactics...`,
  },
  {
    id: "harkonnen",
    name: "House Harkonnen",
    summary: "The brutal house driven by ambition, fear, and ruthless tactics.",
    lore: `In stark contrast to the Atreides, House Harkonnen embodies brutality...`,
    role: `House Harkonnen is the second player-alignable faction...`,
    gameplay: `Aligning with Harkonnen grants intimidating faction gear...`,
    idealPlaystyle: `Ideal for players relishing aggressive, high-stakes gameplay...`,
    comparison: `**Harkonnen vs. Atreides:** Harkonnen thrive on fear, betrayal, and offense...`,
  },
  {
    id: "fremen",
    name: "The Fremen",
    summary: "The vanished indigenous desert survivors, central to Arrakis's mystery.",
    lore: `The Fremen are the indigenous people of Arrakis...`,
    role: `Though not initially playable, Fremen influence survival mechanics...`,
    gameplay: `Fremen influence gameplay through technology and environment...`,
    idealPlaystyle: `Engages players who love exploration, lore, and survival...`,
    comparison: `Fremen contrast the off-world factions by representing Arrakis itself...`,
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

// --- Choosing Faction Advice ---
const choosingFactionAdvice = {
  title: "Choosing Your Faction: Advice for New and Veteran Players",
  introduction: `Choosing which faction to align with...`,
  newPlayers: `**For New Players:** House Atreides is often the best starter choice...`,
  experiencedPlayers: `**For Experienced or Competitive Players:** House Harkonnen offers depth and challenge...`,
  neutralTraders: `**Neutral/Trade-Focused Players:** Your House choice might matter less...`,
  futureExpansions: `**Future Faction Expansions:** Potential post-launch factions like House Corrino...`,
  personalPref: `**Personal Preference and Lore Alignment:** Ultimately, choose the faction that resonates...`,
  summary: `In summary, every faction and organization contributes to a living Arrakis...`,
};

// --- Styles ---
const styles = {
  pageContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem 4rem",
    color: "#e0e0e0",
    fontFamily: "sans-serif",
  },
  section: {
    marginBottom: "2.5rem",
    padding: "1.5rem",
    backgroundColor: "#1f2937",
    borderRadius: "0.75rem",
    border: "1px solid #374151",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "clamp(1.6rem, 4vw, 2rem)",
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#f9a825",
    borderBottom: "1px solid #374151",
    paddingBottom: "0.75rem",
  } as React.CSSProperties,
  paragraph: {
    marginBottom: "1.25rem",
    lineHeight: 1.7,
    whiteSpace: "pre-line",
    color: "#b0b0b0",
  } as React.CSSProperties,
  strongText: {
    fontWeight: 600,
    color: "#e0e0e0",
  } as React.CSSProperties,
  factionSection: {
    marginBottom: "1.5rem",
    border: "1px solid #4b5563",
    borderRadius: "0.5rem",
    backgroundColor: "#273140",
  } as React.CSSProperties,
  factionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.25rem",
    cursor: "pointer",
    backgroundColor: "#1f2937",
    borderBottom: "1px solid #4b5563",
  } as React.CSSProperties,
  factionTitle: {
    fontSize: "1.3rem",
    fontWeight: 600,
    color: "#f9a825",
  } as React.CSSProperties,
  factionSummary: {
    fontSize: "0.9rem",
    color: "#b0b0b0",
    marginTop: "0.25rem",
    fontStyle: "italic",
  } as React.CSSProperties,
  expandIcon: {
    fontSize: "1.2rem",
    color: "#b0b0b0",
    transition: "transform 0.3s ease",
  } as React.CSSProperties,
  expandIconRotated: {
    transform: "rotate(180deg)",
  } as React.CSSProperties,
  collapsibleContent: {
    maxHeight: "0",
    opacity: 0,
    overflow: "hidden",
    transition: "max-height 0.5s ease-out, opacity 0.4s ease-in",
    padding: "0 1.25rem",
  } as React.CSSProperties,
  collapsibleContentExpanded: {
    maxHeight: "10000px",
    opacity: 1,
    padding: "1.5rem 1.25rem",
  } as React.CSSProperties,
  factionContentContainer: {
    backgroundColor: "#1f2937",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    marginTop: "1rem",
    border: "1px solid #4b5563",
  } as React.CSSProperties,
  subHeading: {
    fontSize: "1.15rem",
    fontWeight: 600,
    color: "#e0e0e0",
    marginTop: "1.5rem",
    marginBottom: "0.75rem",
    borderBottom: "1px dashed #4b5563",
    paddingBottom: "0.4rem",
  } as React.CSSProperties,
  choiceAdviceParagraph: {
    marginBottom: "1rem",
    lineHeight: 1.7,
    whiteSpace: "pre-line",
    color: "#b0b0b0",
  } as React.CSSProperties,
  choiceAdviceHeading: {
    fontWeight: 700,
    color: "#e0e0e0",
    display: "block",
    marginBottom: "0.25rem",
  } as React.CSSProperties,
};

// --- Main Component ---
export default function DuneFactionsPage() {
  const [expandedFactions, setExpandedFactions] = useState<Record<string, boolean>>({});

  const toggleFactionExpansion = (id: string) =>
    setExpandedFactions((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderParagraph = (text?: string) => {
    if (!text) return null;
    return (
      <p style={styles.paragraph}>
        {text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} style={styles.strongText}>
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
    <p style={styles.choiceAdviceParagraph}>
      {text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <span key={i} style={styles.choiceAdviceHeading}>
            {part.slice(2, -2)}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );

  return (
    <div style={styles.pageContainer}>
      <section style={styles.section}>
        <h1 style={styles.sectionTitle}>Factions of Dune: Awakening</h1>
        <p style={styles.paragraph}>
          Dune: Awakening is set in an alternate Dune timeline, creating a
          unique political landscape on Arrakis...
        </p>
      </section>

      {duneFactions.map((faction) => {
        const expanded = expandedFactions[faction.id];
        return (
          <div key={faction.id} style={styles.factionSection}>
            <div
              style={styles.factionHeader}
              onClick={() => toggleFactionExpansion(faction.id)}
            >
              <div>
                <h2 style={styles.factionTitle}>{faction.name}</h2>
                <p style={styles.factionSummary}>{faction.summary}</p>
              </div>
              {expanded ? (
                <FaChevronUp
                  style={{ ...styles.expandIcon, ...styles.expandIconRotated }}
                />
              ) : (
                <FaChevronDown style={styles.expandIcon} />
              )}
            </div>
            <div
              style={{
                ...styles.collapsibleContent,
                ...(expanded ? styles.collapsibleContentExpanded : {}),
              }}
            >
              <div style={styles.factionContentContainer}>
                {faction.imageUrl && (
                  <Image
                    src={faction.imageUrl}
                    alt={`${faction.name} image`}
                    width={600}
                    height={338}
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
                {faction.comparison && (
                  <>
                    <h3 style={styles.subHeading}>Comparison</h3>
                    {renderParagraph(faction.comparison)}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{choosingFactionAdvice.title}</h2>
        <p style={styles.paragraph}>{choosingFactionAdvice.introduction}</p>
        {renderChoiceAdvice(choosingFactionAdvice.newPlayers)}
        {renderChoiceAdvice(choosingFactionAdvice.experiencedPlayers)}
        {renderChoiceAdvice(choosingFactionAdvice.neutralTraders)}
        {renderChoiceAdvice(choosingFactionAdvice.futureExpansions)}
        {renderChoiceAdvice(choosingFactionAdvice.personalPref)}
        <p style={{ ...styles.paragraph, marginTop: "1.5rem" }}>
          {choosingFactionAdvice.summary}
        </p>
      </section>
    </div>
  );
}
