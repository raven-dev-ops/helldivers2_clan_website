// src/lib/helldiversLeaderboard.ts
import getMongoClientPromise from '@/lib/mongoClientPromise';

export const VALID_SORT_FIELDS = [
  'Kills',
  'Accuracy',
  'Shots Fired',
  'Shots Hit',
  'Deaths',
  'player_name',
  'clan_name',
  'submitted_at',
  'Avg Kills',
  'Avg Shots Fired',
  'Avg Shots Hit',
  'Avg Deaths',
] as const;

export type SortField = typeof VALID_SORT_FIELDS[number];
export type SortDir = 'asc' | 'desc';
export type LeaderboardScope = 'month' | 'lifetime';

export interface HelldiversLeaderboardRow {
  rank: number;
  id: string;
  player_name: string;
  Kills: number | string;
  Accuracy: string;
  ShotsFired: number;
  ShotsHit: number;
  Deaths: number | string;
  clan_name?: string;
  submitted_by?: string;
  submitted_at?: string | Date | null;
  discord_id?: string | number | null;
  discord_server_id?: string | number | null;
  // Added aggregated average fields for lifetime scope
  AvgKills?: number;
  AvgShotsFired?: number;
  AvgShotsHit?: number;
  AvgDeaths?: number;
}

function getDbName(): string {
  return process.env.MONGODB_DB || 'GPTHellbot';
}

function getMonthRange(monthZeroIndexed: number, year: number) {
  const start = new Date(Date.UTC(year, monthZeroIndexed, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthZeroIndexed + 1, 1, 0, 0, 0, 0));
  return { start, end };
}

