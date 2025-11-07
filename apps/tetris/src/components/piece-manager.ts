import { LimitedArray } from '@eriador/core';
import { getPiece, type Piece, type PieceSymbol } from './pieces';

export class PieceManager {
  private readonly lastThreePieces = new LimitedArray<PieceSymbol>(3);

  init() {
    const piece = this.getNewPiece();
    const nextPiece = this.getNewPiece();

    return { piece, nextPiece };
  }

  next() {
    return this.getNewPiece();
  }

  private getNewPiece() {
    let newPieceSymbol = this.generateNewPieceSymbol();
    while (this.lastThreePieces.includes(newPieceSymbol)) {
      newPieceSymbol = this.generateNewPieceSymbol();
    }

    this.lastThreePieces.push(newPieceSymbol);
    return getPiece(newPieceSymbol);
  }

  private generateNewPieceSymbol() {
    const pieces = 'ILJOTSZ';
    const randomIndex = Math.floor(pieces.length * Math.random());
    return pieces[randomIndex] as PieceSymbol;
  }

  static getPiece(piece: PieceSymbol): Piece {
    return getPiece(piece);
  }
}
