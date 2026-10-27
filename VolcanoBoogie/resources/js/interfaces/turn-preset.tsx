import { Difficulty } from '@/enums/difficulty';

export interface TurnPreset {
    id: number,
    players: number,
    difficulty: Difficulty,
    turns: number
}