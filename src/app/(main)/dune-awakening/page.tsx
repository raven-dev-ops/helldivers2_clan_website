// src/app/(main)/dune-awakening/page.tsx
"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaDiscord, FaStar } from 'react-icons/fa';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Navigation, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';


// --- Data Structure ---

interface Ability {
    name: string;
    description: string;
    details?: string;
}

interface EquipmentCategory {
    category: string;
    description: string;
}

interface DuneClass {
    id: string;
    name: string;
    lore: string;
    abilities: Ability[];
    combatStyleSolo: string;
    combatStyleGroup: string;
    pveStrategies: string;
    pvpStrategies: string;
    equipment: EquipmentCategory[];
    pros: string[];
    cons: string[];
    recommendedFor: string;
    summary: string;
}

// --- Dune Class Data ---
const duneClasses: DuneClass[] = [
    // ... (keep existing duneClasses data)
     {
        id: 'swordmaster',
        name: 'Swordmaster',
        summary: 'Elite Ginaz warrior excelling in honorable melee combat, tanking, and dueling.',
        lore: `The Swordmaster represents an elite warrior from the fallen Ginaz School, revered across the Imperium for unmatched fighting prowess. In Dune lore, Ginaz Swordmasters were famed duelists and bodyguards; in Dune: Awakening’s alternate timeline, they are renowned close-combat specialists. They emphasize honor and discipline in battle. Swordmasters are often compared to traditional MMO “warriors” or tanks, given their stalwart melee combat style. Lore-wise, people respect and fear Swordmasters for skills that surpass ordinary soldiers.`,
        abilities: [
            { name: 'Deflection (Starting Ability)', description: 'Enter a defensive stance to deflect incoming dart projectiles.', details: 'Acts as a temporary shield against ranged attacks, reflecting or negating darts. Moderate cooldown. Synergy: Pairs well with melee charges – deflect an enemy’s opening shot, then rush in.' },
            { name: 'Knee Charge', description: 'A lunging melee attack that knocks down or staggers an enemy, opening them up to a finisher.', details: 'Deals damage and briefly stuns. Great for closing gaps or initiating fights, allows follow-up finishers. Doubles as mobility, usable mid-air.' },
            { name: '(Speculative) Additional Melee Maneuvers', description: 'Hints suggest numerous dashes and other melee skills.', details: 'May include upgraded deflections (e.g., "Slow Deflection") or other combo/mobility abilities.' },
        ],
        combatStyleSolo: `Durable frontline fighters. Use Deflection to survive initial gunfire and close distance. Excel at duels. Use agility (dashes, charges) against groups, picking off targets one by one. Strong solo PvE due to survivability.`,
        combatStyleGroup: `Often acts as the tank or initiator. Lead the charge, draw enemy attention, soak damage with defenses. Knee charge peels enemies off allies or sets up focus targets. Provides frontline pressure and protection.`,
        pveStrategies: `Leverage defenses to close distance. Open with Deflection against ranged foes. Knee Charge to disable one target, then finish. Use mobility to dodge heavy attacks. Against multiple enemies, position Deflection carefully and keep moving. In tough encounters, play to tankiness, draw aggro, trust sustained melee damage.`,
        pvpStrategies: `Shines in close combat and as a breacher. Gap-close under fire using Deflection to reflect shots. Zig-zag or use cover, then Knee Charge to knock down players and finish. Be mindful of kiting; use line-of-sight and cooldowns. In groups, initiate, disrupt formations. Vulnerable to snipers without Deflection; ambush using terrain. Balance patience and aggression.`,
        equipment: [
            { category: 'Weapons', description: 'Any melee weapons (crysknives, swords, daggers, maker hooks). Iconic: dueling blade/knife. Carry a sidearm (pistol/dartgun) for ranged situations.' },
            { category: 'Armor', description: 'Gear enhancing close-combat survivability. Personal Shield Belt highly recommended (strong vs bullets, weak vs melee). Heavy or Medium armor balancing protection and mobility. Upgraded Stillsuit essential for resilience.' },
            { category: 'Mods & Tech', description: 'Mods boosting melee damage, stamina, shield durability (e.g., poison edge knife). Throwing knives/grenades can help soften groups.' },
        ],
        pros: [
            'Exceptional Close-Combat Power: Top-tier melee damage and finishers.',
            'High Survivability: Deflection acts as temporary shield, good armor/shields enable tanking.',
            'Mobility: Surprising agility with dashes/leaps like Knee Charge.',
            'Group Utility: Initiates fights, controls enemy focus, protects allies (pseudo-tank).',
        ],
        cons: [
            'Limited Range: Vulnerable until closing the gap, can be kited.',
            'Relies on Timing & Skill: Requires precise use of defenses and charges.',
            'Less Utility Outside Combat: Primarily combat-focused.',
            'At Risk vs. Melee Crowd Control: Lacks ranged fallback if stunned/rooted.',
        ],
        recommendedFor: `Players who enjoy "Tank" or frontline melee playstyles, being in the thick of battle, trading blows, protecting the team. Great for solo players wanting durability. Ideal for warrior/barbarian archetypes.`,
    },
    {
        id: 'bene-gesserit',
        name: 'Bene Gesserit',
        summary: 'Masters of manipulation and finesse, using the Voice, stealth, and agility.',
        lore: `Based on the shadowy all-female order, a secretive sisterhood with superhuman physical/mental training (prana-bindu) and influence via "the Voice," truthsense, and martial arts. In-game, the class (open to all genders) embodies physical mastery and manipulation, akin to "witches" or monks. They use subtlety and control over brute strength, fitting a controller/support archetype with a deadly edge.`,
        abilities: [
            { name: 'Voice: Compel (Starting Ability)', description: 'Use The Voice to force a target to move towards you against their will.', details: 'Long-range mind-control pull. Isolates enemies, interrupts actions. Synergy: Combine with melee – compel an enemy close, then stab them. Moderate cooldown, may not work on all targets.' },
            { name: 'Invisibility (Speculative/Previewed)', description: 'Ability to turn invisible or highly conceal oneself.', details: 'Reflects stealth training. Allows sneaking, ambushing. Likely a timed cloak or blend-into-shadows skill.' },
            { name: 'Prana Bindu Dash (Teased)', description: 'A "superhuman dash" – burst of speed or swift dodge.', details: 'Reflects extreme reflexes. Short-range teleport-like move or rapid strafe. Used for dodging or closing gaps. Short cooldown.' },
            { name: 'Internal Alchemy (Passive/Speculative)', description: 'Physiological control granting passive benefits.', details: 'May include poison resistance or enhanced effects from spice ("the more spice you take... the more powerful"). Could boost abilities or grant unique effects.' },
            { name: '(Future) Nerve Strike / Psychic Suggestion', description: 'Possible future abilities fitting the theme.', details: 'Nerve Strike (paralyzing melee), Psychic Suggestion (stun/confuse).' },
        ],
        combatStyleSolo: `Tactical and agile. Control the flow of combat using stealth and surprise. Use Voice: Compel to isolate targets for easy kills ("divide and conquer"). Vulnerable if faced head-on by multiple foes. Capable in melee (Weirding Way martial arts).`,
        combatStyleGroup: `Support/control role. Neutralize key threats by Compelling dangerous enemies into kill zones. Use Voice or truthsense for debuffs/intel. Not highest damage, but makes fights easier by manipulating enemies. Can act as secondary melee DPS. Battlefield puppeteer.`,
        pveStrategies: `Patience and planning. Scout, use Voice: Compel to pull single NPCs away for quiet kills. Use Invisibility for stealthy first strikes or positioning. Engage one enemy at a time. Use mobility (dash) to evade attacks. Exploit environment (ledges, traps). Against bosses, debuff/distract (Voice interrupt?), use agility, possibly spice boosts. Consider learning skills from other disciplines for versatility.`,
        pvpStrategies: `Master of ambush and mind games. Stealth-gank using invisibility. Open with Voice: Compel to remove enemy control and pull them from cover, follow up with burst damage. Play bait in groups, using Voice on rushers. Stay mobile, avoid direct firefights. Outmaneuver heavy melee opponents (confuse with Voice/stun, backstab). Use spice for combat boosts. Isolate targets, strike from shadow. Target enemy supports in group PvP. Cons: low HP, vulnerable to focus fire.`,
        equipment: [
            { category: 'Weapons', description: 'Light, close-range weapons. Knives/daggers (thematic, Gom Jabbar reference). Crysknife potent choice. Silent/quick dart guns or pistols, possibly with poison. Toxin-coated weapons fit the theme.' },
            { category: 'Armor', description: 'Light armor or robes for maximum agility ("Weirding Way suit," light combat stilgar). Avoid heavy encumbrance. Personal Shield possible, but may interfere with stealth. High-quality Stillsuit crucial for scouting.' },
            { category: 'Tools', description: 'Spice amplifiers, infiltration gadgets (sound distraction devices). Truthsayer elixir (if exists) for detection. Grenades/flash bombs for emergencies. Gear augmenting subtlety/speed (camouflage, muffling boots, antidotes).' },
        ],
        pros: [
            'Powerful Crowd Control: The Voice is a potent manipulation tool.',
            'High Mobility & Stealth: Hard to pin down with invisibility and dashes.',
            'Enhanced Melee Skills: Refined and deadly close combat ability.',
            'Scales with Spice (Potentially): Can become very powerful with spice intake.',
            'Versatile Support in Groups: Unique mix of debuffs and manipulation valuable for teams.',
        ],
        cons: [
            'Fragile if Caught: Low durability, relies on not getting hit.',
            'High Skill Ceiling: Rewards clever play, unforgiving of mistakes.',
            'Limited Large-AoE Damage: Struggles against hordes, tools are single-target focused.',
            'Resource Reliance: Potential dependence on spice, ability costs.',
            'Learning Curve in Team Dynamics: Requires coordination for optimal effect.',
        ],
        recommendedFor: `Players who enjoy stealth, deception, support/control. Rogues/enchanters from other games. Those valuing strategy over brute force. Stealth and assassin players in PvP. Lore enthusiasts wanting to wield the Voice. Not for players seeking simple combat or tanking.`,
    },
    {
        id: 'mentat',
        name: 'Mentat',
        summary: 'Human computers focused on recon, strategy, and technology (turrets, drones).',
        lore: `Mentats are human computers trained for superhuman cognitive tasks in a world without AI. They represent the Recon & Strategy archetype, coming from the Order of Mentats. Lore-wise, they serve as master strategists and advisors. In-game, they excel at gathering information, planning, and using gadgets/traps. Framed as very useful in groups ("recommended one of you play a Mentat"), acting as support/tactician/engineer.`,
        abilities: [
            { name: 'The Sentinel (Starting Ability)', description: 'Deploy a suspensor-buoyed dart projector turret with motion detection.', details: 'Placeable turret for area denial and defense. Covers flanks, fortifies positions. Fires automatically at moving enemies. Duration or ammo limited. Kite enemies into its range.' },
            { name: 'Battlefield Calculation (Scan)', description: 'Scan nearby enemies and objects for information.', details: 'Provides HUD readouts (health, weaknesses, status?). Marks objects/traps. Ultimate situational awareness. Short cooldown or toggle. Helps focus fire and exploration.' },
            { name: 'Hunter Seeker Drone', description: 'Deploy and control a small stealth assassination drone.', details: 'First-person controlled drone. Silently kills unaware/stationary targets with a single dart. Highlights moving targets. Limited range, expires after use/miss. Stealth takedown option.' },
            { name: 'Shield Wall (Defensive Gadget/Datamined)', description: 'Potentially deployable cover or energy shield.', details: 'Could be a static force-field barrier for temporary cover. Blocks incoming fire. Useful under ambush or holding points.' },
            { name: 'Recon Drone (Speculative)', description: 'Possible scouting drone for intel gathering.', details: 'Less lethal than Hunter Seeker. Might tag enemies or share radar info. Could enhance vehicle scanners.' },
            { name: 'Passive Analytical Enhancements', description: 'Likely passives improving intel gathering or crafting.', details: 'Bonus loot from scanned items, efficient tech crafting, deciphering data.' },
        ],
        combatStyleSolo: `Tactical combatants preferring preparation and position. Approach encounters like puzzles: scout, use Hunter Seeker for initial kill, set up Sentinel turret, lure enemies into crossfire. Rely on outsmarting AI. Harder solo start, need careful positioning. Fight on your terms with traps and foreknowledge.`,
        combatStyleGroup: `Shines as a support engineer/strategist. Scan areas to warn team (radar). Deploy Sentinel turret for extra DPS/cover. Use Shield Wall for protection. Coordinate intel buffs (mark targets, share weak points). Amplify team effectiveness, ensure info flow. Field commander role.`,
        pveStrategies: `Plan and prepare. Scan areas with Battlefield Calculation. Start encounters with Hunter Seeker kill if possible. Place Sentinel strategically. Fight near turret. Use cover. Deploy Shield Wall when overwhelmed. Leverage intel on weaknesses. Use crafted explosives/traps. Make fights asymmetrical. Scan for resources constantly. Big bosses challenging; focus on support/scanning patterns.`,
        pvpStrategies: `Support/sniper hybrid. Challenging in 1v1 vs aggressors. Use information and surprise. Get jump with Hunter Seeker on stationary targets. Drop Sentinel turret immediately in fights (make it 2v1). Kite melee around turret. Use Shield Wall vs ranged fire. Move unpredictably. Play quarterback in groups: coordinate via scans, mark targets, drop turrets for zoning. Use intel to identify weak players. Combine abilities with vehicles (ornithopter scanning). Counter stealth with scans (potentially). Out-think and out-position opponents.`,
        equipment: [
            { category: 'Weapons', description: 'Reliable mid- to long-range firearms. Dart rifle or sniper rifle pairs well with recon. Pistol/SMG sidearm. Knife for emergencies/stealth.' },
            { category: 'Armor', description: 'Medium armor or tactical bodysuit. Balance protection and mobility. Gear with tech slots/gadget capacity. Personal Shield useful for deploying devices under fire.' },
            { category: 'Tools & Gadgets', description: 'Bread and butter. Mines, traps, scanners. Hacking tools (if exist). Rangefinder/binoculars. Vehicles fitted with scanners/comms. Intel gear (upgraded visors). Stock up on consumables (drones, turret ammo?).' },
        ],
        pros: [
            'Unmatched Battlefield Intelligence: Superior situational awareness via scans.',
            'Strong Zoning & Defense via Gadgets: Turrets provide area control and extra firepower.',
            'One-shot Kill Potential: Hunter Seeker offers unique assassination capability.',
            'Team Utility and Support: Enhances team effectiveness with intel, buffs, defenses.',
            'Adaptability: Can learn other skills; own tree offers diverse tools (stealth, defense, scan).',
        ],
        cons: [
            'Low Direct Damage & Fragility Early: Weak start without gadgets ready.',
            'Gadget Dependency: Effectiveness tied to devices; vulnerable if destroyed/depleted.',
            'High Skill and Multitasking: Requires managing multiple systems during combat.',
            'Less "burst" and frontline presence: Relies on setup and support, not direct brawling.',
            'Potential Resource/Inventory Strain: Gadgets may require crafting/inventory space.',
        ],
        recommendedFor: `Players who enjoy Support/Engineer/Strategist roles. Those who love planning, traps, gadgets (engineers, hunters/rangers). Players prideful in outsmarting opponents. Shot-callers in groups. Support snipers. Not for direct action seekers. Choose if being the team's brain with cool tech appeals more than raw power.`,
    },
    {
        id: 'trooper',
        name: 'Trooper',
        summary: 'Conventional soldiers focused on offense, demolition, and mobility via grappling hook.',
        lore: `Embodies the rank-and-file Landsraad House soldiers (Atreides infantry, Harkonnen shock troops). Backbone of military formations, trained in conventional combat. Focuses on Offense & Demolition. Closest to "soldier" or "ranged DPS" archetype. Specializes in weapons (guns, explosives) and brute-force tactics. Straightforward, combat-effective start.`,
        abilities: [
            { name: 'Shigawire Cable (Starting Ability)', description: 'Shoot a barb on a line to rapidly pull yourself to a surface.', details: 'Grappling hook for exploration and combat. Reach high ledges, cross gaps, gap-close, escape. Short cooldown encourages repositioning. Likely limited to surfaces initially.' },
            { name: 'Grenades / Explosives', description: 'Likely active skills related to throwing grenades or setting charges.', details: 'Core focus on demolition. Expect Frag Grenade ability or similar. May have traits boosting explosive damage/radius or ability to carry more.' },
            { name: 'Shigawire Claw (Alternate Grapple)', description: 'Possible grappling hook variant or upgrade.', details: 'Mentioned in exploration blog. Might allow grappling creatures/players, pulling enemies (Scorpion style), or entangling.' },
            { name: 'Suppressive Fire / Heavy Weapon Training (Speculative)', description: 'Possible skill boosting rate of fire, damage, or heavy weapon use.', details: 'Could be "Adrenaline Rush" (reload/recoil boost) or "Suppressive Stance." Might use lasguns/rifles more effectively.' },
            { name: 'Demolition Charge (Speculative)', description: 'Possible ability to set charges damaging structures/vehicles.', details: 'Fits siege/demolition theme. Useful for breaching or destroying objectives.' },
            { name: 'Close-Combat Training (Speculative)', description: 'Basic melee capability.', details: 'Maybe bayonet charge, buttstroke, or simple "Brutal Strike" knockback.' },
        ],
        combatStyleSolo: `Straightforward and effective. Rely on weapons and high damage. Initiate from range, use grenades on groups, finish with bullets. Grappling hook controls engagement range (retreat or close distance). Versatile solo combatant, needs ammo management.`,
        combatStyleGroup: `Primary DPS role. Heavy consistent damage. Burn down targets held by tank. Handle demolition objectives. Area damage with grenades/spray fire. Workhorse of combat, reliable damage output. Coordinated fire in groups is effective.`,
        pveStrategies: `Keep moving and shooting. Dictate encounters. Start at max range. Use Shigawire Cable proactively (reach sniper nests, kite melee enemies). Use grenades liberally on clumps. Circle-strafe tough foes, hit weak points (grapple behind?). Keep weapons upgraded. Use grapple to escape environmental threats (sandworms). Handle ambushes well with repositioning.`,
        pvpStrategies: `Run-and-gun shooter style. Use mobility and DPS. Play to weapon range (snipe from high ground, grapple close for shotgun). Outflank opponents using grapple. Keep distance from melee threats (grapple away, use knockback grenades). Be wary of Bene Gesserit Voice (keep distance, use grenades?). Focus fire in groups. Use demolition on fortifications. Vertical mobility is key. Watch ammo/reloads. Use varied ammo types (AP, HE).`,
        equipment: [
            { category: 'Weapons', description: 'Masters of firearms. Assault rifles, sniper rifles, shotguns, SMGs. Projectile weapons (dart guns, maula pistols), lasguns possible. Carry multiple weapons for different ranges. Explosives (grenades). Knife backup.' },
            { category: 'Armor', description: 'Combat armor for solid protection (House uniforms, CHOAM Assault gear?). High defense preferred, watch weight. Shield Belt useful vs ranged, risky vs melee.' },
            { category: 'Mods & Utilities', description: 'Weapon attachments (scopes, stabilizers). Spice-infused ammo? Ammo packs/restock items. Detonators/breaching charges. Upgraded grappling hook (faster reel?). Night-vision/targeters?' },
            { category: 'Vehicles', description: 'Likely best at using combat vehicles (buggy turrets, combat ornithopters). Gear could align with vehicle mods.' },
        ],
        pros: [
            'High Damage Output: Consistent and burst DPS with guns/explosives.',
            'Excellent Mobility: Superior repositioning with grappling hook.',
            'AoE and Crowd Control via Explosives: Handles groups well, can flush cover.',
            'Durability & Armor: Higher base resilience, can wear heavier armor.',
            'Simple, Effective Kit: Easy to learn, reliable in combat.',
        ],
        cons: [
            'Limited Utility: Primarily combat-focused, less support/non-combat value.',
            'Predictability: Straightforward tactics can be anticipated.',
            'Dependency on Gear/Ammo: Weakened if resources run out.',
            'Vulnerability in Melee: Relies on mobility to avoid close combat specialists.',
            'Collateral Risk: Explosives can attract attention or cause friendly fire.',
        ],
        recommendedFor: `Players who enjoy FPS playstyles, "run-and-gun" action, being a futuristic commando. Soldiers/marines archetypes. Solo players wanting strong start. Those enjoying mobility/frenetic combat. Straightforward gameplay fans. Ranged DPS mains. Lore fans aligning with House militaries.`,
    },
    {
        id: 'planetologist',
        name: 'Planetologist',
        summary: 'Masters of desert survival, resource gathering, exploration, and Fremen ways.',
        lore: `Inspired by Imperial Planetologist Dr. Liet-Kynes, masters of Arrakis's ecology and Fremen ways. Focuses on survival, gathering, environmental knowledge. Learns Fremen techniques (stillsuits, thriving in harsh environments, mapping). Outlasts the planet rather than direct combat focus. Excels in PvE, gathering, exploration. "Loots more and consumes fewer resources." Ideal for long solo trips.`,
        abilities: [
            { name: 'Desert Survival (Passive/Skill)', description: 'Greatly reduced resource consumption and environmental hazard resistance.', details: 'Slower water depletion, more hydration from kills, less damage from heat/storms. Allows longer desert excursions.' },
            { name: 'Resource Finder (Scan)', description: 'Ability to detect resources like spice, water, minerals.', details: 'Highlights nodes on HUD. Might involve "tasting the sand." Invaluable for gathering.' },
            { name: 'Cartographer (Sinkchart Creation)', description: 'Skill to create tangible maps (Sinkcharts) of explored regions.', details: 'Records layout of changing desert. Maps can be shared/sold. Requires visiting vantage points and launching survey probes. Crucial for exploration meta.' },
            { name: 'Thumper (Worm Summoning/Diversion)', description: 'Potential ability/tool to use thumpers for manipulating sandworms.', details: 'Attracts worms. Use to eliminate enemies, create blockades, divert chasing worms, or potentially call worms for riding (future?). Epitomizes "desert power."' },
            { name: 'Spice Chemurgy / Poison', description: 'Knowledge of using spice or plants for effects.', details: 'Craft poisons/sedatives for weapons/supplies. Use spice for detection/visions? May have ability to apply toxins (damage over time).' },
            { name: 'Terrain Mastery (Movement)', description: 'Enhanced movement on sand, potentially mimicking Fremen techniques.', details: 'Move silently/quickly over sand ("walk without rhythm") to avoid worms. Better climbing/parkour in rocks?' },
            { name: 'Maker Hooks (Speculative Future Ability)', description: 'Potential high-level ability to ride sandworms using maker hooks.', details: 'Ultimate expression of desert power. Likely rare/quest-tied. Pinnacle of Planetologist lore.' },
        ],
        combatStyleSolo: `Cautious and opportunistic survivalist. Avoid unnecessary fights. Rely on basic weapons, environment (kiting into fauna), superior stamina/resources. Use stealth/diversion (thumpers). Soften targets with poison/traps. Guerilla tactics (hit and run). Average direct combat, riskier in firefights.`,
        combatStyleGroup: `Supportive off-combat role with clutch contributions. Ensure group resources (water/spice). Navigate hazards safely. Find valuable resources. Lend combat aid via environment (explosions causing rockslides), debuffs (poison), minor support (hydration heal?). Handle environmental mechanics in PvE. Pathfinder and utility player.`,
        pveStrategies: `Preparation and avoidance. Craft survival supplies. Use Resource Finder constantly. Map areas with Cartographer/probes. Skirt dangerous camps. Engage on your terms (lure into traps/worms). Use hit-and-fade tactics. Outlast enemies with resource efficiency. Exploit creature ecology. Keep escape plan. Navigate storms better. Turn exploration into progression via map trading.`,
        pvpStrategies: `Sly opponent leveraging home-field advantage. Lead enemies into environmental hazards (quicksand, worms). Play defensively, outlast opponents' resources. Use traps (spice mines, distractions). Use thumpers mid-fight for chaos/repositioning. Scout and logistician in groups (chart battlefield, share intel/maps). Spot flanks. Sabotage environment (spice silos, smoke cover). Lead retreats via known paths. Support allies (water/spice boosts). Asymmetrical fighter, often underestimated.`,
        equipment: [
            { category: 'Weapons', description: 'Survival tools doubling as weapons. Crysknife (iconic Fremen dagger). Lightweight ranged defense (dart rifle, Maula pistol). Small explosives/charges for utility (avalanches, breaching rock) more than pure damage.' },
            { category: 'Armor', description: 'Best quality Stillsuit essential. Layered desert robes for protection/camouflage. Light armor pieces. Avoid heavy armor. Gear with utility slots.' },
            { category: 'Tools', description: 'Maker Hook & Thumper (if available). Fremkit (survival kit). Surveyor Probes. Spice harvesters/collectors. Dew Collectors/water distillers. Desert Compass (storm navigation?). Sand Goggles/mask (storm vision, heat detection?). Spice filters/injector. Map case/satchel.' },
        ],
        pros: [
            'Best Survival & Gathering Class: Can stay out longer, gather more resources.',
            'Map Creation & Terrain Mastery: Unique ability to chart the world, navigate safely.',
            'Environmental Advantage in Combat: Can leverage hazards/worms against enemies.',
            'Economic/Support Value: Fuels team economy, enables deep desert operations.',
            'Stealth and Low Profile: Blends into desert, potentially harder to detect/target.',
        ],
        cons: [
            'Weaker Direct Combat Ability: Struggles in head-on fights, especially early.',
            'Reliant on Preparation: Vulnerable if caught unprepared or ambushed.',
            'Primarily PvE-Oriented: Less potent in direct PvP confrontation.',
            'Group Dependence for Combat: Needs allies for heavy combat scenarios.',
            'Requires Patience and Love of Exploration: Suits players who enjoy slower-paced survival/gathering.',
        ],
        recommendedFor: `Players who enjoy exploration, crafting, survival gameplay. Ranger/survivalist archetypes. Gatherer class enthusiasts. PvE cooperation fans. Support players focused on provisioning/guiding. Stealth/ambush players using environment. Fremen culture fans. Self-sufficient players. Not for constant action seekers. Choose if mastering Arrakis itself appeals.`,
    },
];

