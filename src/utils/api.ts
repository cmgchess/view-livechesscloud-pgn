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
  const tournamentRes = await fetch(getTourneyUrl(id), {
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  });
  return await tournamentRes.json();
}

export async function fetchIndexData(
  id: string,
  rounds: number[]
): Promise<Index[]> {
  const indexPromises = rounds.map((round) => fetch(getIndexUrl(id, round), {
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  }));
  const indexResponses = await Promise.all(indexPromises);
  return await Promise.all(indexResponses.map((prom) => prom.json()));
}

export async function getGamesData(
  games: ExtendedGameUrl[]
): Promise<PromiseSettledResult<Game>[]> {
  const gamesPromises = games.map((game) =>
    fetch(game.url, {
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  })
  );
  const gamesResponses = await Promise.all(gamesPromises);
  return await Promise.allSettled(gamesResponses.map((prom) => prom.json()));
}
