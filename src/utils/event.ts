import { Round, Index } from '@/types/dgt';
import { ExtendedGameUrl, LookupMap } from '@/types/utility';
import { getGameUrl } from '@/utils/api';

export function getExtendedGamesUrls(
  id: string,
  roundsWithGames: number[],
  indexMap: Record<number, Index>
) {
  return roundsWithGames.flatMap((round) => {
    return Array.from({ length: indexMap[round].pairings.length }, (_, i) => {
      return {
        url: getGameUrl(id, round, i + 1),
        round: round,
        game: i + 1,
      };
    });
  });
}

export function getIndexMap(indexData: Index[], rounds: number[]) {
  return indexData.reduce<Record<number, Index>>((acc, curr, idx) => {
    acc[rounds[idx]] = curr;
    return acc;
  }, {});
}

export function createGameLookupMap(games: ExtendedGameUrl[]) {
  return games.reduce((acc: LookupMap, curr) => {
    acc[curr.url] = {
      round: curr.round,
      game: curr.game,
    };
    return acc;
  }, {});
}

export function getRoundsWithGames(rounds: Round[]) {
  return rounds.reduce((acc: number[], curr, idx) => {
    if (curr.count > 0) acc.push(idx + 1);
    return acc;
  }, []);
}
