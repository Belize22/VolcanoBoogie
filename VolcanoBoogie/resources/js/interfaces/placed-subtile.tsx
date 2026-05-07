import { Coordinate } from '@/interfaces/coordinate';
import { PathType } from '@/enums/path-type';
import { Rotation } from '@/enums/rotation';

export interface PlacedSubtile {
    coordinate: Coordinate,
    id: number,
    is_neutralized: boolean,
    path_type: PathType,
    placed_tile_id: number,
    rotation: Rotation
}