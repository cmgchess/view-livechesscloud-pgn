import {
  createGameLookupMap,
  fetchIndexData,
  fetchTournament,
  generatePgn,
  getExtendedGamesUrls,
  getGamesData,
  validateNumber,
} from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: { id: string; round: string; game: string } }
) {
  try {
    const tournament = await fetchTournament(params.id);
    const round = validateNumber(params.round);
    const game = validateNumber(params.game);
    const indexData = await fetchIndexData(params.id, [round]);
    const extendedGamesUrls = getExtendedGamesUrls(
      params.id,
      [round],
      indexData
    ).filter((g) => g.game === game);
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
    response.headers.set(
      'Content-disposition',
      `attachment; filename=${params.id}-R${round}-${game}.pgn`
    );
    response.headers.set('Content-type', 'text/plain');
    return response;
  } catch (e) {
    return Response.json({ message: 'Invalid request' }, { status: 500 });
  }
}
