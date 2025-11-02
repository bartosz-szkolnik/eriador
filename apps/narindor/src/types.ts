export type TileSpec = {
  tile: 'wall' | 'ground';
  // ranges: [[number, number] | [number, number, number] | [number, number, number, number]];
  ranges: [[number, number, number, number]];
  // type: 'TILE';
  // style: string;
  // behavior: 'empty' | 'ground'; // | 'brick' | 'coin';
  // tileset: 'foreground' | 'background';
};

export type LevelSpec = {
  backgrounds: TileSpec[];
};
