// src/app/api/helldivers/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongoClientPromise';

const VALID_SORT_FIELDS = [
  'Kills',
  'Accuracy',
  'Shots Fired',
  'Shots Hit',
  'Deaths',
  'player_name',
  'clan_name',
  'submitted_at',
] as const;

type SortField = typeof VALID_SORT_FIELDS[number];

function getDbName(): string {
  return process.env.MONGODB_DB || 'GPTHellbot';
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sortByParam = (url.searchParams.get('sortBy') || 'Kills') as SortField;
    const sortDirParam = (url.searchParams.get('sortDir') || 'desc').toLowerCase();
    const limitParam = parseInt(url.searchParams.get('limit') || '100', 10);

    const sortBy: SortField = VALID_SORT_FIELDS.includes(sortByParam) ? sortByParam : 'Kills';
    const sortDir: 1 | -1 = sortDirParam === 'asc' ? 1 : -1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 500) : 100;

    const client = await getMongoClientPromise();
    const db = client.db(getDbName());

    // Use aggregation to normalize potential string values (e.g., "54.3%") to numbers for sorting
    const pipeline: any[] = [
      {
        $addFields: {
          numericKills: { $toDouble: { $ifNull: [ { $getField: { field: 'Kills', input: '$$ROOT' } }, 0 ] } },
          numericDeaths: { $toDouble: { $ifNull: [ { $getField: { field: 'Deaths', input: '$$ROOT' } }, 0 ] } },
          numericShotsFired: { $toDouble: { $ifNull: [ { $getField: { field: 'Shots Fired', input: '$$ROOT' } }, 0 ] } },
          numericShotsHit: { $toDouble: { $ifNull: [ { $getField: { field: 'Shots Hit', input: '$$ROOT' } }, 0 ] } },
          numericAccuracy: {
            $toDouble: {
              $replaceAll: {
                input: { $toString: { $ifNull: [ { $getField: { field: 'Accuracy', input: '$$ROOT' } }, '0' ] } },
                find: '%',
                replacement: ''
              }
            }
          },
          submittedAtDate: {
            $toDate: { $ifNull: [ { $getField: { field: 'submitted_at', input: '$$ROOT' } }, null ] }
          }
        }
      },
    ];

    const sortStage: Record<string, 1 | -1> = {};
    switch (sortBy) {
      case 'Kills': sortStage['numericKills'] = sortDir; break;
      case 'Accuracy': sortStage['numericAccuracy'] = sortDir; break;
      case 'Shots Fired': sortStage['numericShotsFired'] = sortDir; break;
      case 'Shots Hit': sortStage['numericShotsHit'] = sortDir; break;
      case 'Deaths': sortStage['numericDeaths'] = sortDir; break;
      case 'player_name': sortStage['player_name'] = sortDir; break;
      case 'clan_name': sortStage['clan_name'] = sortDir; break;
      case 'submitted_at': sortStage['submittedAtDate'] = sortDir; break;
      default: sortStage['numericKills'] = sortDir; break;
    }

    pipeline.push({ $sort: sortStage });
    pipeline.push({ $limit: limit });

    // Project the fields we want to send to the client
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
        // Also include normalized numerics for potential client-side use (optional)
        numericKills: 1,
        numericAccuracy: 1,
        numericShotsFired: 1,
        numericShotsHit: 1,
        numericDeaths: 1,
        submittedAtDate: 1,
      }
    });

    const cursor = db.collection('User_Stats').aggregate(pipeline, { allowDiskUse: true });
    const results = await cursor.toArray();

    // Format submittedAt to ISO if needed
    const formatted = results.map((doc: any, index: number) => ({
      rank: index + 1,
      id: doc._id,
      player_name: doc.player_name || '',
      Kills: doc.Kills ?? 0,
      Accuracy: typeof doc.Accuracy === 'string' ? doc.Accuracy : (typeof doc.numericAccuracy === 'number' ? `${doc.numericAccuracy.toFixed(1)}%` : ''),
      ShotsFired: doc['Shots Fired'] ?? 0,
      ShotsHit: doc['Shots Hit'] ?? 0,
      Deaths: doc.Deaths ?? 0,
      discord_id: doc.discord_id || null,
      discord_server_id: doc.discord_server_id || null,
      clan_name: doc.clan_name || '',
      submitted_by: doc.submitted_by || '',
      submitted_at: doc.submitted_at || doc.submittedAtDate || null,
    }));

    return NextResponse.json({ sortBy, sortDir: sortDir === 1 ? 'asc' : 'desc', limit, results: formatted });
  } catch (error: any) {
    console.error('Error fetching helldivers leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}