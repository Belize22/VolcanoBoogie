import { Board } from '@/interfaces/board';
import { GameStatus } from '@/enums/game-status';

export interface Game {
    board: Board,
    id: number,
    status: GameStatus
}