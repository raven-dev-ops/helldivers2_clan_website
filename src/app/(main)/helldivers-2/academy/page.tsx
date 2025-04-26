// src/app/(main)/helldivers-2/academy/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStar, FaDiscord, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// --- Import CSS Module ---
import styles from './AcademyPage.module.css';

// --- Review Data Structure ---
interface Review { id: number; author: string; title: string; text: string; rating: number; }
const reviews: Review[] = [ /* ... Review data remains the same ... */
    { id: 1, author: "joshgiff", title: "A Solid Growing Community", text: "I came across GPT fleet as a helldiver in a different discord server. We were offered to join a server that had a discord bot that would link other servers together to allow divers from across discord to link up and spread democracy together. So far in my experience it has been a safe, active and growing community to meet up and dive together. On times where I am not diving there is usually a group of people socializing in one of the voice chat channels and I have found that helpful for hobbying and hanging with other people. 10/10 would dive with them any day of the week.", rating: 5 },
    { id: 2, author: "charredviolet8771", title: "Democracy Approved", text: "I've been apart of the GPT Fleet for about three or four months now and the community has been so welcoming and encouraging. The folks here have given great advice and taught me so many things about Helldivers 2 that I would have struggled to figure out alone. I don't have to worry about folks being toxic towards me, which is great! I look forward to seeing where this awesome community goes in the future, and I highly recommend it as a place to learn/ hang out with your fellow Helldivers!", rating: 5 },
    { id: 3, author: "silverdolphin01", title: "Great Community", text: "I haven't been able to be as active as I'd like but this is a great community! I would definitely recommend to both new and experienced players!", rating: 5 },
    { id: 4, author: "krieg112", title: "Great, Non-toxic, and Casual", text: "I’ve been in GPT a few months now and I have achieved the server’s partial moderator sort of role. The training program was a great way of connecting to the amazing global community. I’ve not been pressured to play excessively or give up personal time to be involved either. TLDR: Great server with nice staff and members. Highly recommend.", rating: 5 },
    { id: 5, author: "zephthehuman", title: "The best non toxic Helldivers 2 Community I've seen so far", text: "If you are looking for a Helldivers 2 Gaming Clan(s) that isn't filled with raging elitists, trolls or chaos divers, but instead an 18+ sfw mature community, then GPT Fleet is definitely for you! I've been on Discord gaming communities since September 2015 and I know for a fact that this community shines in making it comfortable and welcoming for new players, returning players and veterans alike. Things I've noticed: (personally) ✔️non problematic banter (mostly in vc's) ✔️no name calling or flaming (policy included to prevent that) ✔️a mix of players of different lvls with a focus on community based challenges and it's leaderboard. ✔️a more casual mindset which in turn makes the missions more lighthearted, less serious but still enough to make a super helldive more epic than usual ✔️a lot of friendly demeanor ✔️no activity requirements ✔️staff is attentive ✔️well structured server with it's own bots and clan network ✔️here's another checkmark for absolutely no reason!! :D", rating: 5 },
    { id: 6, author: "zolosio", title: "CERTIFICATE OF LEGITNESS", text: "As a member of the GPT Fleet since September 4 of 2024, I can confidently say that the group and members within from newbies to veterans are always VERY supportive and professionally polite. I never have to worry about toxicness 1 bit! or if it's going to be dry or not busy. This Amazing community really strives to be the number one helldivers 2 discord group and it shows, there is plenty and I mean PLENTY of room to grow in rank within the GPT and an endless amount of amazing people I personally love playing with including myself that will help you along the way! Need advice on what loadouts to bring to that next D10, or some coaching on accuracy from one of our top players? Whether you're looking to become the next John helldiver or just another scratch in the paw for freedom, the GPT fleet is definitely the place to be! With everything from community movie night to karaoke it can be as serious or casual as need be. It is definitely thebest community I have ever experienced where your effort doesn't go un-noticed and your always respected and protected. Amazing people honestly -Zolosio", rating: 5 },
    { id: 7, author: "duepulse", title: "GPT Fleet produces the best Helldivers", text: "Joined the fleet back in Aug of last year. Fought with the bravest and greatest that the fleet has to offer. And safe to say that anyone who joins up and is looking for anyone to join you into the frontlines, the fleet is spoiled with choices of very courageous and disciplined Helldivers. This review is approved by the Ministry of Truth", rating: 5 },
    { id: 8, author: "mr.swimson", title: "11/10 experience", text: "love the people, love the vibe, love the bots. Adding my own server with over 2.5k members to the GPT Fleet alliance was one of the best choices I've made. Really opened up doors for people to play together and meet new people across multiple servers. If you're looking for a chill community to hang out, I highly recommend GPT Fleet. All are welcome!!", rating: 5 },
    { id: 9, author: "mrman1594", title: "Best experience", text: "When I first got helldivers 2 I had a hard time knowing how the game works since I join GPT they give me one of the best experience!!!! I highly recommend joining If you’re new or daily player it makes the game so much fun!!!!", rating: 5 },
    { id: 10, author: "shway_maximus", title: "An amazing Helldiver guild curated by the best 10 Star General there is", text: "I joined this community two months ago after leveling to 145 playing solo with randoms. After joining this discord I've met so many great players and I have made many new friends. It's awesome playing with highly competent people consistently. Our glorious leader made it easy for us to set up an LFG channel or join one that is already in session. Everyone is so supportive and we continue to grow everyday.", rating: 5 },
    { id: 11, author: "vetscape", title: "A Fleet To Call Home Away From Super Earth", text: "I started this discord after my brother gifted me the game on steam when it came out. I never heard of Helldivers before. After playing the game, I really enjoyed the weapons mechanics, squad dynamics, and the galactic game master. My goal for GPT Fleet is to have a HD2 focused community that places value on escapism. Join our fleet, play in some squads, experience a fleet weekend event, and come back here and leave an honest review. Let us know how we can improve and catch up the latest fleet news on our youtube or X: @gptfleet", rating: 5 },
    { id: 12, author: "lucian_666", title: "GPT FLEET is Amazing", text: "Ton of veterans from different branches. Great times and the owner of the server is always expanding to the next best thing. I love being here!", rating: 5 },
    { id: 13, author: "theslayestfox", title: "Greatly organized", text: "I love how social this server especially with all the different channels and it really active got events about every week and people playing about everyday always time to grab some hell divers and spread democracy", rating: 5 },
    { id: 14, author: "nocturnalverse", title: "GPT Fleet is a great Helldiver community.", text: "We're looking to be a Helldiver only discord. We welcome new players especially. We're growing slowly but the goal is to always have someone to play with in the style of play that you enjoy. Check it out. If you see someone in chat, they are probably playing, join up today!", rating: 5 },
    { id: 15, author: "corbiskeys", title: "Ode to Freedom", text: `In the digital sea, a fleet does sail,\n"GPT Fleet," where friendships prevail.\nA haven for gamers, a circle so wide,\nWhere laughter and teamwork coincide.\n\nHere, every voice finds a welcoming tune,\nUnder the watchful gaze of the digital moon.\nFrom puzzles to battles, in worlds far and wide,\nBeside every player, a friend to confide.\n\nIn "GPT Fleet," where the banners are unfurled,\nA community thrives in this virtual world.\nNo matter the game, the hour, the quest,\nHere, you're more than a guest.\n\nSo sail into the harbor, where the heart never fleets,\nJoin hands, join games, in the "GPT Fleet."\nFor in this haven of pixels, you'll always find,\nA place to call home, a group of your kind.`, rating: 5 },
    { id: 16, author: "themephs", title: "Unbelievable quality", text: "Thanks to GPT Fleet I can marry my cousins and developed a fentanyl addiction. Keep slaying. Thanks GPT Fleet!", rating: 5 },
    { id: 17, author: "brentielal1123", title: "Democracy", text: "Come in and have fun, friendly people and there to help. Democracy for all and plenty of Bug Juice to go around. Weeky Events going on as well.", rating: 5 },
];

