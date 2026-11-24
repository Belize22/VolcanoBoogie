import { DiceRoll } from '@/interfaces/dice-roll';
import { Game } from '@/interfaces/game';

export interface GameDto {
    success: string,
    message: string,
    game: Game,
    diceRoll?: DiceRoll
}