// src/app/(main)/helldivers-2/academy/page.tsx

"use client";

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// --- Style Object (Adding styles for new sections and grid) ---
const styles: { [key: string]: React.CSSProperties } = {
  mainContainer: {
    maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto',
    padding: '2rem 1rem 4rem',
    fontFamily: 'var(--font-sans, sans-serif)',
    color: 'var(--color-text-primary)'
  },
  pageTitle: {
    fontSize: 'clamp(1.8rem, 5vw, 2.25rem)', fontWeight: 'bold',
    marginBottom: '2rem', color: 'var(--color-primary, #facc15)',
    borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem',
    textAlign: 'center',
  },
  // General Section Styling
  section: {
    marginBottom: '2.5rem', padding: '1.5rem',
    backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  },
  // Specific section with bottom border
  sectionWithBorderBottom: {
      marginBottom: '1.5rem', // mb-6
      paddingBottom: '0.5rem', // pb-2
      borderBottom: '1px solid var(--color-border)', // border-b border-border
  },
  sectionTitle: { // For titles like "Enrollment Window", "Cadet Training Program"
    fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 600,
    color: 'var(--color-text-primary)', // text-secondary-foreground mapped
    marginBottom: '1rem', // Standard bottom margin for titles
  },
  subSection: { // For individual phase boxes or steps
      marginBottom: '2rem', // mb-8
      padding: '1.5rem', // p-6
      backgroundColor: 'var(--color-surface)', // bg-card
      border: '1px solid var(--color-border)', // border border-border
      borderRadius: 'var(--border-radius-lg)', // rounded-lg
      // No shadow needed if it's within a shadowed section already
  },
  subSectionTitle: { // For titles like "Phase 1:", "Step 1:"
    fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)', // text-xl
    fontWeight: 600, // font-semibold
    color: 'var(--color-primary, #facc15)', // text-primary-foreground mapped to primary
    marginBottom: '0.75rem', // mb-3
  },
   subSubSectionTitle: { // For titles like "Fleet Commander to Democracy Officer:"
        fontSize: '1rem', // Smaller than subSectionTitle
        fontWeight: 600, // font-semibold
        color: 'var(--color-text-primary)', // text-secondary-foreground mapped
        // No margin needed if parent div has space-y
   },
  paragraph: {
    color: 'var(--color-text-secondary)', // text-muted-foreground mapped
    marginBottom: '1rem', // mb-3 or mb-4 generally
    lineHeight: 1.7, whiteSpace: 'pre-line',
  },
  paragraphSmallIndent: { // For indented text like under subSubSectionTitle
      color: 'var(--color-text-secondary)',
      fontSize: '0.9rem', // text-sm
      marginLeft: '1rem', // ml-4
      lineHeight: 1.6,
      marginBottom: '0.5rem',
  },
  paragraphItalic: {
      fontStyle: 'italic',
      color: 'var(--color-text-secondary)',
      marginTop: '0.5rem', // mt-2 or similar
  },
  paragraphLargeHighlight: { // For Enrollment closing text
      fontSize: '1.125rem', // text-lg
      fontWeight: 500, // font-medium
      color: 'var(--color-primary-light)', // text-accent mapped to light primary
      marginBottom: '0.5rem',
  },
  list: {
    listStyleType: 'disc', listStylePosition: 'inside',
    color: 'var(--color-text-secondary)', // text-muted-foreground
    display: 'flex', flexDirection: 'column',
    gap: '0.5rem', // space-y-1 or space-y-2
    marginBottom: '0.75rem', // mb-3
    paddingLeft: '0.5rem',
  },
  listNone: { // For the Monthly Cycle list
    listStyleType: 'none',
    color: 'var(--color-text-secondary)',
    display: 'flex', flexDirection: 'column',
    gap: '0.25rem', // space-y-1
  },
  listItem: {
    lineHeight: 1.6,
  },
  code: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-primary-light)', // text-accent mapped
    padding: '0.1rem 0.3rem',
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--color-background-alt)', // bg-muted mapped
    fontSize: '0.9em',
    border: '1px solid var(--color-border-alt)',
    whiteSpace: 'nowrap',
  },
  strongText: { // For general strong tags
      fontWeight: 600,
      color: 'var(--color-text-primary)', // text-secondary-foreground mapped
  },
   // Grid layout for the 'Other Options' section
  gridContainer: {
      display: 'grid',
      gap: '1.5rem', // gap-6
      // Default to 1 column
  },
   gridContainerMd: { // Styles applied via media query or JS later
      // On medium screens (md), switch to 2 columns
      // This requires CSS Modules or styled-components for media queries
      // Inline styles can't handle this directly.
      // As a fallback, it will remain stacked without media queries.
  },
  // Styles for the Collapsible Code of Conduct Section
  collapsibleSection: {
        marginTop: '2.5rem', // Add margin top to separate from previous content
        marginBottom: '1.5rem',
        border: '1px solid var(--color-border-alt, #4b5563)',
        borderRadius: 'var(--border-radius-md, 0.5rem)',
        backgroundColor: 'var(--color-surface-alt, #273140)',
        overflow: 'hidden',
  },
  collapsibleHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.25rem', cursor: 'pointer',
        backgroundColor: 'var(--color-surface, #1f2937)',
        borderBottom: '1px solid var(--color-border-alt, #4b5563)',
        transition: 'background-color 0.2s ease',
  },
  collapsibleHeaderHover: {
        backgroundColor: 'var(--color-surface-hover, #374151)',
  },
  collapsibleTitle: {
        fontSize: '1.3rem', fontWeight: 700,
        color: 'var(--color-primary, #facc15)', margin: 0,
  },
  collapsibleSummary: {
        fontSize: '0.9rem', color: 'var(--color-text-secondary, #b0b0b0)',
        margin: '0.25rem 0 0 0', fontStyle: 'italic',
  },
  expandIcon: {
        fontSize: '1.2rem', color: 'var(--color-text-secondary, #b0b0b0)',
        transition: 'transform 0.3s ease',
  },
  expandIconRotated: {
        transform: 'rotate(180deg)',
  },
  collapsibleContent: {
        maxHeight: '0', opacity: 0, overflow: 'hidden',
        transition: 'max-height 0.7s ease-in-out, opacity 0.5s ease-in, padding 0.7s ease-in-out',
        padding: '0 1.5rem',
        backgroundColor: 'var(--color-surface-alt, #273140)',
  },
  collapsibleContentExpanded: {
        maxHeight: '10000px', opacity: 1,
        padding: '1.5rem 1.5rem',
  },
  // Styles for content *inside* the Code of Conduct
  contentWrapperInside: {
    display: 'flex', flexDirection: 'column',
    gap: '2rem',
  },
  articleTitle: {
    fontSize: 'clamp(1.35rem, 3.8vw, 1.6rem)', fontWeight: 700,
    color: 'var(--color-primary, #facc15)', marginBottom: '1rem',
    borderBottom: '1px dashed var(--color-border-alt)', paddingBottom: '0.5rem',
  },
  subArticleTitle: {
    fontSize: '1.1rem', fontWeight: 600,
    color: 'var(--color-text-primary)', marginBottom: '0.5rem',
  },
   subArticleContent: {
      paddingLeft: '1rem', borderLeft: '2px solid var(--color-border-alt)',
      marginBottom: '1rem',
  },
  listItemStrong: {
      fontWeight: 600, color: 'var(--color-text-primary)',
      marginRight: '0.35rem', display: 'inline',
  },
  chainOfCommandList: {
      paddingLeft: '1.5rem', fontFamily: 'var(--font-mono)',
      color: 'var(--color-text-secondary)', lineHeight: 1.5,
      marginTop: '0.5rem',
  },
   chainOfCommandItem: {
      marginBottom: '0.25rem',
  },
   closingText: { // Style for the final paragraph
      textAlign: 'center',
      fontStyle: 'italic',
      color: 'var(--color-text-secondary)', // text-muted-foreground
      marginTop: '2.5rem', // mt-10
   }
};