// --- John Helldiver Challenge Data ---
interface ChallengeLevelData {
    id: string;
    levelTitle: string;
    details: string;
}
const challengeLevels: ChallengeLevelData[] = [ /* ... Challenge data remains the same ... */
     { id: 'level-0', levelTitle: 'LEVEL 0 - Basic Clearance', details: `MISSION TYPE: Eradicate Automaton Forces (Fortress) / Purge Hatcheries (Mega Nest)\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS: Solo\nEXTRACT:      Required` },
     { id: 'level-1', levelTitle: 'LEVEL 1 - Sabotage Proficiency', details: `MISSION TYPE: Sabotage Air Base / Destroy Command Bunkers / Sabotage Supply Bases (Orbital Cannon / Nuke Nursery)\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS: Solo\nEXTRACT:      Required` },
     { id: 'level-2', levelTitle: 'LEVEL 2 - Resource Denial', details: `MISSION TYPE: Sabotage Air Base / Destroy Command Bunkers / Sabotage Supply Bases (Orbital Cannon / Nuke Nursery)\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS:\n  - Solo\n  - No Stratagems (Eagle, Orbital, Support Wpns, Backpacks)\n  - No Resupply pod usage\nEXTRACT:      Required` },
     { id: 'level-3', levelTitle: 'LEVEL 3 - ICBM Control', details: `MISSION TYPE: Launch ICBM\nOBJECTIVE:    Complete the main objective (Launch ICBM).\nREQUIREMENTS:\n  - Solo\n  - No Stratagems (Eagle, Orbital, Support Wpns, Backpacks)\nEXTRACT:      Required` },
     { id: 'level-4', levelTitle: 'LEVEL 4 - Flawless ICBM', details: `MISSION TYPE: Launch ICBM\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS:\n  - Solo\n  - No Stratagems\n  - No Resupply pod usage\n  - No Deaths\nEXTRACT:      Required` },
     { id: 'level-5', levelTitle: 'LEVEL 5 - Perfect Survey', details: `MISSION TYPE: Conduct Geological Survey\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS:\n  - Solo\n  - No Deaths\nEXTRACT:      Required` },
     { id: 'level-6', levelTitle: 'LEVEL 6 - Eagle Ace', details: `MISSION TYPE: Retrieve Essential Personnel (Capture Flag / Civilian Evac)\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS:\n  - Solo\n  - Only Eagle Stratagems allowed (Airstrike, 500kg, Strafing, etc.)\n    (NO Orbitals, NO Support Wpns/Backpacks unless found)\nEXTRACT:      Required` },
     { id: 'level-7', levelTitle: 'LEVEL 7 - The Purist', details: `MISSION TYPE: Launch ICBM\n\nOBJECTIVE:\n  - Complete the main objective (Launch ICBM)\n  - Complete ALL 5 possible Side Objectives\n    (e.g., SEAF Artillery, Radar Tower, Stalker Lairs, Jammers, Mortars, etc.)\n\nREQUIREMENTS:\n  - Solo\n  - No Stratagems (Eagles, Orbitals, Support Weapons, Backpacks called down)\n  - No Deaths\n  - No Resupply pod usage\n  - Cannot use any Support Weapons found in the mission\n    (e.g., dropped Autocannon, Railgun).\n  - EXCEPTION: SG-8S Slugger found in world IS allowed.\n\nLOADOUT:\n  - Primary:   JAR-5 Dominator (Constitution Rifle)\n  - Secondary: P-6 Senator Revolver\n  - Grenade:   G-3 Throwing Knife\n\nEXTRACT:      Required` },
     { id: 'level-8', levelTitle: 'LEVEL 8 - PRESTIGE #1: Terminid Spawn Camp', details: `MISSION TYPE: Sabotage Supply Bases (Nuke Nursery) OR Purge Hatcheries (Terminid Drill)\n\nOBJECTIVE:    Full Clear\n  - Complete Main Objective\n  - Complete ALL Side Objectives\n  - Destroy ALL Fabricators / Bug Holes\n\nREQUIRED LOADOUT:\n  - Armor:     B-01 Tactical\n  - Primary:   AR-23E Liberator Explosive (Adjudicator)\n  - Secondary: GP-31 Grenade Pistol (Verdict)\n  - Grenade:   G-12 High Explosive (Impact)\n\nREQUIRED STRATAGEMS:\n  - Eagle Strafing Run\n  - Eagle Airstrike\n  - Orbital Precision Strike\n  - RS-422 Railgun\n\nREQUIREMENTS:\n  - Solo\nEXTRACT:      Required` },
     { id: 'level-9', levelTitle: 'LEVEL 9 - PRESTIGE #2: Automaton Hell Strike', details: `MISSION TYPE: Sabotage Supply Bases (Neutralize Orbital Cannons)\n\nOBJECTIVE:    Full Clear\n  - Complete Main Objective\n  - Complete ALL Side Objectives\n  - Destroy ALL Fabricators\n\nREQUIREMENTS:\n  - Solo\n  - No Deaths\n\nREQUIRED LOADOUT:\n  - Armor:     FS-05 Marksman (Exterminator)\n  - Primary:   PLAS-1 Scorcher (Plasma Punisher)\n  - Secondary: P-6 Senator Revolver\n  - Grenade:   G-10 Incendiary (Thermite)\n\nREQUIRED STRATAGEMS:\n  - Eagle Airstrike\n  - Orbital 120MM HE Barrage\n  - RS-422 Railgun\n  - A/MLS-4X Rocket Sentry\n\nEXTRACT:      Required` },
];

