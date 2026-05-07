import { PlacedTile } from '@/interfaces/placed-tile';

export interface Board {
    game_id: number,
    id: number,
    placed_tiles: PlacedTile[]
}