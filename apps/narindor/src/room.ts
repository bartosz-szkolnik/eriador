import { Camera, Compositor, type Layer } from '@eriador/common';
import { Entity, Matrix, TileCollider, type GameContext, type Tile } from '@eriador/core';

// type Tile = {
//   name: string;
// };

const GRAVITY = 2000;

export class Room {
  private readonly compositor = new Compositor();
  private readonly entities = new Set<Entity>();
  readonly tiles = new Matrix<Tile>();

  readonly tileCollider = new TileCollider(this.tiles);

  totalTime = 0;

  addLayer(layer: Layer) {
    this.compositor.addLayer(layer);
  }

  draw(context: CanvasRenderingContext2D, camera: Camera) {
    this.compositor.draw(context, camera);
  }

  update(gameContext: GameContext) {
    const { deltaTime } = gameContext;
    this.entities.forEach(entity => {
      entity.update(gameContext);

      entity.position.x += entity.velocity.x * deltaTime;
      this.tileCollider.checkX(entity);

      entity.position.y += entity.velocity.y * deltaTime;
      this.tileCollider.checkY(entity);

      entity.velocity.y += GRAVITY * deltaTime;
    });

    this.totalTime += deltaTime;
  }

  addEntity(entity: Entity) {
    this.entities.add(entity);
  }

  getEntities() {
    return this.entities;
  }
}
