import { NextResponse } from 'next/server';
import {
  createGameLookupMap,
  getRoundsWithGames,
  getExtendedGamesUrls,
  getIndexMap,
} from '@/utils/event';
import { fetchTournament, fetchIndexData, getGamesData } from '@/utils/api';
import { generatePgn } from '@/utils/game';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const includeEMT = searchParams.get('includeEMT') === 'true';
    const includeClkAttr = searchParams.get('includeClkAttr') === 'true';
    const includeClkComment = searchParams.get('includeClkComment') === 'true';
    const tournament = await fetchTournament(params.id);
    const roundsWithGames = getRoundsWithGames(tournament.rounds);
    const indexData = await fetchIndexData(params.id, roundsWithGames);
    const indexMap = getIndexMap(indexData, roundsWithGames);
    const extendedGamesUrls = getExtendedGamesUrls(
      params.id,
      roundsWithGames,
      indexMap
    );
    const lookupMap = createGameLookupMap(extendedGamesUrls);
    const gamesData = await getGamesData(extendedGamesUrls);
    const pgns = generatePgn(
      tournament,
      indexMap,
      gamesData,
      extendedGamesUrls,
      lookupMap,
      includeEMT,
      includeClkAttr,
      includeClkComment
    );
    const response = new NextResponse(pgns);
    response.headers.set(
      'Content-disposition',
      `attachment; filename=${params.id}.pgn`
    );
    response.headers.set('Content-type', 'text/plain');
    return response;
  } catch (e) {
    return Response.json({ message: 'Invalid request' }, { status: 500 });
  }
}
