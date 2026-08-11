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