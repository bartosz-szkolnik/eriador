export type TileSpec = {
  tile: 'wall' | 'ground';
  ranges: [[number, number] | [number, number, number] | [number, number, number, number]];
  behavior: 'background' | 'ground';
  // type: 'TILE';
  // style: string;
  tileset: string;
};

export type RoomSpec = {
  spriteSheets: string[];
  backgrounds: TileSpec[];
};

export type SheetSpec = {
  imageURL: string;
  tileWidth: number;
  tileHeight: number;
  tiles?: {
    name: string;
    index: [number, number];
  }[];
  frames?: {
    name: string;
    rectangle: [number, number, number, number];
  }[];
  animations?: {
    name: string;
    frameLength: number;
    frames: string[];
  }[];
};
