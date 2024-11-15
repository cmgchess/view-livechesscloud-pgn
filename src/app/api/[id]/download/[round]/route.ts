import { fetchTournament, fetchIndexData, getGamesData } from '@/utils/api';
import { generatePgn } from '@/utils/game';
import { createGameLookupMap, getExtendedGamesUrls } from '@/utils/event';
import { validateNumber } from '@/utils/validators';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: { id: string; round: string } }
) {
  try {
    const tournament = await fetchTournament(params.id);
    const round = validateNumber(params.round);
    const indexData = await fetchIndexData(params.id, [round]);
    const extendedGamesUrls = getExtendedGamesUrls(params.id, [round], {
      [round]: indexData[0],
    });
    const lookupMap = createGameLookupMap(extendedGamesUrls);
    const gamesData = await getGamesData(extendedGamesUrls);
    const pgns = generatePgn(
      tournament,
      { [round]: indexData[0] },
      gamesData,
      extendedGamesUrls,
      lookupMap
    );
    const response = new NextResponse(pgns);
    response.headers.set(
      'Content-disposition',
      `attachment; filename=${params.id}-R${round}.pgn`
    );
    response.headers.set('Content-type', 'text/plain');
    return response;
  } catch (e) {
    return Response.json({ message: 'Invalid request' }, { status: 500 });
  }
}
