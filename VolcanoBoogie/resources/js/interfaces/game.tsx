import { Board } from '@/interfaces/board';
import { Player } from '@/interfaces/player'
import { GameState } from '@/enums/game-state';
import { GameStatus } from '@/enums/game-status';

export interface Game {
    board: Board,
    id: number,
    status: GameStatus,
    game_state: GameState,
    players: Player[],
    current_player: Player | null
}