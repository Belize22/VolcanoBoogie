import { Game } from '@/interfaces/game';

export interface GamesDto {
    success: string,
    message: string,
    games: Game[]
}