// --- Helper Function (Remains the same) ---
const renderArticleContent = (content: string) => {
    const subArticles = content.trim().split(/\n(?=\d\.\d{3}:)/);
    return subArticles.map((subArticleText, index) => {
        const lines = subArticleText.trim().split('\n');
        const titleLine = lines[0] || '';
        const contentLines = lines.slice(1);
        const titleMatch = titleLine.match(/^(\d\.\d{3,}(?:\.\d+)?):\s*(.*)/); // Adjusted regex for points like 6.110.1
        const subArticleNumber = titleMatch ? titleMatch[1] : '';
        const subArticleName = titleMatch ? titleMatch[2] : titleLine;

        // Use smaller title style for sub-sub-points like 6.110.1
        const titleStyle = subArticleNumber.includes('.') && subArticleNumber.split('.').length > 2
            ? styles.subSubSectionTitle // Use a different style if desired, or just keep subArticleTitle
            : styles.subArticleTitle;

        return (
            <div key={`${subArticleNumber}-${index}`} style={styles.subArticleContent}>
                <h4 style={titleStyle}>
                    {subArticleNumber && `${subArticleNumber}: `}
                    <strong style={{ color: 'var(--color-text-primary)' }}>{subArticleName}</strong>
                </h4>
                {contentLines.map((line, lineIndex) => {
                    const trimmedLine = line.trim();
                    // Handle list items (could be nested under sub-sub points)
                    if (trimmedLine.startsWith('- ')) {
                         const itemText = trimmedLine.substring(2);
                         const boldMatch = itemText.match(/^(\*\*.*?\*\*)/);
                         const boldPart = boldMatch ? boldMatch[1].slice(2,-2) : null;
                         const restOfText = boldMatch ? itemText.substring(boldMatch[1].length) : itemText;
                         const parts = restOfText.split(/(`.*?`)/g).map((part, partIndex) => {
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={partIndex} style={styles.code}>{part.slice(1, -1)}</code>;
                              } return part; });
                         return ( <ul key={lineIndex} style={{...styles.list, listStyle:'none', paddingLeft: '0.5rem'}}>
                                <li style={styles.listItem}> {boldPart && <strong style={styles.listItemStrong}>{boldPart}:</strong>} {parts} </li>
                             </ul> );
                    } else if (trimmedLine.includes(' > ')) { // Handle Chain of Command
                         const chainParts = trimmedLine.split(' > ');
                         return ( <div key={lineIndex} style={styles.chainOfCommandList}> {chainParts.map((part, partIndex) => ( <div key={partIndex} style={{...styles.chainOfCommandItem, paddingLeft: `${partIndex * 0.5}rem`}}> {partIndex > 0 && <span style={{marginRight: '0.5rem'}}></span>} {part.trim()} </div> ))} </div> );
                    } else if (trimmedLine) { // Handle paragraph lines
                         const parts = trimmedLine.split(/(`.*?`)/g).map((part, partIndex) => {
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={partIndex} style={styles.code}>{part.slice(1, -1)}</code>;
                              } return part; });
                         return <p key={lineIndex} style={styles.paragraph}>{parts}</p>;
                    } return null; })}
            </div> ); }); };

