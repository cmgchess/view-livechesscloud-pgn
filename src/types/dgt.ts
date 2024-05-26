export enum GameResult {
  WHITEWIN = 'WHITEWIN',
  BLACKWIN = 'BLACKWIN',
  DRAW = 'DRAW',
  NO_RESULT = '*',
}

export interface Tournament {
  id: string;
  name: string;
  location: string;
  country: string;
  website: string | null;
  rules: string;
  chess960: string;
  timecontrol: string;
  rounds: Round[];
  eboards: string[];
}

export interface Round {
  count: number;
  live: number;
}

export interface Player {
  fname: string | null;
  mname: string | null;
  lname: string | null;
  title: string | null;
  federation: string | null;
  gender: string | null;
  fideid: number | null;
}

export interface Pairing {
  white: Player;
  black: Player;
  result: string;
  live: boolean;
}

export interface Index {
  date: string;
  pairings: Pairing[];
}

export interface Game {
  live: boolean;
  serialNr: string;
  firstMove: number;
  chess960: number;
  result: GameResult;
  moves: string[];
}