// --- FINAL TIPS ---
const finalTips = `All classes in Dune: Awakening share one important feature: you are not permanently locked into only those abilities. As confirmed by Funcom, you can eventually learn every school’s skills by finding trainers in the world, allowing mix-and-match builds. Your starting class (Mentor choice) only defines your initial ability and early playstyle, but you can grow beyond it. That said, each class provides a distinct flavor and specialization to anchor your character. For maximum effectiveness, consider combining strengths: e.g., a Swordmaster who later learns a Mentat’s scan becomes a deadly bounty hunter, or a Mentat who picks up a Trooper’s grenade skill gains offensive punch. Play around with what suits you. Whether you choose the brute force of the Swordmaster, the subtle manipulations of the Bene Gesserit, the high-tech tactics of the Mentat, the raw firepower of the Trooper, or the survival savvy of the Planetologist, mastering your class in Dune: Awakening will be a journey as epic as traversing the deserts of Arrakis itself. Adapt, experiment, and above all – remember that the slow blade penetrates the shield. Good luck, adventurer, and may Shai-Hulud pass you by when you need it most!`;

// --- YOUTUBE DATA ---
interface YoutubeVideo { id: string; embedUrl: string; }
const youtubeVideos: YoutubeVideo[] = [
    { id: "DuneAwakeningTrailer1", embedUrl: "https://www.youtube.com/embed/plw2gxf7Coc?si=6jvS0yPyjY39Hyww" },
    { id: "DuneGameplayReveal", embedUrl: "https://www.youtube.com/embed/r8lxVDqoHLQ?si=OmYVnWHeEmKv4EPL" },
    { id: "DuneSurvivalMechanics", embedUrl: "https://www.youtube.com/embed/UA4Q8dTuIio?si=aN77qr5ihaBplfnu" },
];

