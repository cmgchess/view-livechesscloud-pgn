import { Tournament, Index, Game } from '@/types/dgt';
import { ExtendedGameUrl } from '@/types/utility';

export function getTourneyUrl(id: string): string {
  return `https://1.pool.livechesscloud.com/get/${id}/tournament.json`;
}

export function getIndexUrl(id: string, round: number): string {
  return `https://1.pool.livechesscloud.com/get/${id}/round-${round}/index.json`;
}

export function getGameUrl(id: string, round: number, game: number): string {
  return `https://1.pool.livechesscloud.com/get/${id}/round-${round}/game-${game}.json?poll`;
}

export async function fetchTournament(id: string): Promise<Tournament> {
  const tournamentRes = await fetch(getTourneyUrl(id));
  return await tournamentRes.json();
}

export async function fetchIndexData(
  id: string,
  rounds: number[]
): Promise<Index[]> {
  const indexPromises = rounds.map((round) => fetch(getIndexUrl(id, round)));
  const indexResponses = await Promise.all(indexPromises);
  return await Promise.all(indexResponses.map((prom) => prom.json()));
}

export async function getGamesData(
  games: ExtendedGameUrl[]
): Promise<PromiseSettledResult<Game>[]> {
  const gamesPromises = games.map((game) =>
    fetch(game.url, { cache: 'no-store' })
  );
  const gamesResponses = await Promise.all(gamesPromises);
  return await Promise.allSettled(gamesResponses.map((prom) => prom.json()));
}
