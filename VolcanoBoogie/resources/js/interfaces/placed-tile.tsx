import { PlacedSubtile } from '@/interfaces/placed-subtile';
import { Tile } from '@/interfaces/tile';

export interface PlacedTile {
    anchor: PlacedSubtile | null,
    board_id: number,
    id: number,
    placed_subtiles: PlacedSubtile[],
    tile: Tile,
    tile_id: number
}