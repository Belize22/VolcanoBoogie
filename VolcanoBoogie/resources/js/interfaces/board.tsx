import { PlacedTile } from '@/interfaces/placed-tile';

export interface Board {
    game_id: number,
    id: number,
    placed_tiles: PlacedTile[],
    turns: number,
    turns_remaining: number,
    is_cursed: boolean
}