// --- Article Data ---
const articles = [ /* ... Article data remains the same ... */
    { id: '1.100', title: '1.100 Articles of Promotion and Recognition', content: `1.101: Recognition of Excellence: Members who demonstrate exemplary service or contributions may be publicly commended by any officer. Recognition must be logged in the appropriate channel for historical record. ⁠📢｜news\n1.102: Eligibility for Promotion: Promotions within the fleet are earned through merit, active participation, and alignment with the clan’s values. Recommendations must come from officers and require a majority vote in the officer corps.\n1.103: Battlefield Promotions: Field promotions may be awarded by an officer to a member displaying outstanding leadership or heroism in the absence of senior leadership. Such promotions are to be ratified within (48) hours. Conduct census in ⁠#unknown for approval by ⁠🔒｜admin.` },
    { id: '2.100', title: '2.100 Articles of Conduct and Discipline', content: `2.101: Respect and Decorum: All fleet members are expected to treat one another with respect and professionalism, regardless of rank. Degrading, insulting, or humiliating fellow members is strictly prohibited. Always elevate the lowest level or newest members, this is the way.\n2.102: Behavior Under Stress: Officers and members must maintain composure during high-pressure scenarios. Expressing frustration is acceptable but must be constructive, with no personal attacks or derogatory remarks, or self depreciation to the point it makes others feel uncomfortable.\n2.103: Chain of Command: Members must respect the chain of command. Disputes or disagreements with an officer’s decisions are to be addressed privately and respectfully. Notify a \`@LOYALTY OFFICER\` to file any reports on GPT Fleet officers.\n2.104: Breach of Discipline: Any member found in violation of conduct articles may face a formal warning conducted by (3) Democracy Officers, and may result in temporary suspension from clan activities, or dismissal from the fleet, depending on the severity of the offense. No one is perfect but we expect you to grow with us.` },
    { id: '3.100', title: '3.100 Articles of Operational Protocol', content: `3.101: Mission Expectations: Members are expected to come prepared for missions with appropriate motivation and a cooperative mindset. Habitual unpreparedness (drama/negativity) may result in exclusion from future operations at the squad leaders discretion.\n3.102: Constructive Feedback: Officers are encouraged to provide constructive feedback to members following missions. Criticism must be solution-oriented and delivered with respect. Consult ⁠#unknown for a census to determine the best approach.\n3.103: Engagement with Command: Members should voice concerns or suggestions regarding fleet operations through designated feedback channels (for social issues, direct message a \`@DEMOCRACY OFFICERS\`), ensuring the community evolves collaboratively while remaining casual.` },
    { id: '4.100', title: '4.100 Articles of Clan Representation', content: `4.101: Fleet Pride: All members represent the Galactic Phantom Taskforce in public matches and forums. Behavior that tarnishes the fleet’s reputation will be met with disciplinary action.\n4.102: Unified Identity: The fleet’s slogans, emblems, and codes are sacred symbols of our unity. Members are expected to honor and preserve this identity during clan engagements.\n4.103: Ambassadorial Conduct: Officers interacting with allied clans must uphold the highest standards of diplomacy and respect, ensuring strong alliances and mutual trust.` },
    { id: '5.100', title: '5.100 Articles of Community Well-Being', content: `5.101: Mental Health and Support: Members struggling with performance or other challenges must be treated with empathy and offered support. Harassment or singling out struggling members is prohibited. Report to your local \`@LOYALTY OFFICER\` for internal affairs.\n5.102: Open Communication: All members, regardless of rank, have the right to voice concerns without fear of retribution. Constructive dialogue is encouraged to address any issues. However if it is about a player, then this is to be handled with respect and reported to an Officer or higher.\n5.103: Conflict Resolution: Internal conflicts must be mediated through the Fleet Mediation Protocol (FMP). (3) designated \`@DEMOCRACY OFFICERS\` will oversee mediations to ensure fairness and resolution then report the resolution if applicable to officer chat.` },
    { id: '6.100', title: '6.100 Articles of Mission Etiquette (Hardcore Missions Only)', content: `6.101: Zero Callouts Warning: All team members must avoid unnecessary or repetitive callouts that clutter communication channels. Critical information should be concise and relevant to the mission. Callout for Heavy enemy types, when Reinforcing, when Marking Target, when Taking Target, when Using Stratagems, when Danger Close @Player, when Fumble (when you drop stratagem), Snitch (enemy scout), and when Death.\n6.102: Focus Main Objective: Mission success depends on prioritizing the Main Objective. Side tasks (Sub Objectives, Enemy Bases) and personal agendas must not interfere with the primary mission goal (average mission completed by (26) minutes left on Super Helldive).\n6.103: Must Obey Orders Given by Officers: Officers have the authority to issue mission-critical orders. Team members are required to comply immediately to maintain unit cohesion and ensure success.\n6.104: Must Take Breaks Given by Officers: Officers may mandate rest periods during prolonged operations to ensure team readiness and reduce mission fatigue. All team members must adhere to these directives.\n- Mandatory Break Between Mission: 300 seconds (5 minutes)\n- Mandatory Break Between Operation: 900 seconds (15 minutes)\n6.105: Voice Comms Must Be Clearly Heard, No Hot Mics: Communication is paramount. Members must ensure their voice comms are clear, concise, and free of background noise. Hot mics or disruptive audio (soundboards) will not be tolerated.\n6.106: Presentation of Articles Before Mission: This article must be presented at the beginning of every Hardcore mission. All participants must review and verbally agree to these standards before proceeding to operation selection.\n6.107: Chain of Command Enforcement: All disputes, grievances, or concerns during missions must follow the chain of command. Respect for officers and fellow members is mandatory at all times, resolve your conflicts in direct messages or elevate the concern to the next tier officer.\nFleet Commander\nDemocracy Officer\nLoyalty Officer\nCommand\n6.108: No Lone Wolf Behavior: Solo actions that deviate from the main mission plan compromise the entire team. Members must stick to the assigned role and coordinate with their squad.\n6.109: Equipment and Loadout Preparedness: Team members are responsible for ensuring their equipment and loadouts meet the mission requirements. Officers may order changes to optimize team performance or forbid stratagems at their discretion.\n6.110: Emergency Protocol Compliance: In case of unexpected mission changes or IRL emergency, all members must adhere to emergency protocols outlined by officers. Quick adaptation and compliance are crucial.\n6.110.1: Real-Life Interruptions: In the event a member needs to step away due to real-life priorities (e.g., emergencies, family, work), they must notify the team immediately via voice or chat if possible. If communication isn’t feasible, the team should hold position or adjust strategies until the member returns or the mission is reassessed by the officer in charge.\n6.110.2: Game Crashes: If a member experiences a game crash, they must attempt to rejoin the mission as soon as possible. The team should focus on securing a safe area to regroup while minimizing risks to the mission (300 second timer started before considered MIA or crashed). Officers may redistribute roles temporarily to compensate for the absence.\n6.110.3: Disconnections: In the case of a disconnection (e.g., internet issues or server drops), the member should rejoin promptly if the platform allows. If rejoining isn’t possible, the team must adjust strategies based on available resources, with officers making decisions to maximize mission success.\n6.110.4: Contingency Planning: Officers should prepare contingency plans for mission-critical roles (e.g., scouts, anti-heavy, or designated roles) to ensure minimal disruption in case of member absence. Backups or role adjustments should be communicated clearly and implemented without hesitation.\n6.110.5: No Penalties for Emergencies: Real-life emergencies, crashes, or disconnections are unavoidable. Members will not be penalized for these occurrences but are expected to communicate and resolve them as swiftly as possible. Chronic or repeated issues without explanation may require review by (3) officers.\n6.110.6: Team Response to Emergencies: Remaining members are expected to maintain composure during emergencies. Avoid placing blame or causing unnecessary tension. Focus on adapting to the situation and following officer directives to achieve the mission objectives despite challenges.` }
];

