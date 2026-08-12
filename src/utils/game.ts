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

//FG
function formatSecondsToHMS(secondsStr: string): string {
  const total = Number(secondsStr);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}


/**
 * getFormattedMoves
 *
 * Returns the list of chess moves in a formatted string.  
 * Modified to also include:
 *  - EMT (Elapsed Move Time): the amount of time a player spent on each move.  
 *  - CLK (Clock): the remaining time on the player’s clock after the move.  
 *
 * This enhancement allows moves to be displayed together with timing information,
 * making it easier to analyze both the sequence of play and the players’ time management.
 */
function getFormattedMoves(moves: string[], includeEMT: boolean = true, includeClkAttr: boolean = true, includeClkComment: boolean = true): string {
  let str = '';

  for (let i = 0; i < moves.length; i++) {
    // Numero mossa
    if (i % 2 === 0) {
      str += `${Math.ceil((i + 1) / 2)}. `;
    }

    const parts = moves[i].split(' ');
    const move = parts[0];
    let emt = '';
    let clk = '';

    if (parts[1]) {
      if (parts[1].includes('+')) {
        const [clkPart, emtPart] = parts[1].split('+');
        clk = clkPart;
        emt = emtPart;
      } else {
        // solo un numero: assumiamo sia clk
        clk = parts[1];
      }
    }

    let comment = '';
    if (includeEMT && emt) comment += `[%emt ${formatSecondsToHMS(emt)}]`;
    if (includeClkAttr && clk) comment += `[%clk ${formatSecondsToHMS(clk)}]`;
    if (includeClkComment && clk) comment += `${formatSecondsToHMS(clk)}`;

    str += `${move}${comment ? ` {${comment}}` : ''} `;
  }

  return str.trim();
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
  date: string,
  includeEMT: boolean = true,
  includeClkAttr: boolean = true,
  includeClkComment: boolean = true
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
  pgn += getFormattedMoves(game.moves, includeEMT, includeClkAttr, includeClkComment);
  pgn += ` ${result}`;
  return pgn;
}

export function generatePgn(
  tournament: Tournament,
  indexMap: Record<number, Index>,
  gamesData: PromiseSettledResult<Game>[],
  extendedGamesUrls: ExtendedGameUrl[],
  lookupMap: LookupMap,
  includeEMT: boolean = true,
  includeClkAttr: boolean = true,
  includeClkComment: boolean = true
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
        index.date,
        includeEMT,
        includeClkAttr,
        includeClkComment
      );
      acc.push(pgn);
      return acc;
    }, [])
    .join('\n\n');

  if (pgn === '') throw new Error();
  return pgn;
}
