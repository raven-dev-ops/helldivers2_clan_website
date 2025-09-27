// Shared types + data for Academy modules

export type AcademyModule = {
    id: string;
    title: string;
    subtitle: string;
    img: string;
    imgAlt: string;
    description: string;
    basic: string[];
    advanced: string[];
  };
  
  export type ModuleWithDetails = AcademyModule & {
    details: {
      paragraphs: string[];
      tips?: string[];
      cautions?: string[];
    };
  };
  
  export const MODULES: ModuleWithDetails[] = [
    {
      id: 'environmental',
      title: 'Environmental',
      subtitle: 'Planetary concerns / considerations',
      img: 'https://placehold.co/1200x675?text=Environmental',
      imgAlt: 'Environmental conditions affecting combat',
      description:
        'Understand how biomes, weather, and hazards change your plan of attack and extraction.',
      basic: [
        'Biomes: desert, arctic, forest, swamp — impacts visibility & mobility',
        'Weather: sandstorms, blizzards, fog/night ops — shorten engagement ranges',
        'Hazards: meteor/artillery zones, lightning, seismic shockwaves, acid pools',
      ],
      advanced: [
        'Route planning: pre-mark safeholds & fallback lines around hazard zones',
        'Adaptation: bring stuns/smokes for low-vis, sentries for lane control',
        'Timing: start objectives between weather waves; call Pelican early',
      ],
      details: {
        paragraphs: [
          'Environmental factors control tempo. Use storms and night ops to break line of sight, rotate squads, and reposition heavy weapons without drawing cross-map aggro.',
          'Meteor/artillery events can be weaponized: fight with your back to their impact lanes so incoming waves path through damage.',
        ],
        tips: [
          'In blizzards, marksmen swap to close-range secondaries; rely on sentry arcs.',
          'Lightning disables bots briefly—time pushes between strikes.',
        ],
        cautions: [
          'Acid pools destroy extract lanes—scan and plan alternates before uplinks.',
        ],
      },
    },
    {
      id: 'weaponry',
      title: 'Weaponry',
      subtitle: 'Types, range, description',
      img: 'https://placehold.co/1200x675?text=Weaponry',
      imgAlt: 'Helldiver weapons on a rack',
      description:
        'Choose the right tool and range for the job; manage recoil, reloads, and penetration.',
      basic: [
        'Primaries: AR-23 Liberator (AR), SG-225 Breaker (Shotgun), DMR-8 Diligence (DMR)',
        'Energy/Plasma: LAS-16 Sickle (sustain), PLAS-1 Scorcher (splash)',
        'Support/AT: Railgun, Recoilless Rifle, Autocannon for armor threats',
      ],
      advanced: [
        'Armor breakpoints: Chargers legs; Hulks/Devs vents/power units',
        'Target priority: spawners, artillery, commanders before fodder',
        'Ammo economy: share resupplies; rotate roles as mags run low',
      ],
      details: {
        paragraphs: [
          'Think in roles: Anchor (lane denial), Demo (armor delete), Flex (revives/utility). Slot your primary to complement squad gaps.',
          'Penetration and stagger matter more than raw DPS when kiting armored waves.',
        ],
        tips: [
          'Railgun (safe mode off) deletes vents through soft cover.',
          'Autocannon + smoke = safe turreting in open fields.',
        ],
        cautions: ['Breaker friendly-fire cones are wide—announce pushes.'],
      },
    },
    {
      id: 'armory',
      title: 'Armory',
      subtitle: 'Types, range, description',
      img: 'https://placehold.co/1200x675?text=Armory',
      imgAlt: 'Helldiver armor sets on mannequins',
      description:
        'Balance protection and mobility; pick armor that matches your role and mission.',
      basic: [
        'Armor classes: Light (mobility), Medium (balanced), Heavy (survivability)',
        'Mobility & stamina: heavier armor slows sprints and recoveries',
        'Perk synergies: backpack choices (Ammo/Shield) and grenade types',
      ],
      advanced: [
        'Role gearing: Demo (AT focus), Anchor (line holding), Support (revives/backpacks)',
        'Damage mitigation: plan for friendly-fire and explosive radii',
        'Team comp: at least two anti-armor sources per squad',
      ],
      details: {
        paragraphs: [
          'Heavier kits shine in static objectives; light kits excel at map control and tag-and-drag.',
          'Armor choice dictates revive reliability; heavier anchors should carry utility grenades.',
        ],
        tips: ['Heavy + shield backpack = clutch extra life on extracts.'],
        cautions: ['Don’t over-stack heavy; squad mobility collapses under meteor spam.'],
      },
    },
    {
      id: 'stratagems',
      title: 'Stratagems',
      subtitle: 'Type, warnings, advantage',
      img: 'https://placehold.co/1200x675?text=Stratagems',
      imgAlt: 'Stratagem beacons being thrown',
      description:
        'Call down the right support at the right time while managing risk to your squad.',
      basic: [
        'Categories: Offensive (Eagle/Orbitals), Defensive (Sentries/Mines), Utility (Resupply/Shield)',
        'Timing & danger zones: announce throws; clear teammates before impact',
        'LOS & terrain: use ridges/walls to block blast & shrapnel',
      ],
      advanced: [
        'Combos: Stun → Railcannon; Smoke → Uplinks; Barrages to hold extracts',
        'Sentry placement: behind cover, overlapping arcs, avoid friendly lanes',
        'Cooldowns: pre-cast Eagles before timers; stagger orbitals',
      ],
      details: {
        paragraphs: [
          'Treat orbitals like terrain you place: shape enemy paths, then exploit with AT bursts.',
          'Pre-call Eagle runs on spawner pings to keep pressure low during objective inputs.',
        ],
        tips: ['Mortar sentry behind low wall = safe infinite suppression.'],
        cautions: ['Announce precision strikes—no surprise blue-on-blue.'],
      },
    },
    {
      id: 'xenology',
      title: 'Xenology',
      subtitle: 'Race, armor type, weakness, strengths',
      img: 'https://placehold.co/1200x675?text=Xenology',
      imgAlt: 'Enemy faction silhouettes',
      description:
        'Know your enemy: identify armor types, behaviors, and the counters that work.',
      basic: [
        'Factions: Terminids (melee swarms) and Automatons (ranged armor)',
        'Weak points: Charger legs, Bile Titan head/back; Bot vents/power units',
        'Spawners & commanders: eliminate to reduce pressure',
      ],
      advanced: [
        'Counters: AT vs Chargers/Tanks; EMP/Impact vs bots; fire vs bugs',
        'Threat triage: artillery, snipers, breeders before fodder',
        'CC vs single-target: swap roles as the fight evolves',
      ],
      details: {
        paragraphs: [
          'Terminids reward kiting funnels and fire DoTs; Automatons demand cover discipline and angle denial.',
          'Kill-chain: commanders → spawners → heavies → chaff; starve waves at the source.',
        ],
        tips: ['Impact grenades pop bot vents on flanks without exposing the squad.'],
        cautions: ['Don’t chase breeders into fog—bait them into sentry arcs.'],
      },
    },
    {
      id: 'command',
      title: 'Command',
      subtitle: 'Roles, duties, applications',
      img: 'https://placehold.co/1200x675?text=Command',
      imgAlt: 'Command roles and responsibilities',
      description:
        'Understand GPT Fleet leadership roles and how to step up: Fleet Commander (jr. mod), Democracy Officer (mod), Loyalty Officer (admin).',
      basic: [
        'Fleet Commander: squad/event ops, quick decisions, escalates issues',
        'Democracy Officer: moderation, culture enforcement, event leads',
        'Loyalty Officer: admin, policy, security, final arbitration',
      ],
      advanced: [
        'Playbooks: incident triage → de-escalation → resolution → report',
        'Signal: concise comms, standard callouts, delegate early',
        'Pipeline: apply at the Mod Team page; shadow, eval, promote',
      ],
      details: {
        paragraphs: [
          'Command roles keep games moving and the culture consistent. Use clear comms, set tempo, and delegate tasks to maintain momentum under pressure.',
           'Document incidents succinctly: what happened, who was impacted, what action you took, and follow-ups. Consistency builds trust.',
        ],
        tips: [
          'Use standard callouts (“Rotate north”, “Hold extract”, “AT on Charger legs”).',
          'Keep a ready roster for events; backfill before you burn out.',
        ],
        cautions: [
          'Avoid rules lawyering mid-match—stabilize first, debrief after.',
          'Promotions follow performance and culture fit—no fast-tracking.',
        ],
      },
    },
  ];
  