// --- Helper Function (Using Class Names) ---
const renderArticleContent = (content: string) => {
    // Split logic remains the same...
    const subArticles = content.trim().split(/\n(?=\d\.\d{3,}(?:\.\d+)?:\s*)/);

    return subArticles.map((subArticleText, index) => {
        const lines = subArticleText.trim().split('\n');
        const titleLine = lines[0] || '';
        let contentLines = lines.slice(1);

        const titleMatch = titleLine.match(/^(\d\.\d{3,}(?:\.\d+)?):\s*(.*)/);
        const subArticleNumber = titleMatch ? titleMatch[1] : '';
        const subArticleName = titleMatch ? titleMatch[2] : titleLine;
        const titleClassName = subArticleNumber.includes('.') && subArticleNumber.split('.').length > 2
            ? styles.subsubsectionTitle // Use CSS module class
            : styles.subArticleTitle;   // Use CSS module class

        let chainOfCommandList: string[] = [];
        const chainStartIndex = contentLines.findIndex(line => line.trim() === 'Fleet Commander');
        if (subArticleNumber === '6.107' && chainStartIndex !== -1) {
            const potentialChain = contentLines.slice(chainStartIndex);
            const expectedChain = ['Fleet Commander', 'Democracy Officer', 'Loyalty Officer', 'Command'];
            if (potentialChain.length >= expectedChain.length &&
                potentialChain.slice(0, expectedChain.length).every((line, i) => line.trim() === expectedChain[i]))
            {
                chainOfCommandList = potentialChain.slice(0, expectedChain.length);
                contentLines.splice(chainStartIndex, expectedChain.length);
            } else {
                chainOfCommandList = [];
            }
        }

        return (
            <div key={`${subArticleNumber}-${index}`} className={styles.subArticleContent}>
                <h4 className={titleClassName}>
                    {subArticleNumber && `${subArticleNumber}: `}
                    <strong className={styles.textStrong}>{subArticleName}</strong> {/* Use module class */}
                </h4>
                {contentLines.map((line, lineIndex) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('- ')) {
                         const itemText = trimmedLine.substring(2);
                         const boldMatch = itemText.match(/^(\*\*.*?\*\*):?\s*/);
                         const boldPart = boldMatch ? boldMatch[1].slice(2,-2) : null;
                         const restOfText = boldMatch ? itemText.substring(boldMatch[0].length) : itemText;
                         const parts = restOfText.split(/(`.*?`)/g).map((part, partIndex) => {
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={partIndex} className={styles.inlineCode}>{part.slice(1, -1)}</code>; // Use module class
                              } return part; });
                         return (
                             <ul key={lineIndex} className={`${styles.styledList} ${styles.none}`} style={{paddingLeft: '0.5rem'}}>
                                <li className={styles.listItem}> {/* Use module class */}
                                   {boldPart && <strong className={styles.listItemStrong}>{boldPart}:</strong>} {/* Use module class */}
                                   {parts}
                                </li>
                             </ul>
                         );
                    }
                    else if (chainOfCommandList.length > 0 && chainOfCommandList.includes(trimmedLine)) {
                        return null;
                    }
                    else if (trimmedLine) {
                         const parts = trimmedLine.split(/(`.*?`)/g).map((part, partIndex) => {
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={partIndex} className={styles.inlineCode}>{part.slice(1, -1)}</code>; // Use module class
                              } return part; });
                         if (parts.join('').trim()) {
                             return <p key={lineIndex} className={styles.textParagraph}>{parts}</p>; // Use module class
                         }
                    }
                    return null;
                 }).filter(Boolean)}

                 {chainOfCommandList.length > 0 && (
                     <div className={styles.chainOfCommandList}> {/* Use module class */}
                         {chainOfCommandList.map((part, partIndex) => (
                             <div key={partIndex} className={styles.chainOfCommandItem} style={{ paddingLeft: `${partIndex * 1}rem` }}>
                                 {partIndex > 0 && <span className={styles.chainOfCommandArrow}></span>} {/* Use module class */}
                                 {part.trim()}
                             </div>
                         ))}
                     </div>
                 )}
            </div>
        );
    });
};


