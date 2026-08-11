import { Rotation } from '@/enums/rotation';
import { Coordinate } from '@/interfaces/coordinate';
import { PlacedSubtile } from '@/interfaces/placed-subtile';

export function retrieveTopLeftCoordAndBottomRightCoord(
    placedSubtiles: PlacedSubtile[],
) {
    //Get only coordinates of all subtiles for specified tile.
    const subtileCoordinates = placedSubtiles.map(({ coordinate, ...fields}) => coordinate);

    const topLeftmostCoordinate = subtileCoordinates.reduce((prevCoord, currentCoord) => 
        currentCoord.x < prevCoord.x ? currentCoord : (currentCoord.y > prevCoord.y ? currentCoord : prevCoord)
    );
    
    const bottomRightmostCoordinate = subtileCoordinates.reduce((prevCoord, currentCoord) => 
        currentCoord.x > prevCoord.x ? currentCoord : (currentCoord.y < prevCoord.y ? currentCoord : prevCoord)
    );

    return {topLeftmostCoordinate, bottomRightmostCoordinate};
}

export function getCoordinateRelativeToDirection(coordinate: Coordinate, rotation: Rotation) {
    if (rotation === Rotation.NORTH) {
        return {x: coordinate.x, y: coordinate.y + 1};
    }
    else if (rotation === Rotation.EAST) {
        return {x: coordinate.x + 1, y: coordinate.y};
    }
    else if (rotation === Rotation.SOUTH) {
        return {x: coordinate.x, y: coordinate.y - 1};
    }    
    else { //WEST
        return {x: coordinate.x - 1, y: coordinate.y};
    }
}