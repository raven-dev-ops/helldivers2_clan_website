// src/app/(main)/helldivers-2/academy/page.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Keep Link import
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// --- Helper Function (UPDATED to use Class Names) ---
const renderArticleContent = (content: string) => {
    const subArticles = content.trim().split(/\n(?=\d\.\d{3,}(?:\.\d+)?:\s*)/); // Split by sub-article number

    return subArticles.map((subArticleText, index) => {
        const lines = subArticleText.trim().split('\n');
        const titleLine = lines[0] || '';
        let contentLines = lines.slice(1);

        const titleMatch = titleLine.match(/^(\d\.\d{3,}(?:\.\d+)?):\s*(.*)/);
        const subArticleNumber = titleMatch ? titleMatch[1] : '';
        const subArticleName = titleMatch ? titleMatch[2] : titleLine;
        // Determine class based on number format
        const titleClassName = subArticleNumber.includes('.') && subArticleNumber.split('.').length > 2
            ? "subsubsection-title" // Style for 6.110.x
            : "sub-article-title"; // Style for 6.110

        let chainOfCommandList: string[] = [];
        const chainStartIndex = contentLines.findIndex(line => line.trim() === 'Fleet Commander');
        if (subArticleNumber === '6.107' && chainStartIndex !== -1) {
             const potentialChain = contentLines.slice(chainStartIndex);
            const expectedChain = ['Fleet Commander', 'Democracy Officer', 'Loyalty Officer', 'Command'];
            if (potentialChain.length >= expectedChain.length &&
                potentialChain.slice(0, expectedChain.length).every((line, i) => line.trim() === expectedChain[i]))
            {
                chainOfCommandList = potentialChain.slice(0, expectedChain.length);
                contentLines.splice(chainStartIndex, expectedChain.length); // Remove from normal processing
            } else {
                 chainOfCommandList = [];
            }
        }

        return (
            // Use className for the wrapper div
            <div key={`${subArticleNumber}-${index}`} className="sub-article-content">
                {/* Use className for the title */}
                <h4 className={titleClassName}>
                    {subArticleNumber && `${subArticleNumber}: `}
                    {/* Use className for the strong tag */}
                    <strong className="text-strong">{subArticleName}</strong>
                </h4>
                {/* Map remaining lines */}
                {contentLines.map((line, lineIndex) => {
                    const trimmedLine = line.trim();
                    // Render list items
                    if (trimmedLine.startsWith('- ')) {
                         const itemText = trimmedLine.substring(2);
                         const boldMatch = itemText.match(/^(\*\*.*?\*\*):?\s*/);
                         const boldPart = boldMatch ? boldMatch[1].slice(2,-2) : null;
                         const restOfText = boldMatch ? itemText.substring(boldMatch[0].length) : itemText;
                         // Process parts for inline code
                         const parts = restOfText.split(/(`.*?`)/g).map((part, partIndex) => {
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={partIndex} className="inline-code">{part.slice(1, -1)}</code>; // Use className
                              } return part; });
                         return (
                            // Use className for ul and li
                             <ul key={lineIndex} className="styled-list none" style={{paddingLeft: '0.5rem'}}>
                                <li className="list-item">
                                   {boldPart && <strong className="list-item-strong">{boldPart}:</strong>} {/* Use className */}
                                   {parts}
                                </li>
                             </ul>
                         );
                    }
                    // Skip chain of command items here, they are rendered below
                    else if (chainOfCommandList.length > 0 && chainOfCommandList.includes(trimmedLine)) {
                        return null;
                    }
                    // Render paragraphs
                    else if (trimmedLine) {
                         const parts = trimmedLine.split(/(`.*?`)/g).map((part, partIndex) => {
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={partIndex} className="inline-code">{part.slice(1, -1)}</code>; // Use className
                              } return part; });
                         if (parts.join('').trim()) {
                             return <p key={lineIndex} className="text-paragraph">{parts}</p>; // Use className
                         }
                    }
                    return null; // Filter out empty lines
                 }).filter(Boolean)}

                 {/* Render the Chain of Command list */}
                 {chainOfCommandList.length > 0 && (
                     <div className="chain-of-command-list"> {/* Use className */}
                         {chainOfCommandList.map((part, partIndex) => (
                            // Use className, inline style only for dynamic indent
                             <div key={partIndex} className="chain-of-command-item" style={{ paddingLeft: `${partIndex * 1}rem` }}>
                                 {partIndex > 0 && <span className="chain-of-command-arrow"></span>} {/* Use className */}
                                 {part.trim()}
                             </div>
                         ))}
                     </div>
                 )}
            </div>
        );
    });
};