// --- Main Component ---
export default function AcademyPage() {
    const discordServerLink = "https://discord.gg/gptfleet"; // Keep this link

    // State for challenge level expansion
    const [expandedChallenges, setExpandedChallenges] = useState<Record<string, boolean>>({});
    // State for Code of Conduct expansion
    const [isConductExpanded, setIsConductExpanded] = useState(false);

    // Toggle function for challenge expanders
    const toggleChallengeExpansion = (challengeId: string) => {
        setExpandedChallenges(prev => ({
            ...prev,
            [challengeId]: !prev[challengeId]
        }));
    };

    // Toggle function for Code of Conduct
    const toggleConductExpansion = () => {
        setIsConductExpanded(prev => !prev);
    };


    // --- Render Logic (Using CSS Modules) ---
    return (
        <main className={styles.academyMainContainer}>
            <h1 className={styles.academyPageTitle}>GPT HD2 Academy</h1>

            {/* --- Academy Introduction --- */}
            <section className={styles.contentSection}>
                <h2 className={styles.contentSectionTitle}>Welcome Helldiver!</h2>
                <p className={styles.textParagraph}> The GPT Fleet Academy is your primary training ground for becoming an effective Helldiver within our ranks. Here, you'll learn the core principles, operational protocols, and the code that binds our fleet together. </p>
                <p className={styles.textParagraph}> Whether you're mastering basic stratagems, learning advanced squad tactics, or preparing for the demanding <strong className={styles.textStrong}>John Helldiver Course</strong> (details found on the <Link href="/helldivers-2" className={styles.textLink}>Home</Link>) page, the Academy provides the foundation. Our goal is not just victory, but victory achieved with honor, discipline, and camaraderie. </p>
                <p className={styles.textParagraph}> Familiarize yourself with the <strong className={styles.textStrong}>GPT Fleet Code of Conduct</strong>, detailed in the expandable section below. Understanding and adhering to these articles is mandatory for all members seeking progression and participation in organized fleet operations. For Super Earth! </p>
            </section>

            {/* --- Enrollment Section --- */}
            <section className={styles.contentSection}>
                <h2 className={styles.contentSectionTitle}>Enrollment Window</h2>
                <p className={styles.textLargeHighlight}> Enrollment closes at the end of the current month. </p>
                <p className={styles.textParagraph}> Begin your journey to leadership within the GPT Fleet. This cycle repeats monthly. </p>
            </section>

            {/* --- Cadet Training Program Section --- */}
            <section className={styles.contentSection}>
                <h2 className={`${styles.contentSectionTitle} ${styles.withBorderBottom}`}>Cadet Training Program</h2>
                {/* Phase 1 */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Phase 1: Cadet Orientation (7 Days)</h3>
                    <p className={styles.textParagraph}> Achieve <strong className={styles.textStrong}>Class A Citizen</strong> status by meeting initial standards. </p>
                    <ul className={`${styles.styledList} ${styles.disc}`}>
                        <li className={styles.listItem}>Complete 1 Operation OR 3 recorded missions with a <code className={styles.inlineCode}>@DEMOCRACY OFFICERS</code> or <code className={styles.inlineCode}>@FLEET COMMANDER</code>.</li>
                    </ul>
                    <p className={`${styles.textItalic} ${styles.textParagraph}`}> We aim to get you a place on the leaderboard! </p>
                </div>
                {/* Phase 2 */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Phase 2: Mission Readiness (14 Days)</h3>
                    <p className={styles.textParagraph}> Complete <strong className={styles.textStrong}>10 missions</strong> or <strong className={styles.textStrong}>3 operations</strong> under guidance of assigned <code className={styles.inlineCode}>@DEMOCRACY OFFICERS</code> or <code className={styles.inlineCode}>@FLEET COMMANDER</code>. </p>
                    <p className={styles.textParagraph}> Missions can be completed as duos to practice assessing and recruiting randoms. </p>
                </div>
                {/* Phase 3 */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Phase 3: Officer Review & Promotion (End of Cadet Training)</h3>
                    <p className={styles.textParagraph}> Cadets completing Phase 2 schedule a 1-hour VC Officer Interview/Onboarding. </p>
                    <p className={styles.textParagraph}> Interview Panel: Cadet, assigned DO/FC, <strong className={styles.textStrong}>PrizedRichard</strong>, and a third party. </p>
                    <p className={styles.textParagraph}> Cadets coordinate scheduling with their DO/FC and <strong className={styles.textStrong}>PrizedRichard</strong> (Timezone: GMT). </p>
                </div>
            </section>

            {/* --- Fleet Commander Development Section (Refactored) --- */}
            <section className={styles.contentSection}>
                <h2 className={styles.contentSectionTitle}>Fleet Commander Promotion & Development</h2>
                <p className={styles.textParagraph}> Congratulations upon completion of Cadet training and promotion to <code className={styles.inlineCode}>@FLEET COMMANDER</code>! Your development towards Democracy Officer begins now. </p>
                <p className={styles.textParagraph}> You will be assessed during a <strong className={styles.textStrong}>28-day mentorship period</strong> starting from your promotion date. </p>
                {/* Use subsection card for duties */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Duties & Focus Areas:</h3>
                    <ul className={`${styles.styledList} ${styles.disc}`}>
                        <li className={styles.listItem}>Assist with the development of newer members, helping them get involved and gain Class A citizenship.</li>
                        <li className={styles.listItem}>Assist with the next intake/class of Cadets in their training phases.</li>
                        <li className={styles.listItem}>Support Alliance relations, engaging with current Alliance members and potentially assisting with outreach to new ones.</li>
                    </ul>
                </div>
            </section>

            {/* --- Phase 4 DO Promotion Review (Refactored) --- */}
            <section className={styles.contentSection}>
                <h2 className={styles.contentSectionTitle}>Phase 4: Democracy Officer Promotion Review</h2>
                {/* Use subsection card for the content */}
                <div className={styles.subsectionCard}>
                    <p className={styles.textParagraph}> <code className={styles.inlineCode}>@FLEET COMMANDER</code> who demonstrate readiness and are nominated by their <code className={styles.inlineCode}>@DEMOCRACY OFFICERS</code> will schedule a Moderation Review. </p>
                    <p className={styles.textParagraph}> A promotion board consisting of three <code className={styles.inlineCode}>@LOYALTY OFFICER</code> members will evaluate the candidate for potential promotion to <strong className={styles.textStrong}>DEMOCRACY OFFICER</strong>. </p>
                 </div>
            </section>

            {/* --- Field Promotions Section --- */}
            <section className={styles.contentSection}>
                <h2 className={`${styles.contentSectionTitle} ${styles.withBorderBottom}`}>Earning Field Promotions</h2>
                <p className={styles.textParagraph}> Field promotions within GPT are a mark of excellence, dedication, and leadership beyond the standard training path. Here’s how they work: </p>
                {/* Step 1 */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Step 1: Excel & Earn the John Helldiver Award</h3>
                    <p className={styles.textParagraph}> Mastering the Solo Tier List challenges (found on the <Link href="/helldivers-2" className={styles.textLink}>main Helldivers page</Link>) and earning the prestigious <strong className={styles.textStrong}>John Helldiver Award</strong> is the first step to standing out. </p>
                    <p className={`${styles.textItalic} ${styles.textParagraph}`}> This achievement highlights your skills and commitment. We notice members who excel, demonstrating skill and thriving in our collaborative environment. </p>
                </div>
                {/* Step 2 */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Step 2: Recommendations for Promotion</h3>
                    <p className={styles.textParagraph}> Promotions often arise from recommendations by officers based on contributions and potential: </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}> {/* Simple internal layout */}
                        <div>
                            <h4 className={styles.subsubsectionTitle}>Fleet Commander to Democracy Officer:</h4>
                            <p className={styles.textParagraphSmallIndent}><code className={styles.inlineCode}>@LOYALTY OFFICER</code> members play a critical role, putting forward recommendations to the 10-Star General for discussion.</p>
                        </div>
                        <div>
                            <h4 className={styles.subsubsectionTitle}>Class A Citizen to Fleet Commander:</h4>
                            <p className={styles.textParagraphSmallIndent}>A <code className={styles.inlineCode}>@DEMOCRACY OFFICERS</code> can recommend a Citizen, subject to approval by the 10-Star General commanding the fleet.</p>
                        </div>
                        <div>
                            <h4 className={styles.subsubsectionTitle}>Loyalty Officer Promotions:</h4>
                            <p className={styles.textParagraphSmallIndent}>This distinct honor is reserved for those consistently demonstrating outstanding loyalty and contributions. Promotions are made at the discretion of the 10-Star General to recognize individuals who go above and beyond.</p>
                        </div>
                    </div>
                </div>
                {/* Final Thoughts */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Final Thoughts on Field Promotions</h3>
                    <p className={styles.textParagraph}> Field promotions aren’t just about rank—they’re about earning the respect and trust of the community. Every step rewards dedication, skill, and the spirit of teamwork. Strive for excellence; the GPT Fleet takes notice. </p>
                </div>
            </section>

            {/* --- Other Options / Info Section --- */}
            <section className={`${styles.contentSection} ${styles.optionsGrid}`}> {/* Apply grid class */}
                {/* Resignation Option */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Resignation Option</h3>
                    <p className={styles.textParagraph}> Members may choose to resign at any stage of training while retaining their <strong className={styles.textStrong}>Class A Citizen</strong> status or <strong className={styles.textStrong}>Fleet Commander</strong> position, title, and duties within our community. </p>
                </div>
                {/* Monthly Cycle */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Monthly Progression Cycle</h3>
                    <ul className={`${styles.styledList} ${styles.none}`}>
                        <li className={styles.listItem}><strong className={styles.listItemStrong}>Enrollment:</strong> 30-day sign-up period</li>
                        <li className={styles.listItem}><strong className={styles.listItemStrong}>Training (Cadet):</strong> 30-day completion window (Phases 1-3)</li>
                        <li className={styles.listItem}><strong className={styles.listItemStrong}>Graduate (Fleet Commander):</strong> 28-day mentorship</li>
                        <li className={styles.listItem}><strong className={styles.listItemStrong}>Democracy Officer:</strong> Post-review service</li>
                        <li className={styles.listItem}><strong className={styles.listItemStrong}>Phantom (Retired Officer):</strong> Post-active duty</li>
                        <li className={styles.listItem}><strong className={styles.listItemStrong}>Admin:</strong> 90-day term</li>
                        <li className={styles.listItem}><strong className={styles.listItemStrong}>Staff:</strong> Application-based</li>
                    </ul>
                </div>
            </section>

             {/* --- Collapsible Code of Conduct Section --- */}
            <div className={styles.collapsibleSection}>
                <div
                    className={`${styles.collapsibleHeader} ${!isConductExpanded ? styles.noBorder : ''}`}
                    onClick={toggleConductExpansion}
                    role="button" aria-expanded={isConductExpanded} aria-controls="code-of-conduct-content"
                    tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleConductExpansion()}
                >
                    <div>
                        <h2 className={styles.collapsibleTitle}>GPT Fleet Code of Conduct</h2>
                        <p className={styles.collapsibleSummary}>Click to expand/collapse the Core Articles</p>
                    </div>
                    <FaChevronDown className={`${styles.expandIcon} ${isConductExpanded ? styles.rotated : ''}`} aria-hidden="true"/>
                </div>
                <div
                    id="code-of-conduct-content"
                    className={`${styles.collapsibleContent} ${isConductExpanded ? styles.expanded : ''}`}
                >
                    <div className={styles.collapsibleContentWrapper}>
                        {articles.map(article => (
                            <div key={article.id}>
                                <h3 className={styles.articleTitle}>{article.title}</h3>
                                {renderArticleContent(article.content)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>


             {/* --- John Helldiver Course Section --- */}
             <section className={styles.contentSection}>
                 <h2 className={styles.contentSectionTitle}>John Helldiver Course & Challenges</h2>
                 <p className={`${styles.textParagraph} ${styles.textItalic}`} style={{textAlign: 'center', marginBottom: '2rem'}}> <strong className={styles.textStrong}>NO SEED FARMING</strong> - HELLDIVERS DO NOT CHERRY PICK MISSIONS TO WIN, WE JUST WIN. </p>
                 <p className={styles.textParagraph}> Ready to prove your mettle, Helldiver? The John Helldiver Course is a series of increasingly difficult solo challenges designed to test your skill, strategy, and adherence to Super Earth protocol. You MUST submit your videos in the <code className={styles.inlineCode}>#🪖｜training</code> channel on our Discord for review and verification by <code className={styles.inlineCode}>@JOHN HELLDIVER</code>. Respect the community and the challenge rules, or face the consequences (potentially airlocking). </p>
                 {/* Use subsection card for Rules */}
                  <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Rules & Requirements:</h3>
                    <ul className={`${styles.styledList} ${styles.decimal}`}> {/* Changed to decimal for numbered list */}
                        <li className={styles.listItem}>If it's on the map, it's in play. This includes SEAF Artillery, SAM sites, static Machine Gun emplacements, discoverable Ammo caches, Break Action Shotguns found in the world, and all mission-specific stratagems (e.g., Hellbomb, Seismic Probe Drill, etc.), *unless* the specific challenge level states otherwise.</li>
                        <li className={styles.listItem}>Video submissions must be one continuous, unedited recording of the entire mission attempt from start to finish (including loading screens if possible, definitely the results screen). No cuts, splits, speed-ups, additional commentary clips, or meme edits are allowed within the gameplay footage.</li>
                        <li className={styles.listItem}>Mission privacy must be set to <strong className={styles.textStrong}>Invite Only</strong> to ensure a true solo attempt without random joiners.</li>
                    </ul>
                 </div>

                {/* Use subsection card for Difficulty Order */}
                <div className={styles.subsectionCard}>
                    <h3 className={styles.subsectionTitle}>Order of Difficulty (Super Helldive - Difficulty 10):</h3>
                    <p className={styles.textParagraph}>Target enemy faction: Automaton (Bots) or Terminids (Bugs).</p>

                    {/* Challenge Levels as Expanders */}
                    {challengeLevels.map((challenge) => {
                        const isExpanded = !!expandedChallenges[challenge.id];
                        return (
                            <div key={challenge.id} className={styles.challengeLevelContainer}>
                                <div
                                    className={`${styles.challengeHeader} ${isExpanded ? '' : styles.noBorderBottom}`}
                                    onClick={() => toggleChallengeExpansion(challenge.id)}
                                    role="button" aria-expanded={isExpanded} aria-controls={`challenge-content-${challenge.id}`}
                                    tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleChallengeExpansion(challenge.id)}
                                >
                                    <h4 className={styles.challengeLevelTitle}>{challenge.levelTitle}</h4>
                                    <FaChevronDown className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`} aria-hidden="true"/>
                                </div>
                                <div
                                    id={`challenge-content-${challenge.id}`}
                                    className={`${styles.challengeDetailsContent} ${isExpanded ? styles.expanded : ''}`}
                                >
                                    <pre className={styles.codeBlock}>{challenge.details}</pre>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* --- Closing Statement --- */}
            <p className={styles.closingText}>
                Thank you for your dedication and passion. Together, we ensure the future strength and leadership of the GPT Fleet and uphold the ideals of our alliance.
            </p>
        </main>
    );
}