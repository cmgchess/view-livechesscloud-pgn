export type LookupMap = {
  [key: string]: {
    round: number;
    game: number;
  };
};

export interface ExtendedGameUrl {
  url: string;
  round: number;
  game: number;
}
