import { Difficulty } from '@/enums/difficulty';

export interface DifficultyOptions {
    id: number,
    difficulty: Difficulty,
    unselectedStyle: string,
    selectedStyle: string
}