export async function fetchHelldiversLeaderboard(options?: {
  sortBy?: SortField;
  sortDir?: SortDir;
  limit?: number;
  scope?: LeaderboardScope;
  month?: number; // 1-12, optional when scope==='month'
  year?: number; // 4-digit year, optional when scope==='month'
}): Promise<{ sortBy: SortField; sortDir: SortDir; limit: number; results: HelldiversLeaderboardRow[] }> {
  const sortBy = (options?.sortBy && VALID_SORT_FIELDS.includes(options.sortBy) ? options.sortBy : 'Kills') as SortField;
  const sortDir: SortDir = options?.sortDir === 'asc' ? 'asc' : 'desc';
  const limit = options?.limit && options.limit > 0 ? Math.min(options.limit, 1000) : 100;
  const scope: LeaderboardScope = options?.scope === 'lifetime' ? 'lifetime' : 'month';

  const client = await getMongoClientPromise();
  const db = client.db(getDbName());

  const pipeline: any[] = [
    {
      $addFields: {
        numericKills: { $toDouble: { $ifNull: [{ $getField: { field: 'Kills', input: '$$ROOT' } }, 0] } },
        numericDeaths: { $toDouble: { $ifNull: [{ $getField: { field: 'Deaths', input: '$$ROOT' } }, 0] } },
        numericShotsFired: { $toDouble: { $ifNull: [{ $getField: { field: 'Shots Fired', input: '$$ROOT' } }, 0] } },
        numericShotsHit: { $toDouble: { $ifNull: [{ $getField: { field: 'Shots Hit', input: '$$ROOT' } }, 0] } },
        numericAccuracy: {
          $toDouble: {
            $replaceAll: {
              input: { $toString: { $ifNull: [{ $getField: { field: 'Accuracy', input: '$$ROOT' } }, '0'] } },
              find: '%',
              replacement: ''
            }
          }
        },
        submittedAtDate: { $toDate: { $ifNull: [{ $getField: { field: 'submitted_at', input: '$$ROOT' } }, null] } },
        memberKey: { $toString: { $ifNull: ['$discord_id', '$player_name'] } },
      }
    },
  ];

  if (scope === 'month') {
    const now = new Date();
    const monthProvided = options?.month && options.month >= 1 && options.month <= 12 ? options.month : (now.getUTCMonth() + 1);
    const yearProvided = options?.year && options.year >= 1970 ? options.year : now.getUTCFullYear();
    const { start, end } = getMonthRange(monthProvided - 1, yearProvided);
    pipeline.push({ $match: { submittedAtDate: { $gte: start, $lt: end } } });

    const sortStage: Record<string, 1 | -1> = {};
    const dir: 1 | -1 = sortDir === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'Kills': sortStage['numericKills'] = dir; break;
      case 'Accuracy': sortStage['numericAccuracy'] = dir; break;
      case 'Shots Fired': sortStage['numericShotsFired'] = dir; break;
      case 'Shots Hit': sortStage['numericShotsHit'] = dir; break;
      case 'Deaths': sortStage['numericDeaths'] = dir; break;
      case 'player_name': sortStage['player_name'] = dir; break;
      case 'clan_name': sortStage['clan_name'] = dir; break;
      case 'submitted_at': sortStage['submittedAtDate'] = dir; break;
      default: sortStage['numericKills'] = dir; break;
    }

    pipeline.push({ $sort: sortStage });
    pipeline.push({ $limit: limit });
    pipeline.push({
      $project: {
        _id: 1,
        player_name: 1,
        Kills: 1,
        Accuracy: 1,
        'Shots Fired': 1,
        'Shots Hit': 1,
        Deaths: 1,
        discord_id: 1,
        discord_server_id: 1,
        clan_name: 1,
        submitted_by: 1,
        submitted_at: 1,
        numericKills: 1,
        numericAccuracy: 1,
        numericShotsFired: 1,
        numericShotsHit: 1,
        numericDeaths: 1,
        submittedAtDate: 1,
      }
    });
  } else {
    // Lifetime scope: aggregate per member
    // Use the latest name/clan as representative
    pipeline.push({ $sort: { submittedAtDate: 1 } });
    pipeline.push({
      $group: {
        _id: '$memberKey',
        player_name: { $last: '$player_name' },
        clan_name: { $last: '$clan_name' },
        discord_id: { $last: '$discord_id' },
        discord_server_id: { $last: '$discord_server_id' },
        submitted_by: { $last: '$submitted_by' },
        lastSubmittedAt: { $last: '$submittedAtDate' },
        totalKills: { $sum: '$numericKills' },
        totalShotsFired: { $sum: '$numericShotsFired' },
        totalShotsHit: { $sum: '$numericShotsHit' },
        totalDeaths: { $sum: '$numericDeaths' },
        submissionsCount: { $sum: 1 },
      }
    });
    pipeline.push({
      $addFields: {
        avgKills: { $cond: [{ $gt: ['$submissionsCount', 0] }, { $divide: ['$totalKills', '$submissionsCount'] }, 0] },
        avgShotsFired: { $cond: [{ $gt: ['$submissionsCount', 0] }, { $divide: ['$totalShotsFired', '$submissionsCount'] }, 0] },
        avgShotsHit: { $cond: [{ $gt: ['$submissionsCount', 0] }, { $divide: ['$totalShotsHit', '$submissionsCount'] }, 0] },
        avgDeaths: { $cond: [{ $gt: ['$submissionsCount', 0] }, { $divide: ['$totalDeaths', '$submissionsCount'] }, 0] },
        accuracyPct: {
          $cond: [
            { $gt: ['$totalShotsFired', 0] },
            { $multiply: [{ $divide: ['$totalShotsHit', '$totalShotsFired'] }, 100] },
            0
          ]
        }
      }
    });

    const sortStageLifetime: Record<string, 1 | -1> = {};
    const dir: 1 | -1 = sortDir === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'Kills': sortStageLifetime['totalKills'] = dir; break;
      case 'Accuracy': sortStageLifetime['accuracyPct'] = dir; break;
      case 'Shots Fired': sortStageLifetime['totalShotsFired'] = dir; break;
      case 'Shots Hit': sortStageLifetime['totalShotsHit'] = dir; break;
      case 'Deaths': sortStageLifetime['totalDeaths'] = dir; break;
      case 'player_name': sortStageLifetime['player_name'] = dir; break;
      case 'clan_name': sortStageLifetime['clan_name'] = dir; break;
      case 'submitted_at': sortStageLifetime['lastSubmittedAt'] = dir; break;
      case 'Avg Kills': sortStageLifetime['avgKills'] = dir; break;
      case 'Avg Shots Fired': sortStageLifetime['avgShotsFired'] = dir; break;
      case 'Avg Shots Hit': sortStageLifetime['avgShotsHit'] = dir; break;
      case 'Avg Deaths': sortStageLifetime['avgDeaths'] = dir; break;
      default: sortStageLifetime['totalKills'] = dir; break;
    }

    pipeline.push({ $sort: sortStageLifetime });
    pipeline.push({ $limit: limit });

    pipeline.push({
      $project: {
        _id: 1,
        player_name: 1,
        clan_name: 1,
        discord_id: 1,
        discord_server_id: 1,
        submitted_by: 1,
        submitted_at: '$lastSubmittedAt',
        // expose totals using original field names where applicable
        Kills: '$totalKills',
        'Shots Fired': '$totalShotsFired',
        'Shots Hit': '$totalShotsHit',
        Deaths: '$totalDeaths',
        accuracyPct: 1,
        avgKills: 1,
        avgShotsFired: 1,
        avgShotsHit: 1,
        avgDeaths: 1,
      }
    });
  }

  const collectionName = scope === 'lifetime' ? 'Lifetime_Stats' : 'User_Stats';
  const cursor = db.collection(collectionName).aggregate(pipeline, { allowDiskUse: true });
  const results = await cursor.toArray();

  const formatted: HelldiversLeaderboardRow[] = results.map((doc: any, index: number) => ({
    rank: index + 1,
    id: String(doc._id),
    player_name: doc.player_name || '',
    Kills: doc.Kills ?? 0,
    Accuracy: typeof doc.accuracyPct === 'number'
      ? `${doc.accuracyPct.toFixed(1)}%`
      : (typeof doc.Accuracy === 'string' ? doc.Accuracy : (typeof doc.numericAccuracy === 'number' ? `${doc.numericAccuracy.toFixed(1)}%` : '')),
    ShotsFired: doc['Shots Fired'] ?? 0,
    ShotsHit: doc['Shots Hit'] ?? 0,
    Deaths: doc.Deaths ?? 0,
    discord_id: doc.discord_id || null,
    discord_server_id: doc.discord_server_id || null,
    clan_name: doc.clan_name || '',
    submitted_by: doc.submitted_by || '',
    submitted_at: doc.submitted_at || null,
    AvgKills: typeof doc.avgKills === 'number' ? Number(doc.avgKills) : undefined,
    AvgShotsFired: typeof doc.avgShotsFired === 'number' ? Number(doc.avgShotsFired) : undefined,
    AvgShotsHit: typeof doc.avgShotsHit === 'number' ? Number(doc.avgShotsHit) : undefined,
    AvgDeaths: typeof doc.avgDeaths === 'number' ? Number(doc.avgDeaths) : undefined,
  }));

  return { sortBy, sortDir, limit, results: formatted };
}