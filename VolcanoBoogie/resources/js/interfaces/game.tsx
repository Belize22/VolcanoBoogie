import { Board } from '@/interfaces/board';
import { GameState } from '@/enums/game-state';
import { GameStatus } from '@/enums/game-status';

export interface Game {
    board: Board,
    id: number,
    status: GameStatus,
    game_state: GameState,
}