// --- Article Data (Remains the same) ---
const articles = [
    { id: '1.100', title: '1.100 Articles of Promotion and Recognition', content: `1.101: Recognition of Excellence: Members who demonstrate exemplary service or contributions may be publicly commended by any officer. Recognition must be logged in the appropriate channel for historical record. ⁠📢｜news\n1.102: Eligibility for Promotion: Promotions within the fleet are earned through merit, active participation, and alignment with the clan’s values. Recommendations must come from officers and require a majority vote in the officer corps.\n1.103: Battlefield Promotions: Field promotions may be awarded by an officer to a member displaying outstanding leadership or heroism in the absence of senior leadership. Such promotions are to be ratified within (48) hours. Conduct census in ⁠#unknown for approval by ⁠🔒｜admin.` },
    { id: '2.100', title: '2.100 Articles of Conduct and Discipline', content: `2.101: Respect and Decorum: All fleet members are expected to treat one another with respect and professionalism, regardless of rank. Degrading, insulting, or humiliating fellow members is strictly prohibited. Always elevate the lowest level or newest members, this is the way.\n2.102: Behavior Under Stress: Officers and members must maintain composure during high-pressure scenarios. Expressing frustration is acceptable but must be constructive, with no personal attacks or derogatory remarks, or self depreciation to the point it makes others feel uncomfortable.\n2.103: Chain of Command: Members must respect the chain of command. Disputes or disagreements with an officer’s decisions are to be addressed privately and respectfully. Notify a \`@LOYALTY OFFICER\` to file any reports on GPT Fleet officers.\n2.104: Breach of Discipline: Any member found in violation of conduct articles may face a formal warning conducted by (3) Democracy Officers, and may result in temporary suspension from clan activities, or dismissal from the fleet, depending on the severity of the offense. No one is perfect but we expect you to grow with us.` },
    { id: '3.100', title: '3.100 Articles of Operational Protocol', content: `3.101: Mission Expectations: Members are expected to come prepared for missions with appropriate motivation and a cooperative mindset. Habitual unpreparedness (drama/negativity) may result in exclusion from future operations at the squad leaders discretion.\n3.102: Constructive Feedback: Officers are encouraged to provide constructive feedback to members following missions. Criticism must be solution-oriented and delivered with respect. Consult ⁠#unknown for a census to determine the best approach.\n3.103: Engagement with Command: Members should voice concerns or suggestions regarding fleet operations through designated feedback channels (for social issues, direct message a \`@DEMOCRACY OFFICERS\`), ensuring the community evolves collaboratively while remaining casual.` },
    { id: '4.100', title: '4.100 Articles of Clan Representation', content: `4.101: Fleet Pride: All members represent the Galactic Phantom Taskforce in public matches and forums. Behavior that tarnishes the fleet’s reputation will be met with disciplinary action.\n4.102: Unified Identity: The fleet’s slogans, emblems, and codes are sacred symbols of our unity. Members are expected to honor and preserve this identity during clan engagements.\n4.103: Ambassadorial Conduct: Officers interacting with allied clans must uphold the highest standards of diplomacy and respect, ensuring strong alliances and mutual trust.` },
    { id: '5.100', title: '5.100 Articles of Community Well-Being', content: `5.101: Mental Health and Support: Members struggling with performance or other challenges must be treated with empathy and offered support. Harassment or singling out struggling members is prohibited. Report to your local \`@LOYALTY OFFICER\` for internal affairs.\n5.102: Open Communication: All members, regardless of rank, have the right to voice concerns without fear of retribution. Constructive dialogue is encouraged to address any issues. However if it is about a player, then this is to be handled with respect and reported to an Officer or higher.\n5.103: Conflict Resolution: Internal conflicts must be mediated through the Fleet Mediation Protocol (FMP). (3) designated \`@DEMOCRACY OFFICERS\` will oversee mediations to ensure fairness and resolution then report the resolution if applicable to officer chat.` },
    { id: '6.100', title: '6.100 Articles of Mission Etiquette (Hardcore Missions Only)', content: `6.101: Zero Callouts Warning: All team members must avoid unnecessary or repetitive callouts that clutter communication channels. Critical information should be concise and relevant to the mission. Callout for Heavy enemy types, when Reinforcing, when Marking Target, when Taking Target, when Using Stratagems, when Danger Close @Player, when Fumble (when you drop stratagem), Snitch (enemy scout), and when Death.\n6.102: Focus Main Objective: Mission success depends on prioritizing the Main Objective. Side tasks (Sub Objectives, Enemy Bases) and personal agendas must not interfere with the primary mission goal (average mission completed by (26) minutes left on Super Helldive).\n6.103: Must Obey Orders Given by Officers: Officers have the authority to issue mission-critical orders. Team members are required to comply immediately to maintain unit cohesion and ensure success.\n6.104: Must Take Breaks Given by Officers: Officers may mandate rest periods during prolonged operations to ensure team readiness and reduce mission fatigue. All team members must adhere to these directives.\n- Mandatory Break Between Mission: 300 seconds (5 minutes)\n- Mandatory Break Between Operation: 900 seconds (15 minutes)\n6.105: Voice Comms Must Be Clearly Heard, No Hot Mics: Communication is paramount. Members must ensure their voice comms are clear, concise, and free of background noise. Hot mics or disruptive audio (soundboards) will not be tolerated.\n6.106: Presentation of Articles Before Mission: This article must be presented at the beginning of every Hardcore mission. All participants must review and verbally agree to these standards before proceeding to operation selection.\n6.107: Chain of Command Enforcement: All disputes, grievances, or concerns during missions must follow the chain of command. Respect for officers and fellow members is mandatory at all times, resolve your conflicts in direct messages or elevate the concern to the next tier officer.\nFleet Commander > Democracy Officer > Loyalty Officer > Command\n6.108: No Lone Wolf Behavior: Solo actions that deviate from the main mission plan compromise the entire team. Members must stick to the assigned role and coordinate with their squad.\n6.109: Equipment and Loadout Preparedness: Team members are responsible for ensuring their equipment and loadouts meet the mission requirements. Officers may order changes to optimize team performance or forbid stratagems at their discretion.\n6.110: Emergency Protocol Compliance: In case of unexpected mission changes or IRL emergency, all members must adhere to emergency protocols outlined by officers. Quick adaptation and compliance are crucial.\n6.110.1: Real-Life Interruptions: In the event a member needs to step away due to real-life priorities (e.g., emergencies, family, work), they must notify the team immediately via voice or chat if possible. If communication isn’t feasible, the team should hold position or adjust strategies until the member returns or the mission is reassessed by the officer in charge.\n6.110.2: Game Crashes: If a member experiences a game crash, they must attempt to rejoin the mission as soon as possible. The team should focus on securing a safe area to regroup while minimizing risks to the mission (300 second timer started before considered MIA or crashed). Officers may redistribute roles temporarily to compensate for the absence.\n6.110.3: Disconnections: In the case of a disconnection (e.g., internet issues or server drops), the member should rejoin promptly if the platform allows. If rejoining isn’t possible, the team must adjust strategies based on available resources, with officers making decisions to maximize mission success.\n6.110.4: Contingency Planning: Officers should prepare contingency plans for mission-critical roles (e.g., scouts, anti-heavy, or designated roles) to ensure minimal disruption in case of member absence. Backups or role adjustments should be communicated clearly and implemented without hesitation.\n6.110.5: No Penalties for Emergencies: Real-life emergencies, crashes, or disconnections are unavoidable. Members will not be penalized for these occurrences but are expected to communicate and resolve them as swiftly as possible. Chronic or repeated issues without explanation may require review by (3) officers.\n6.110.6: Team Response to Emergencies: Remaining members are expected to maintain composure during emergencies. Avoid placing blame or causing unnecessary tension. Focus on adapting to the situation and following officer directives to achieve the mission objectives despite challenges.` }
];


