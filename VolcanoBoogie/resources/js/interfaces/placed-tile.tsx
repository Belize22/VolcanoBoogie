import { PlacedSubtile } from '@/interfaces/placed-subtile';
import { Tile } from '@/interfaces/tile';
import { PlacementStatus } from '@/enums/placement-status';
import { Rotation } from '@/enums/rotation';

export interface PlacedTile {
    anchor: PlacedSubtile | null,
    board_id: number,
    id: number,
    placed_subtiles: PlacedSubtile[],
    placement_status: PlacementStatus,
    rotation: Rotation,
    tile: Tile,
    tile_id: number
}