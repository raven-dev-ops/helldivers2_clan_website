// src/data/helldivers2/challenges.ts

/** Shape of a single challenge level */
export interface ChallengeLevelData {
  id: string;
  levelTitle: string;
  details: string;
  videoUrls?: string[];
}

/** John Helldiver challenge levels (JH0–JH7) */
export const challengeLevels: ChallengeLevelData[] = [
  {
    id: 'level-0',
    levelTitle: 'JH0 Basic Clearance',
    details: `#FORTRESS / MEGA NEST – Solo Base
  Extract Required
  
  RECOMMENDED LOADOUTS & STRATAGEMS (allowed):
  — VS AUTOMATONS —
  • Primary: LAS-58 “Talon” (heat-based, great uptime) or Diligence Counter-Sniper for long lanes
  • Secondary: GP-31 Grenade Pistol or P-4 Senator
  • Support: Quasar Cannon or Railgun (delete Hulks/tanks; pairs well with Personal Shield Generator since these don’t use the backpack slot)
  • Eagles: 110mm Rocket Pods or 500kg for fabricators/tanks; Strafing Run to clear patrols
  • Orbitals: Laser / Railcannon / 380mm HE for static targets and fabricators
  • Grenades: Stun to line up headshots on Devastators
  
  — VS TERMINIDS —
  • Primary: SG-225 Breaker or R-36 Eruptor (burst AOE)
  • Secondary: P-19 Redeemer or GP-31 Grenade Pistol
  • Support: Autocannon or SPEAR for Chargers/Bile Titans
  • Eagles: Cluster / Napalm / 110mm for bug-hole clusters
  • Orbitals: Gas or 380mm HE to thin swarms
  • Grenades: Incendiary or Thermite
  
  TACTICS
  • FORTRESS: Consider drop-podding onto fabricators to delete spawns early; then clear AA/gun towers and extract. Keep moving between cover; don’t farm.
  • MEGA NEST: Run the rim clockwise, destroy bug holes first, save heavy ordnance for Impalers/Bile Titans and the “Titan hole”. Call heavy eagle/orbital just before you jump down to a cluster.`,
    videoUrls: [],
  },
  {
    id: 'level-1',
    levelTitle: 'JH1 Sabotage Proficiency',
    details: `#SABOTAGE MISSION (Command Bunker, Airfield, Orbital Cannon, Nuke Nursery, Purge Hatchery)
  No special restrictions
  Extract Required
  
  RECOMMENDED LOADOUTS & STRATAGEMS (allowed):
  — UNIVERSAL —
  • Bring at least one anti-structure tool: Quasar Cannon, Railgun, Recoilless, or SPEAR
  • Eagles: 110mm Rocket Pods (precise) or 500kg (one-and-done)
  • Orbitals: Laser / Precision / 380mm HE
  • Utility: Supply Pack or Shield Pack (bots); Guard Dog / Mortar Sentry to hold switches
  
  — VS AUTOMATONS —
  • Primary: LAS-58 Talon or Diligence Counter-Sniper
  • Secondary: GP-31 Grenade Pistol or Senator
  • Support: Quasar or Railgun; optional SPEAR to delete dropships/fabricators
  
  — VS TERMINIDS —
  • Primary: SG-225 Breaker or R-36 Eruptor
  • Support: Autocannon or Flamethrower; SPEAR for Chargers
  
  TACTICS
  • Move objective-to-objective; don’t fight the whole map. Use Eagles/Orbitals to clear bunkers, radar, or cannons from outside. Kill scouts first to avoid endless adds. Plant explosives and leave—don’t linger.`,
    videoUrls: [],
  },
  {
    id: 'level-2',
    levelTitle: 'JH2 Resource Denial',
    details: `#SABOTAGE MISSION (Command Bunker, Airfield, Orbital Cannon, Nuke Nursery, Purge Hatchery)
  No Stratagems
  No Resupply
  Extract Required
  
  RECOMMENDED LOADOUTS (no stratagems / no resupply):
  — UNIVERSAL —
  • Prioritize heat- or energy-based primaries for uptime: LAS-58 Talon or LAS-16 Sickle
  • Secondary: P-4 Senator (high penetration, low ammo usage)
  • Grenades: Stun (bots) or Thermite/Incendiary (bugs)
  • Armor: Light/medium with stamina; carry extra stims; play for speed, not kills
  
  — VS AUTOMATONS —
  • Primary: Talon or Diligence Counter-Sniper; pick headshots to conserve ammo
  • Tactic: Avoid turreted camps; break line-of-sight, clear patrol leaders before they radio
  
  — VS TERMINIDS —
  • Primary: Breaker if you’re confident (burst control) or Talon/Sickle to prevent ammo issues
  • Tactic: Sprint objective routes, ignore non-threats, pre-stim before charging through packs
  
  TACTICS
  • Don’t open fights you can bypass. Use terrain, smoke (if your grenade slot allows), and dives to break contact. Finish the objective and extract—this is a denial op.`,
    videoUrls: [],
  },
  {
    id: 'level-3',
    levelTitle: 'JH3 ICBM Control',
    details: `#ICBM
  No Stratagems
  Extract Required
  
  RECOMMENDED LOADOUTS (no stratagems):
  — VS AUTOMATONS —
  • Primary: Diligence Counter-Sniper or LAS-58 Talon
  • Secondary: P-4 Senator
  • Grenades: Stun
  • Armor: Medium with extra stims
  
  — VS TERMINIDS —
  • Primary: SG-225 Breaker or R-36 Eruptor
  • Secondary: P-19 Redeemer
  • Grenades: Incendiary or Thermite
  • Armor: Light/medium; mobility > armor inside the silo
  
  TACTICS
  • Clear perimeter before entering silo. Inside: sprint console-to-console, dive to break line-of-sight, and save stims for exit. Memorize the panel order so you’re not reading under fire.`,
    videoUrls: [],
  },
  {
    id: 'level-4',
    levelTitle: 'JH4 Flawless ICBM',
    details: `#ICBM
  No Stratagems
  No Resupply
  No Deaths
  Extract Required
  
  RECOMMENDED LOADOUTS (no stratagems / no resupply):
  — UNIVERSAL —
  • Primary: LAS-58 Talon (heat-based) or LAS-16 Sickle to avoid ammo issues
  • Secondary: P-4 Senator (precision) or GP-31 if you are extremely confident with ammo
  • Grenades: Stun (bots) / Incendiary (bugs)
  
  TACTICS
  • Plan your route and commit. Pre-clear outside, then execute the silo in one push. Only fight what blocks the path, keep moving, and use dives to cancel enemy attacks. If you lose tempo, reset outside.`,
    videoUrls: [],
  },
  {
    id: 'level-5',
    levelTitle: 'JH5 Perfect Survey',
    details: `#Geological Survey
  No Deaths
  Extract Required
  
  RECOMMENDED LOADOUTS & STRATAGEMS (allowed):
  — UNIVERSAL —
  • Primary: Flexible crowd control (Breaker, Eruptor, or Scorcher)
  • Support: Autocannon or Quasar/Recoilless for armored threats
  • Backpack: Shield Pack (bots) or Supply Pack
  • Sentries: HMG Emplacement + Mortar/EMS Sentry to guard the drill
  • Eagles/Orbitals: 110mm / Cluster / 380mm HE as panic buttons
  
  TACTICS
  • Objectives are Seismic Probe(s) → Prospecting Drill. Set sentries to create intersecting arcs, keep enemies at standoff, and rotate around the drill to clear burrowers. Start the extract immediately after final data uplink; don’t stay to farm.`,
    videoUrls: [],
  },
  {
    id: 'level-6',
    levelTitle: 'JH6 Eagle Ace',
    details: `#Capture Flag
  Eagles Only
  Extract Required
  
  RECOMMENDED EAGLES (pick 4):
  • 110mm Rocket Pods — precise deletes on elites and fabricators
  • Airstrike or Strafing Run — flexible, low cooldown lane-clear
  • Cluster Bomb — wide AOE on swarms
  • 500kg Bomb — use as a “free win” button on big waves (watch FF)
  • Optional: Napalm for area denial, Smoke to reposition
  
  TACTICS
  • The flag raises for ~1m40s while a Helldiver stays inside the zone. Saluting speeds the raise per player. Kite around the edge of the circle and chain eagles ahead of your path to keep the lane clear; don’t stand on the pole. Save 500kg for emergency clears or the final 20%. Extract immediately after success.`,
    videoUrls: [],
  },
  {
    id: 'level-7',
    levelTitle: 'JH7 The Purist',
    details: `#ICBM
  No Stratagems
  Constitution Rifle + Senator with Throwing Knives
  No Deaths
  No Resupply
  All 5 Side Objectives Completed (Jammers, Mortar Emplacements, etc.)
  Extract Required
  No support weapons found in the mission can be used
  Exception: Break Action Shotgun is allowed
  
  RECOMMENDED LOADOUT (per rules):
  • Primary: AR-23C “Constitution”
  • Secondary: P-4 Senator
  • Grenades: Throwing Knives (required)
  • Armor: Light/medium with stamina; prioritize mobility
  • Booster (if permitted by your rules): Stamina or Vitality
  
  TACTICS
  • Route all side objectives first to snowball XP/samples and reduce world spawns, then commit to the silo. Avoid sustained fights; the Constitution is accurate but not a horde-clearer. Knives stagger/stun hunters and interrupt specials; finish with headshots. Inside the silo, sprint panel-to-panel and dive through melee windups. For the exception: the Break-Action Shotgun may be picked up if found, but drop it before extract to keep the spirit of the run.`,
    videoUrls: [],
  },
];

export async function getChallengeLevels(): Promise<ChallengeLevelData[]> {
  return challengeLevels;
}