// --- Article Data (Keep as is) ---
const articles = [
    { id: '1.100', title: '1.100 Articles of Promotion and Recognition', content: `1.101: Recognition of Excellence: Members who demonstrate exemplary service or contributions may be publicly commended by any officer. Recognition must be logged in the appropriate channel for historical record. ⁠📢｜news\n1.102: Eligibility for Promotion: Promotions within the fleet are earned through merit, active participation, and alignment with the clan’s values. Recommendations must come from officers and require a majority vote in the officer corps.\n1.103: Battlefield Promotions: Field promotions may be awarded by an officer to a member displaying outstanding leadership or heroism in the absence of senior leadership. Such promotions are to be ratified within (48) hours. Conduct census in ⁠#unknown for approval by ⁠🔒｜admin.` },
    { id: '2.100', title: '2.100 Articles of Conduct and Discipline', content: `2.101: Respect and Decorum: All fleet members are expected to treat one another with respect and professionalism, regardless of rank. Degrading, insulting, or humiliating fellow members is strictly prohibited. Always elevate the lowest level or newest members, this is the way.\n2.102: Behavior Under Stress: Officers and members must maintain composure during high-pressure scenarios. Expressing frustration is acceptable but must be constructive, with no personal attacks or derogatory remarks, or self depreciation to the point it makes others feel uncomfortable.\n2.103: Chain of Command: Members must respect the chain of command. Disputes or disagreements with an officer’s decisions are to be addressed privately and respectfully. Notify a \`@LOYALTY OFFICER\` to file any reports on GPT Fleet officers.\n2.104: Breach of Discipline: Any member found in violation of conduct articles may face a formal warning conducted by (3) Democracy Officers, and may result in temporary suspension from clan activities, or dismissal from the fleet, depending on the severity of the offense. No one is perfect but we expect you to grow with us.` },
    { id: '3.100', title: '3.100 Articles of Operational Protocol', content: `3.101: Mission Expectations: Members are expected to come prepared for missions with appropriate motivation and a cooperative mindset. Habitual unpreparedness (drama/negativity) may result in exclusion from future operations at the squad leaders discretion.\n3.102: Constructive Feedback: Officers are encouraged to provide constructive feedback to members following missions. Criticism must be solution-oriented and delivered with respect. Consult ⁠#unknown for a census to determine the best approach.\n3.103: Engagement with Command: Members should voice concerns or suggestions regarding fleet operations through designated feedback channels (for social issues, direct message a \`@DEMOCRACY OFFICERS\`), ensuring the community evolves collaboratively while remaining casual.` },
    { id: '4.100', title: '4.100 Articles of Clan Representation', content: `4.101: Fleet Pride: All members represent the Galactic Phantom Taskforce in public matches and forums. Behavior that tarnishes the fleet’s reputation will be met with disciplinary action.\n4.102: Unified Identity: The fleet’s slogans, emblems, and codes are sacred symbols of our unity. Members are expected to honor and preserve this identity during clan engagements.\n4.103: Ambassadorial Conduct: Officers interacting with allied clans must uphold the highest standards of diplomacy and respect, ensuring strong alliances and mutual trust.` },
    { id: '5.100', title: '5.100 Articles of Community Well-Being', content: `5.101: Mental Health and Support: Members struggling with performance or other challenges must be treated with empathy and offered support. Harassment or singling out struggling members is prohibited. Report to your local \`@LOYALTY OFFICER\` for internal affairs.\n5.102: Open Communication: All members, regardless of rank, have the right to voice concerns without fear of retribution. Constructive dialogue is encouraged to address any issues. However if it is about a player, then this is to be handled with respect and reported to an Officer or higher.\n5.103: Conflict Resolution: Internal conflicts must be mediated through the Fleet Mediation Protocol (FMP). (3) designated \`@DEMOCRACY OFFICERS\` will oversee mediations to ensure fairness and resolution then report the resolution if applicable to officer chat.` },
    { id: '6.100', title: '6.100 Articles of Mission Etiquette (Hardcore Missions Only)', content: `6.101: Zero Callouts Warning: All team members must avoid unnecessary or repetitive callouts that clutter communication channels. Critical information should be concise and relevant to the mission. Callout for Heavy enemy types, when Reinforcing, when Marking Target, when Taking Target, when Using Stratagems, when Danger Close @Player, when Fumble (when you drop stratagem), Snitch (enemy scout), and when Death.\n6.102: Focus Main Objective: Mission success depends on prioritizing the Main Objective. Side tasks (Sub Objectives, Enemy Bases) and personal agendas must not interfere with the primary mission goal (average mission completed by (26) minutes left on Super Helldive).\n6.103: Must Obey Orders Given by Officers: Officers have the authority to issue mission-critical orders. Team members are required to comply immediately to maintain unit cohesion and ensure success.\n6.104: Must Take Breaks Given by Officers: Officers may mandate rest periods during prolonged operations to ensure team readiness and reduce mission fatigue. All team members must adhere to these directives.\n- Mandatory Break Between Mission: 300 seconds (5 minutes)\n- Mandatory Break Between Operation: 900 seconds (15 minutes)\n6.105: Voice Comms Must Be Clearly Heard, No Hot Mics: Communication is paramount. Members must ensure their voice comms are clear, concise, and free of background noise. Hot mics or disruptive audio (soundboards) will not be tolerated.\n6.106: Presentation of Articles Before Mission: This article must be presented at the beginning of every Hardcore mission. All participants must review and verbally agree to these standards before proceeding to operation selection.\n6.107: Chain of Command Enforcement: All disputes, grievances, or concerns during missions must follow the chain of command. Respect for officers and fellow members is mandatory at all times, resolve your conflicts in direct messages or elevate the concern to the next tier officer.\nFleet Commander\nDemocracy Officer\nLoyalty Officer\nCommand\n6.108: No Lone Wolf Behavior: Solo actions that deviate from the main mission plan compromise the entire team. Members must stick to the assigned role and coordinate with their squad.\n6.109: Equipment and Loadout Preparedness: Team members are responsible for ensuring their equipment and loadouts meet the mission requirements. Officers may order changes to optimize team performance or forbid stratagems at their discretion.\n6.110: Emergency Protocol Compliance: In case of unexpected mission changes or IRL emergency, all members must adhere to emergency protocols outlined by officers. Quick adaptation and compliance are crucial.\n6.110.1: Real-Life Interruptions: In the event a member needs to step away due to real-life priorities (e.g., emergencies, family, work), they must notify the team immediately via voice or chat if possible. If communication isn’t feasible, the team should hold position or adjust strategies until the member returns or the mission is reassessed by the officer in charge.\n6.110.2: Game Crashes: If a member experiences a game crash, they must attempt to rejoin the mission as soon as possible. The team should focus on securing a safe area to regroup while minimizing risks to the mission (300 second timer started before considered MIA or crashed). Officers may redistribute roles temporarily to compensate for the absence.\n6.110.3: Disconnections: In the case of a disconnection (e.g., internet issues or server drops), the member should rejoin promptly if the platform allows. If rejoining isn’t possible, the team must adjust strategies based on available resources, with officers making decisions to maximize mission success.\n6.110.4: Contingency Planning: Officers should prepare contingency plans for mission-critical roles (e.g., scouts, anti-heavy, or designated roles) to ensure minimal disruption in case of member absence. Backups or role adjustments should be communicated clearly and implemented without hesitation.\n6.110.5: No Penalties for Emergencies: Real-life emergencies, crashes, or disconnections are unavoidable. Members will not be penalized for these occurrences but are expected to communicate and resolve them as swiftly as possible. Chronic or repeated issues without explanation may require review by (3) officers.\n6.110.6: Team Response to Emergencies: Remaining members are expected to maintain composure during emergencies. Avoid placing blame or causing unnecessary tension. Focus on adapting to the situation and following officer directives to achieve the mission objectives despite challenges.` }
];

