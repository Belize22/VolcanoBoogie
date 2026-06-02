import { Coordinate } from '@/interfaces/coordinate';
import { PlacedSubtile } from '@/interfaces/placed-subtile';

export function retrieveTileCenter(
    canvas: HTMLCanvasElement, 
    placedSubtiles: PlacedSubtile[],
    canvasCenter: Coordinate,
    adjustedTileSize: number,
) {
    //Get only coordinates of all subtiles for tile.
    const subtileCoordinates = placedSubtiles.map(({ coordinate, ...fields}) => coordinate);

    //Since draw function for image always takes top and left as placement coordinates.
    const topLeftmostCoordinate = subtileCoordinates.reduce((prevCoord, currentCoord) => 
        currentCoord.x < prevCoord.x ? currentCoord : (currentCoord.y > prevCoord.y ? currentCoord : prevCoord)
    );

    const tileCenterX = (canvas.width/2 - adjustedTileSize/2) 
        + canvasCenter.x + (topLeftmostCoordinate.x * adjustedTileSize) 
        + adjustedTileSize/2;
    const tileCenterY = (canvas.height/2 - adjustedTileSize/2) 
        + canvasCenter.y + (-topLeftmostCoordinate.y * adjustedTileSize) 
        + adjustedTileSize/2;

    return {tileCenterX, tileCenterY};
}