export default function AcademyPage() {
    const [isConductExpanded, setIsConductExpanded] = useState(false); // Start collapsed
    const [isConductHovered, setIsConductHovered] = useState(false);

    const toggleConductExpansion = () => {
        setIsConductExpanded(prev => !prev);
    };

  return (
    <main style={styles.mainContainer}>
      <h1 style={styles.pageTitle}>GPT Fleet Academy</h1>

        {/* Enrollment Section */}
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Enrollment Window</h2>
            <p style={styles.paragraphLargeHighlight}>
                Enrollment closes at the end of the current month.
            </p>
            <p style={styles.paragraph}>
                Begin your journey to leadership within the GPT Fleet. This cycle repeats monthly.
            </p>
        </section>

      {/* Cadet Training Program Section */}
      <section style={styles.section}>
        <h2 style={{...styles.sectionTitle, ...styles.sectionWithBorderBottom}}>Cadet Training Program</h2>

        {/* Phase 1 */}
        <div style={styles.subSection}>
          <h3 style={styles.subSectionTitle}>Phase 1: Cadet Orientation (7 Days)</h3>
          <p style={styles.paragraph}>
            Achieve <strong style={styles.strongText}>Class A Citizen</strong> status by meeting initial standards.
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Complete 1 Operation OR 3 recorded missions with a <code style={styles.code}>@DEMOCRACY OFFICERS</code> or <code style={styles.code}>@FLEET COMMANDER</code>.</li>
          </ul>
          <p style={styles.paragraphItalic}>
            We aim to get you a place on the leaderboard!
          </p>
        </div>

        {/* Phase 2 */}
        <div style={styles.subSection}>
          <h3 style={styles.subSectionTitle}>Phase 2: Mission Readiness (14 Days)</h3>
          <p style={styles.paragraph}>
            Complete <strong style={styles.strongText}>10 missions</strong> or <strong style={styles.strongText}>3 operations</strong> under guidance of assigned <code style={styles.code}>@DEMOCRACY OFFICERS</code> or <code style={styles.code}>@FLEET COMMANDER</code>.
          </p>
           <p style={styles.paragraph}>
            Missions can be completed as duos to practice assessing and recruiting randoms.
           </p>
        </div>

        {/* Phase 3 */}
        <div style={styles.subSection}>
          <h3 style={styles.subSectionTitle}>Phase 3: Officer Review & Promotion (End of Cadet Training)</h3>
          <p style={styles.paragraph}>
            Cadets completing Phase 2 schedule a 1-hour VC Officer Interview/Onboarding.
          </p>
          <p style={styles.paragraph}>
            Interview Panel: Cadet, assigned DO/FC, <strong style={styles.strongText}>PrizedRichard</strong>, and a third party.
          </p>
          <p style={styles.paragraph}>
            Cadets coordinate scheduling with their DO/FC and <strong style={styles.strongText}>PrizedRichard</strong> (Timezone: GMT).
          </p>
        </div>
      </section>

      {/* Fleet Commander Development Section */}
       <section style={styles.section}>
           <h2 style={styles.sectionTitle}>Fleet Commander Promotion & Development</h2>
           <p style={styles.paragraph}>
               Congratulations upon completion of Cadet training and promotion to <code style={styles.code}>@FLEET COMMANDER</code>! Your development towards Democracy Officer begins now.
           </p>
           <p style={styles.paragraph}>
               You will be assessed during a <strong style={styles.strongText}>28-day mentorship period</strong> starting from your promotion date.
           </p>
           <h3 style={{...styles.subSectionTitle, fontSize: '1.125rem'}}>Duties & Focus Areas:</h3> {/* Slightly smaller heading */}
           <ul style={styles.list}>
               <li style={styles.listItem}>Assist with the development of newer members, helping them get involved and gain Class A citizenship.</li>
               <li style={styles.listItem}>Assist with the next intake/class of Cadets in their training phases.</li>
               <li style={styles.listItem}>Support Alliance relations, engaging with current Alliance members and potentially assisting with outreach to new ones.</li>
           </ul>
       </section>

       {/* Phase 4 DO Promotion Review */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Phase 4: Democracy Officer Promotion Review</h2>
          <p style={styles.paragraph}>
             <code style={styles.code}>@FLEET COMMANDER</code> who demonstrate readiness and are nominated by their <code style={styles.code}>@DEMOCRACY OFFICERS</code> will schedule a Moderation Review.
          </p>
          <p style={styles.paragraph}>
            A promotion board consisting of three <code style={styles.code}>@LOYALTY OFFICER</code> members will evaluate the candidate for potential promotion to <strong style={styles.strongText}>DEMOCRACY OFFICER</strong>.
          </p>
        </section>


      {/* Field Promotions Section */}
      <section style={styles.section}>
        <h2 style={{...styles.sectionTitle, ...styles.sectionWithBorderBottom}}>Earning Field Promotions</h2>
        <p style={styles.paragraph}>
          Field promotions within GPT are a mark of excellence, dedication, and leadership beyond the standard training path. Here’s how they work:
        </p>

        {/* Step 1 */}
        <div style={styles.subSection}>
          <h3 style={styles.subSectionTitle}>Step 1: Excel & Earn the John Helldiver Award</h3>
          <p style={styles.paragraph}>
            Mastering the Solo Tier List challenges within the Training Academy and earning the prestigious <strong style={styles.strongText}>John Helldiver Award</strong> is the first step to standing out.
          </p>
           <p style={styles.paragraphItalic}>
             This achievement highlights your skills and commitment. We notice members who excel, demonstrating skill and thriving in our collaborative environment.
          </p>
        </div>

        {/* Step 2 */}
        <div style={styles.subSection}>
          <h3 style={styles.subSectionTitle}>Step 2: Recommendations for Promotion</h3>
          <p style={styles.paragraph}>
            Promotions often arise from recommendations by officers based on contributions and potential:
          </p>
          {/* Using divs with gap for spacing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                  <h4 style={styles.subSubSectionTitle}>Fleet Commander to Democracy Officer:</h4>
                  <p style={styles.paragraphSmallIndent}><code style={styles.code}>@LOYALTY OFFICER</code> members play a critical role, putting forward recommendations to the 10-Star General for discussion.</p>
              </div>
              <div>
                  <h4 style={styles.subSubSectionTitle}>Class A Citizen to Fleet Commander:</h4>
                  <p style={styles.paragraphSmallIndent}>A <code style={styles.code}>@DEMOCRACY OFFICERS</code> can recommend a Citizen, subject to approval by the 10-Star General commanding the fleet.</p>
              </div>
              <div>
                   <h4 style={styles.subSubSectionTitle}>Loyalty Officer Promotions:</h4>
                   <p style={styles.paragraphSmallIndent}>This distinct honor is reserved for those consistently demonstrating outstanding loyalty and contributions. Promotions are made at the discretion of the 10-Star General to recognize individuals who go above and beyond.</p>
              </div>
          </div>
        </div>

        {/* Final Thoughts */}
        <div style={styles.subSection}>
           <h3 style={styles.subSectionTitle}>Final Thoughts on Field Promotions</h3>
           <p style={styles.paragraph}>
               Field promotions aren’t just about rank—they’re about earning the respect and trust of the community. Every step rewards dedication, skill, and the spirit of teamwork. Strive for excellence; the GPT Fleet takes notice.
           </p>
        </div>
      </section>

       {/* Other Options / Info Section - Using Flex Wrap for basic responsiveness */}
      <section style={{...styles.section, display: 'flex', flexWrap: 'wrap', gap: '1.5rem'}}>
         {/* Resignation Option */}
        <div style={{...styles.subSection, flex: '1 1 300px', marginBottom: 0 /* Remove bottom margin if inside flex */}}>
            <h3 style={styles.subSectionTitle}>Resignation Option</h3>
            <p style={styles.paragraph}>
                Members may choose to resign at any stage of training while retaining their <strong style={styles.strongText}>Class A Citizen</strong> status or <strong style={styles.strongText}>Fleet Commander</strong> position, title, and duties within our community.
            </p>
        </div>

        {/* Monthly Cycle */}
        <div style={{...styles.subSection, flex: '1 1 300px', marginBottom: 0 }}>
             <h3 style={styles.subSectionTitle}>Monthly Progression Cycle</h3>
            <ul style={styles.listNone}>
                <li style={styles.listItem}><strong style={styles.strongText}>Enrollment:</strong> 30-day sign-up period</li>
                <li style={styles.listItem}><strong style={styles.strongText}>Training (Cadet):</strong> 30-day completion window (Phases 1-3)</li>
                <li style={styles.listItem}><strong style={styles.strongText}>Graduate (Fleet Commander):</strong> 28-day mentorship</li>
                <li style={styles.listItem}><strong style={styles.strongText}>Democracy Officer:</strong> Post-review service</li>
                <li style={styles.listItem}><strong style={styles.strongText}>Phantom (Retired Officer):</strong> Post-active duty</li>
                <li style={styles.listItem}><strong style={styles.strongText}>Admin:</strong> 90-day term</li>
                <li style={styles.listItem}><strong style={styles.strongText}>Staff:</strong> Application-based</li>
            </ul>
        </div>
      </section>


      {/* Collapsible Code of Conduct Section */}
      <div style={styles.collapsibleSection}>
          <div
              style={{ ...styles.collapsibleHeader, ...(isConductHovered ? styles.collapsibleHeaderHover : {}), borderBottom: isConductExpanded ? `1px solid ${styles.collapsibleHeader.borderBottomColor}` : 'none' }}
              onClick={toggleConductExpansion}
              onMouseEnter={() => setIsConductHovered(true)} onMouseLeave={() => setIsConductHovered(false)}
              role="button" aria-expanded={isConductExpanded} aria-controls="code-of-conduct-content"
              tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleConductExpansion()}
          >
              <div>
                  <h2 style={styles.collapsibleTitle}>GPT Fleet Code of Conduct</h2>
                  <p style={styles.collapsibleSummary}>Click to expand/collapse the Core Articles</p>
              </div>
              {isConductExpanded
                  ? <FaChevronUp style={{...styles.expandIcon, ...styles.expandIconRotated}} aria-label="Collapse section"/>
                  : <FaChevronDown style={styles.expandIcon} aria-label="Expand section"/>
              }
          </div>
          <div
              id="code-of-conduct-content"
              style={{ ...styles.collapsibleContent, ...(isConductExpanded ? styles.collapsibleContentExpanded : {}) }}
          >
              {/* Render the detailed articles inside */}
              <div style={styles.contentWrapperInside}>
                  {articles.map(article => (
                      <div key={article.id}>
                          <h3 style={styles.articleTitle}>{article.title}</h3>
                          {renderArticleContent(article.content)}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Closing Statement */}
      <p style={styles.closingText}>
        Thank you for your dedication and passion. Together, we ensure the future strength and leadership of the GPT Fleet and uphold the ideals of our alliance.
      </p>
    </main>
  );
}