import { PlacedSubtile } from '@/interfaces/placed-subtile';

export interface PlacedTile {
    anchor: PlacedSubtile | null,
    board_id: number,
    id: number,
    placed_subtiles: PlacedSubtile[],
    tile_id: number
}