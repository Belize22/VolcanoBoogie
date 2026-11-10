import { HazardDice } from '@/interfaces/hazard-dice';
import { NumericalDice } from '@/interfaces/numerical-dice';

export interface Dice {
    hazard_dice: HazardDice | null,
    numerical_dice: NumericalDice | null
}