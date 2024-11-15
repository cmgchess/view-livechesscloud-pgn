import {
  Game,
  GameResult,
  Index,
  Pairing,
  Player,
  Tournament,
} from '@/types/dgt';
import { ExtendedGameUrl, LookupMap } from '@/types/utility';

function getGameResult(code: GameResult): string {
  switch (code) {
    case GameResult.WHITEWIN:
      return '1-0';
    case GameResult.BLACKWIN:
      return '0-1';
    case GameResult.DRAW:
      return '1/2-1/2';
    default:
      return '*';
  }
}

function convertDateFormat(inputDate: string): string {
  return inputDate.split('-').join('.');
}

function getFormattedMoves(moves: string[]): string {
  let str = '';
  for (let i = 0; i < moves.length; i++) {
    if (i % 2 == 0) {
      str += `${Math.ceil((i + 1) / 2).toString()}. `;
    }
    str += `${moves[i].split(' ')[0]} `;
  }
  str = str.trim();
  return str;
}

function getPlayerFullName(player: Player): string {
  const full = `${player?.lname ?? ''}, ${player?.fname ?? ''}${
    player?.mname ? ' ' + player?.mname : ''
  }`;
  return full.trim() === ',' ? '?' : full;
}

export function parseToPgn(
  tournament: Tournament,
  pairing: Pairing,
  game: Game,
  round: number,
  date: string
): string {
  const event = tournament.name || '?';
  const site = tournament.location || '?';
  const formattedDate = date ? convertDateFormat(date) : '?';
  const white = getPlayerFullName(pairing.white);
  const black = getPlayerFullName(pairing.black);
  const plyCount = game.moves.length;
  const result = getGameResult(game.result);
  const meta = [
    `[Event "${event}"]`,
    `[Site "${site}"]`,
    `[Date "${formattedDate}"]`,
    `[Round "${round}"]`,
    `[White "${white}"]`,
    `[Black "${black}"]`,
    `[Result "${result}"]`,
    `[PlyCount "${plyCount}"]`,
  ].join('\n');
  let pgn = meta;
  pgn += '\n\n';
  pgn += getFormattedMoves(game.moves);
  pgn += ` ${result}`;
  return pgn;
}

export function generatePgn(
  tournament: Tournament,
  indexMap: Record<number, Index>,
  gamesData: PromiseSettledResult<Game>[],
  extendedGamesUrls: ExtendedGameUrl[],
  lookupMap: LookupMap
): string {
  const pgn = gamesData
    .reduce((acc: string[], curr, idx) => {
      if (curr.status !== 'fulfilled') return acc;
      const rndAndGame = lookupMap[extendedGamesUrls[idx].url];
      const index = indexMap[rndAndGame.round];
      const pairing = index.pairings[rndAndGame.game - 1];
      const pgn = parseToPgn(
        tournament,
        pairing,
        curr.value,
        rndAndGame.round,
        index.date
      );
      acc.push(pgn);
      return acc;
    }, [])
    .join('\n\n');

  if (pgn === '') throw new Error();
  return pgn;
}
