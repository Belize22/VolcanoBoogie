import { Dice } from '@/interfaces/dice';

export interface DiceRoll {
    board_id: number,
    dice: Dice[],
    id: number 
}