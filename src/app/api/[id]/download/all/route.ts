import { NextResponse } from 'next/server';
import {
  createGameLookupMap,
  getRoundsWithGames,
  fetchTournament,
  fetchIndexData,
  getExtendedGamesUrls,
  getGamesData,
  generatePgn,
} from '@/lib/utils';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const tournament = await fetchTournament(params.id);
    const roundsWithGames = getRoundsWithGames(tournament.rounds);
    const indexData = await fetchIndexData(params.id, roundsWithGames);

    const extendedGamesUrls = getExtendedGamesUrls(
      params.id,
      roundsWithGames,
      indexData
    );
    const lookupMap = createGameLookupMap(extendedGamesUrls);
    const gamesData = await getGamesData(extendedGamesUrls);
    const pgns = generatePgn(
      tournament,
      indexData,
      gamesData,
      extendedGamesUrls,
      lookupMap
    );
    const response = new NextResponse(pgns);
    const tournamentId = Buffer.from('tournament', 'utf-8').toString();
    response.headers.set(
      'Content-disposition',
      `attachment; filename=${tournamentId}.pgn`
    );
    response.headers.set('Content-type', 'text/plain');
    return response;
  } catch (e) {
    return Response.json({ message: 'Invalid request' }, { status: 500 });
  }
}
