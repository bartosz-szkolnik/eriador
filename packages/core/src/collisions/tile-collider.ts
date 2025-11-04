import type { Entity } from '../entities';
import type { Matrix } from '../math';
import { type Tile } from './tile';
import { TileResolver } from './tile-resolver';

export class TileCollider {
  private readonly tiles = new TileResolver(this.tileMatrix);

  constructor(private tileMatrix: Matrix<Tile>) {}

  checkX(entity: Entity) {
    const { position, velocity, size } = entity;
    const { x: posX, y: posY } = position;
    const { x: velX } = velocity;
    const { x: sizeX, y: sizeY } = size;

    let x = 0;
    if (velX > 0) {
      x = posX + sizeX;
    } else if (velX < 0) {
      x = posX;
    } else {
      return;
    }

    const matches = this.tiles.searchByRange(x, x, posY, posY + sizeY);
    matches.forEach(match => {
      if (match.tile.name !== 'ground') {
        return;
      }

      if (velX > 0) {
        if (posX + sizeX > match.x1) {
          entity.position.x = match.x1 - sizeX;
          entity.velocity.x = 0;
        }
      } else if (velX < 0) {
        if (posX < match.x2) {
          entity.position.x = match.x2;
          entity.velocity.x = 0;
        }
      }
    });
  }

  checkY(entity: Entity) {
    const { position, velocity, size } = entity;
    const { x: posX, y: posY } = position;
    const { y: velY } = velocity;
    const { x: sizeX, y: sizeY } = size;

    let y = 0;
    if (velY > 0) {
      y = posY + sizeY;
    } else if (velY < 0) {
      y = posY;
    } else {
      return;
    }

    const matches = this.tiles.searchByRange(posX, posX + sizeX, y, y);
    matches.forEach(match => {
      if (match.tile.name !== 'ground') {
        return;
      }

      // if (match.tile.behavior === 'platform' && velY < 0) {
      //   return;
      // }

      if (velY > 0) {
        if (posY + sizeY > match.y1) {
          entity.position.y = match.y1 - sizeY;
          entity.velocity.y = 0;

          // entity.obstruct('bottom', match);
        }
      } else if (velY < 0) {
        if (posY < match.y2) {
          entity.position.y = match.y2;
          entity.velocity.y = 0;

          // entity.obstruct('top', match);
        }
      }
    });
  }

  test(entity: Entity) {
    this.checkX(entity);
    this.checkY(entity);
  }
}