// --- Main Component (Updated with Class Names) ---
export default function AcademyPage() {
    const [isConductExpanded, setIsConductExpanded] = useState(false);
    // isConductHovered state removed, hover handled by CSS

    const toggleConductExpansion = () => {
        setIsConductExpanded(prev => !prev);
    };

  return (
    <main className="academy-main-container"> {/* Use Class */}
      <h1 className="academy-page-title">GPT HD2 Academy</h1> {/* Use Class */}

      {/* --- Academy Introduction --- */}
       <section className="content-section"> {/* Use Class */}
          <h2 className="content-section-title">Welcome Cadet or General!</h2> {/* Use Class */}
          <p className="text-paragraph"> The GPT Fleet Academy is your primary training ground for becoming an effective Helldiver within our ranks. Here, you'll learn the core principles, operational protocols, and the code that binds our fleet together. </p> {/* Use Class */}
           <p className="text-paragraph"> Whether you're mastering basic stratagems, learning advanced squad tactics, or preparing for the demanding <strong className="text-strong">John Helldiver Course</strong> (details found on the <Link href="/helldivers-2" className="text-link">Home</Link>) page, the Academy provides the foundation. Our goal is not just victory, but victory achieved with honor, discipline, and camaraderie. </p> {/* Use Class */}
           <p className="text-paragraph"> Familiarize yourself with the <strong className="text-strong">GPT Fleet Code of Conduct</strong>, detailed in the expandable section below. Understanding and adhering to these articles is mandatory for all members seeking progression and participation in organized fleet operations. For Super Earth! </p> {/* Use Class */}
      </section>

        {/* --- Enrollment Section --- */}
        <section className="content-section">
            <h2 className="content-section-title">Enrollment Window</h2>
            <p className="text-large-highlight"> Enrollment closes at the end of the current month. </p> {/* Use Class */}
            <p className="text-paragraph"> Begin your journey to leadership within the GPT Fleet. This cycle repeats monthly. </p>
        </section>

      {/* --- Cadet Training Program Section --- */}
      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Cadet Training Program</h2> {/* Use Classes */}
        {/* Phase 1 */}
        <div className="subsection-card"> {/* Use Class */}
          <h3 className="subsection-title">Phase 1: Cadet Orientation (7 Days)</h3> {/* Use Class */}
          <p className="text-paragraph"> Achieve <strong className="text-strong">Class A Citizen</strong> status by meeting initial standards. </p>
          <ul className="styled-list disc"> {/* Use Classes */}
            <li className="list-item">Complete 1 Operation OR 3 recorded missions with a <code className="inline-code">@DEMOCRACY OFFICERS</code> or <code className="inline-code">@FLEET COMMANDER</code>.</li> {/* Use Classes */}
          </ul>
          <p className="text-italic text-paragraph"> We aim to get you a place on the leaderboard! </p> {/* Use Classes */}
        </div>
        {/* Phase 2 */}
        <div className="subsection-card">
          <h3 className="subsection-title">Phase 2: Mission Readiness (14 Days)</h3>
          <p className="text-paragraph"> Complete <strong className="text-strong">10 missions</strong> or <strong className="text-strong">3 operations</strong> under guidance of assigned <code className="inline-code">@DEMOCRACY OFFICERS</code> or <code className="inline-code">@FLEET COMMANDER</code>. </p>
           <p className="text-paragraph"> Missions can be completed as duos to practice assessing and recruiting randoms. </p>
        </div>
        {/* Phase 3 */}
        <div className="subsection-card">
          <h3 className="subsection-title">Phase 3: Officer Review & Promotion (End of Cadet Training)</h3>
          <p className="text-paragraph"> Cadets completing Phase 2 schedule a 1-hour VC Officer Interview/Onboarding. </p>
          <p className="text-paragraph"> Interview Panel: Cadet, assigned DO/FC, <strong className="text-strong">PrizedRichard</strong>, and a third party. </p>
          <p className="text-paragraph"> Cadets coordinate scheduling with their DO/FC and <strong className="text-strong">PrizedRichard</strong> (Timezone: GMT). </p>
        </div>
      </section>

      {/* --- Fleet Commander Development Section --- */}
       <section className="content-section">
           <h2 className="content-section-title">Fleet Commander Promotion & Development</h2>
           <p className="text-paragraph"> Congratulations upon completion of Cadet training and promotion to <code className="inline-code">@FLEET COMMANDER</code>! Your development towards Democracy Officer begins now. </p>
           <p className="text-paragraph"> You will be assessed during a <strong className="text-strong">28-day mentorship period</strong> starting from your promotion date. </p>
           {/* Use specific class for this heading */}
           <h3 className="subsubsection-title" style={{color: 'var(--color-text-primary)'}}>Duties & Focus Areas:</h3>
           <ul className="styled-list disc">
               <li className="list-item">Assist with the development of newer members, helping them get involved and gain Class A citizenship.</li>
               <li className="list-item">Assist with the next intake/class of Cadets in their training phases.</li>
               <li className="list-item">Support Alliance relations, engaging with current Alliance members and potentially assisting with outreach to new ones.</li>
           </ul>
       </section>

       {/* --- Phase 4 DO Promotion Review --- */}
        <section className="content-section">
          <h2 className="content-section-title">Phase 4: Democracy Officer Promotion Review</h2>
          <p className="text-paragraph"> <code className="inline-code">@FLEET COMMANDER</code> who demonstrate readiness and are nominated by their <code className="inline-code">@DEMOCRACY OFFICERS</code> will schedule a Moderation Review. </p>
          <p className="text-paragraph"> A promotion board consisting of three <code className="inline-code">@LOYALTY OFFICER</code> members will evaluate the candidate for potential promotion to <strong className="text-strong">DEMOCRACY OFFICER</strong>. </p>
        </section>

      {/* --- Field Promotions Section --- */}
      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Earning Field Promotions</h2>
        <p className="text-paragraph"> Field promotions within GPT are a mark of excellence, dedication, and leadership beyond the standard training path. Here’s how they work: </p>
        {/* Step 1 */}
        <div className="subsection-card">
          <h3 className="subsection-title">Step 1: Excel & Earn the John Helldiver Award</h3>
          <p className="text-paragraph"> Mastering the Solo Tier List challenges (found on the <Link href="/helldivers-2" className="text-link">main Helldivers page</Link>) and earning the prestigious <strong className="text-strong">John Helldiver Award</strong> is the first step to standing out. </p>
           <p className="text-italic text-paragraph"> This achievement highlights your skills and commitment. We notice members who excel, demonstrating skill and thriving in our collaborative environment. </p>
        </div>
        {/* Step 2 */}
        <div className="subsection-card">
          <h3 className="subsection-title">Step 2: Recommendations for Promotion</h3>
          <p className="text-paragraph"> Promotions often arise from recommendations by officers based on contributions and potential: </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                  <h4 className="subsubsection-title">Fleet Commander to Democracy Officer:</h4>
                  <p className="text-paragraph-small-indent"><code className="inline-code">@LOYALTY OFFICER</code> members play a critical role, putting forward recommendations to the 10-Star General for discussion.</p>
              </div>
              <div>
                  <h4 className="subsubsection-title">Class A Citizen to Fleet Commander:</h4>
                  <p className="text-paragraph-small-indent">A <code className="inline-code">@DEMOCRACY OFFICERS</code> can recommend a Citizen, subject to approval by the 10-Star General commanding the fleet.</p>
              </div>
              <div>
                   <h4 className="subsubsection-title">Loyalty Officer Promotions:</h4>
                   <p className="text-paragraph-small-indent">This distinct honor is reserved for those consistently demonstrating outstanding loyalty and contributions. Promotions are made at the discretion of the 10-Star General to recognize individuals who go above and beyond.</p>
              </div>
          </div>
        </div>
        {/* Final Thoughts */}
        <div className="subsection-card">
           <h3 className="subsection-title">Final Thoughts on Field Promotions</h3>
           <p className="text-paragraph"> Field promotions aren’t just about rank—they’re about earning the respect and trust of the community. Every step rewards dedication, skill, and the spirit of teamwork. Strive for excellence; the GPT Fleet takes notice. </p>
        </div>
      </section>

       {/* --- Other Options / Info Section --- */}
      <section className="content-section options-grid"> {/* Apply grid class */}
         {/* Resignation Option */}
        <div className="subsection-card"> {/* Use class */}
            <h3 className="subsection-title">Resignation Option</h3>
            <p className="text-paragraph"> Members may choose to resign at any stage of training while retaining their <strong className="text-strong">Class A Citizen</strong> status or <strong className="text-strong">Fleet Commander</strong> position, title, and duties within our community. </p>
        </div>
        {/* Monthly Cycle */}
        <div className="subsection-card">
             <h3 className="subsection-title">Monthly Progression Cycle</h3>
            <ul className="styled-list none"> {/* Use classes */}
                <li className="list-item"><strong className="text-strong">Enrollment:</strong> 30-day sign-up period</li>
                <li className="list-item"><strong className="text-strong">Training (Cadet):</strong> 30-day completion window (Phases 1-3)</li>
                <li className="list-item"><strong className="text-strong">Graduate (Fleet Commander):</strong> 28-day mentorship</li>
                <li className="list-item"><strong className="text-strong">Democracy Officer:</strong> Post-review service</li>
                <li className="list-item"><strong className="text-strong">Phantom (Retired Officer):</strong> Post-active duty</li>
                <li className="list-item"><strong className="text-strong">Admin:</strong> 90-day term</li>
                <li className="list-item"><strong className="text-strong">Staff:</strong> Application-based</li>
            </ul>
        </div>
      </section>

      {/* --- Collapsible Code of Conduct Section --- */}
      <div className="collapsible-section"> {/* Use Class */}
          <div
              // Apply conditional class for border visibility based on expansion state
              className={`collapsible-header ${!isConductExpanded ? 'no-border' : ''}`}
              onClick={toggleConductExpansion}
              role="button" aria-expanded={isConductExpanded} aria-controls="code-of-conduct-content"
              tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleConductExpansion()}
          >
              <div>
                  <h2 className="collapsible-title">GPT Fleet Code of Conduct</h2> {/* Use Class */}
                  <p className="collapsible-summary">Click to expand/collapse the Core Articles</p> {/* Use Class */}
              </div>
              {/* Apply conditional class for icon rotation */}
              <FaChevronDown className={`expand-icon ${isConductExpanded ? 'rotated' : ''}`} aria-hidden="true"/>
          </div>
          <div
              id="code-of-conduct-content"
              // Apply conditional class for content expansion
              className={`collapsible-content ${isConductExpanded ? 'expanded' : ''}`}
          >
              <div className="collapsible-content-wrapper"> {/* Use Class */}
                  {articles.map(article => (
                      <div key={article.id}>
                          <h3 className="article-title">{article.title}</h3> {/* Use Class */}
                          {renderArticleContent(article.content)} {/* Helper renders elements with classes */}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* --- Closing Statement --- */}
      <p className="closing-text"> {/* Use Class */}
        Thank you for your dedication and passion. Together, we ensure the future strength and leadership of the GPT Fleet and uphold the ideals of our alliance.
      </p>
    </main>
  );
}