// --- REVIEWS ---
interface Review { id: number; author: string; title: string; text: string; rating: number; }
const reviews: Review[] = [
    { id: 1, author: "ArrakisExplorer", title: "Promising Survival Mechanics", text: "Really looking forward to the survival aspects shown. Managing water and avoiding worms looks intense! Hope the community building is strong.", rating: 5 },
    { id: 2, author: "SpiceTrader88", title: "Potential for Deep Faction Play", text: "The idea of House politics and CHOAM influencing the world has me hooked. If they pull off the faction rivalries, this could be huge.", rating: 4 },
    { id: 3, author: "SandWalker", title: "Visually Stunning Arrakis", text: "From the previews, the depiction of Arrakis looks incredible. The scale of the desert and the storms seem spot on. Cautiously optimistic about performance.", rating: 5 },
    { id: 4, author: "Duke_Fan", title: "Great Roleplay Potential!", text: "Heard about the community roleplay with 'Duke Richard' and the Fremen council. Sounds like a fun, unique group that values story.", rating: 5 },
    { id: 5, author: "SchematicSeeker", title: "Neutral Trading Hub?", text: "Looking for a reliable place to trade schematics without getting ripped off by big clans. If this group is truly neutral and has integrity, count me in.", rating: 5 },
    { id: 6, author: "DesertNomad", title: "Casual & Hardcore Welcome", text: "Good to see a community aiming to bridge the gap between casual players and hardcore survivalists. Merit-based sounds fair.", rating: 4 }
];

