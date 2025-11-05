export type TileSpec = {
  tile: 'wall' | 'ground';
  ranges: [[number, number] | [number, number, number] | [number, number, number, number]];
  behavior: 'background' | 'ground';
  // type: 'TILE';
  // style: string;
  // tileset: 'foreground' | 'background';
};

export type RoomSpec = {
  spriteSheet: string;
  backgrounds: TileSpec[];
};

export type SheetSpec = {
  imageURL: string;
  tileWidth: number;
  tileHeight: number;
  tiles: {
    name: string;
    index: [number, number];
  }[];
};