// --- STYLES ---
import styles from './DunePage.module.css';

// --- PAGE COMPONENT ---
export default function DuneAwakeningPage() {
    const discordServerLink = "https://discord.gg/QjxHdhmfc6";
    const reviewSourceLink = null; // Add Disboard link if available

    const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});
    const [currentReviewStartIndex, setCurrentReviewStartIndex] = useState(0);
    const [isReviewVisible, setIsReviewVisible] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleClassExpansion = (classId: string) => {
        setExpandedClasses(prev => ({
            ...prev,
            [classId]: !prev[classId]
        }));
    };

    useEffect(() => {
        if (reviews.length <= 3) return;
        const intervalId = setInterval(() => {
            setIsReviewVisible(false);
            setTimeout(() => {
                setCurrentReviewStartIndex((prevIndex) => {
                    const nextIndex = prevIndex + 3;
                    return nextIndex >= reviews.length ? 0 : nextIndex;
                });
                setIsReviewVisible(true);
            }, 600);
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    const reviewsToShow = reviews.slice(currentReviewStartIndex, currentReviewStartIndex + 3);

    return (
        <div className={styles.pageContainer}>

            {/* === About Section === */}
            <section className={styles.section}>
                <h1 className={styles.sectionTitle}>
                    About GPT Dune: Awakening
                    <Link
                        href={discordServerLink} target="_blank" rel="noopener noreferrer"
                        aria-label="Join the Dune: Awakening Discord" title="Join the Dune: Awakening Discord"
                        className={styles.discordIconLink}
                    >
                        <FaDiscord className={styles.discordIcon} />
                    </Link>
                </h1>
                <p className={styles.paragraph}>
                    Welcome, adventurer, to the harsh deserts of Arrakis. In Dune: Awakening, your survival and success depend not only on your wits and gear but also on the specialized training you undertake and the allies you choose. The Galactic Phantom Taskforce (GPT) Dune Division offers a haven.
                </p>
                <p className={styles.paragraph}>
                    This guide provides an overview of the known playable classes or specializations available. Below, you'll also find information about our community and how we operate on Arrakis. Choose your path wisely, learn its strengths and weaknesses, and remember that adaptability is key to surviving the dangers of Dune. Click on a class below to expand its details.
                </p>
            </section>

            {/* === YouTube Carousel === */}
            <div className={styles.youtubeCarouselContainer}>
                <Swiper
                    modules={[Navigation, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={true}
                    loop={true}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    className="dune-youtube-swiper"
                >
                    {youtubeVideos.map((video, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <SwiperSlide key={video.id}>
                                <div className={styles.youtubeSlide}>
                                    {isActive && (
                                        <iframe
                                            className={styles.youtubeIframe}
                                            src={video.embedUrl}
                                            title={`YouTube video player for ${video.id}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            referrerPolicy="strict-origin-when-cross-origin"
                                        />
                                    )}
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            {/* === New Player Section === */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>New to Arrakis?</h2>
                <p className={styles.paragraph}>
                    Feeling the heat? Overwhelmed by the sandworms or the scarcity of water? GPT is here to help. We offer a supportive environment for those taking their first steps onto the shifting sands. Learn the essentials of survival, crafting, and navigation without fear of judgment.
                </p>
                <p className={styles.paragraph}>
                    Our experienced members can guide you through finding resources, understanding faction dynamics, and joining your first group expeditions. Ask questions, find mentors, and discover the secrets of the desert alongside friendly faces. Check our Discord for guides and LFG channels!
                </p>
            </section>

            {/* === Class Sections (Collapsible) === */}
            <div className={styles.classSectionsContainer}>
                {duneClasses.map((duneClass) => {
                    const isExpanded = !!expandedClasses[duneClass.id];
                    return (
                        <div key={duneClass.id} className={styles.factionCard}>
                            <div
                                className={styles.factionHeader}
                                onClick={() => toggleClassExpansion(duneClass.id)}
                                role="button"
                                aria-expanded={isExpanded}
                                aria-controls={`content-${duneClass.id}`}
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleClassExpansion(duneClass.id)}
                            >
                                <div>
                                    <h2 className={styles.factionCardTitle}>{duneClass.name}</h2>
                                    <p className={styles.factionSummary}>{duneClass.summary}</p>
                                </div>
                                {isExpanded
                                    ? <FaChevronUp className={`${styles.expandIcon} ${styles.rotated}`} aria-label="Collapse section"/>
                                    : <FaChevronDown className={styles.expandIcon} aria-label="Expand section"/>}
                            </div>
                            <div id={`content-${duneClass.id}`} className={`${styles.factionContentContainer} ${isExpanded ? styles.collapsibleContentExpanded : ""}`}>
                                <h3 className={styles.subHeading}>Lore & Background</h3>
                                <p className={styles.paragraph}>{duneClass.lore}</p>
                                <h3 className={styles.subHeading}>Abilities</h3>
                                <ul className={styles.ruleList}>
                                    {duneClass.abilities.map((ability, idx) => (
                                        <li key={idx} className={styles.ruleListItem}>
                                            <span className={styles.strongText}>{ability.name}:</span> {ability.description}
                                            {ability.details && <span className={styles.abilityDetails}> {ability.details}</span>}
                                        </li>
                                    ))}
                                </ul>
                                <h3 className={styles.subHeading}>Combat Style</h3>
                                <h4 className={styles.challengeLevelTitle}>Solo</h4>
                                <p className={styles.paragraph}>{duneClass.combatStyleSolo}</p>
                                <h4 className={styles.challengeLevelTitle}>Group</h4>
                                <p className={styles.paragraph}>{duneClass.combatStyleGroup}</p>
                                <h3 className={styles.subHeading}>Strategies</h3>
                                <h4 className={styles.challengeLevelTitle}>PvE</h4>
                                <p className={styles.paragraph}>{duneClass.pveStrategies}</p>
                                <h4 className={styles.challengeLevelTitle}>PvP</h4>
                                <p className={styles.paragraph}>{duneClass.pvpStrategies}</p>
                                <h3 className={styles.subHeading}>Recommended Equipment</h3>
                                <ul className={styles.ruleList}>
                                    {duneClass.equipment.map((equip, idx) => (
                                        <li key={idx} className={styles.ruleListItem}>
                                            <span className={styles.strongText}>{equip.category}:</span> {equip.description}
                                        </li>
                                    ))}
                                </ul>
                                <h3 className={styles.subHeading}>Pros</h3>
                                <ul className={styles.ruleList}>
                                    {duneClass.pros.map((pro, idx) => (<li key={idx} className={styles.ruleListItem}>{pro}</li>))}
                                </ul>
                                <h3 className={styles.subHeading}>Cons</h3>
                                <ul className={styles.ruleList}>
                                    {duneClass.cons.map((con, idx) => (<li key={idx} className={styles.ruleListItem}>{con}</li>))}
                                </ul>
                                <h3 className={styles.subHeading}>Recommended For</h3>
                                <p className={styles.paragraph}>{duneClass.recommendedFor}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* === Community & Partnership === */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Community & Partnership</h2>
                <p className={styles.paragraph}>
                    GPT aims to be more than just a clan; we are an established community built on <strong className={styles.strongText}>integrity and trust</strong>. We welcome both casual explorers and hardcore survivors, operating as a merit-based group at heart. We foster a unique atmosphere with satirical roleplay featuring our noble "Duke Richard," the prowess of "Muad'Dib" (our champion fighter), and the wisdom of our council of Fremen Elders and refugees.
                </p>
                <p className={styles.paragraph}>
                    We envision our community as a <strong className={styles.strongText}>neutral trading ground</strong> for the Dune market. We encourage the open sharing of schematics and resources, providing a safe and reliable hub away from the grasp of larger, potentially domineering factions. If you seek fair trade and collaboration, look no further.
                </p>
                <p className={styles.paragraph}>
                    Our ultimate goal aligns with the Fremen dream: to see Arrakis restored and its people thrive. We stand against tyrannical clans and hateful groups unwilling to let the spice flow freely for the benefit of all. If your group shares these values or seeks a dependable ally and trading partner, <Link href={discordServerLink} target="_blank" rel="noopener noreferrer" className={styles.link}>reach out to us on Discord</Link>.
                </p>
            </section>

            {/* === Final Tips === */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Final Tips & Adaptability</h2>
                <p className={styles.paragraph}>{finalTips}</p>
            </section>

            {/* === Reviews Section === */}
            <div className={styles.reviewSectionContainer}>
                <div className={`${styles.reviewCardsWrapper} ${!isReviewVisible ? styles.reviewCardsWrapperHidden : ""}`}>
                    {reviewsToShow.length > 0 ? (
                        reviewsToShow.map((review) => (
                            <div key={review.id} className={styles.individualReviewCard}>
                                <div className={styles.reviewStars}>
                                    {Array.from({ length: Math.max(0, Math.min(5, review.rating)) }).map((_, i) => (<FaStar key={i} />))}
                                    {Array.from({ length: Math.max(0, 5 - review.rating) }).map((_, i) => (<FaStar key={`empty-${i}`} style={{ opacity: 0.3 }} />))}
                                </div>
                                <h3 className={styles.reviewTitle}>{review.title}</h3>
                                <p className={styles.reviewText}>"{review.text}"</p>
                                <p className={styles.reviewAuthor}>- {review.author}</p>
                            </div>
                        ))
                    ) : (
                        <p className={styles.paragraph}>No community reviews available yet.</p>
                    )}
                </div>
                {/* Disboard link or placeholder */}
                {reviewSourceLink ? (
                    <Link
                        href={reviewSourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.disboardLinkBottom}
                    >
                        Read More Dune Reviews on Disboard
                    </Link>
                ) : (
                    <p className={styles.paragraph} style={{ textAlign: "center", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                        Reviews powered by Disboard (Link coming soon!)
                    </p> 
                )}
            </div>
        </div>
    );
}