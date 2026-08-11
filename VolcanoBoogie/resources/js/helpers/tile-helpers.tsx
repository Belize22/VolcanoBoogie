import { Rotation } from '@/enums/rotation';
import { Coordinate } from '@/interfaces/coordinate';
import { PlacedSubtile } from '@/interfaces/placed-subtile';
import { retrieveTopLeftCoordAndBottomRightCoord } from '@/helpers/coordinate-helpers';

export function retrieveTileCenter(
    canvas: HTMLCanvasElement, 
    placedSubtiles: PlacedSubtile[],
    canvasCenter: Coordinate,
    adjustedTileSize: number,
) {
    const {topLeftmostCoordinate, bottomRightmostCoordinate} = retrieveTopLeftCoordAndBottomRightCoord(
        placedSubtiles
    );

    const centeredCoordinate = {
        x: (topLeftmostCoordinate.x + bottomRightmostCoordinate.x) / 2,
        y: (topLeftmostCoordinate.y + bottomRightmostCoordinate.y) / 2,
    }

    const tileCenterX = (canvas.width/2 - adjustedTileSize/2) 
        + canvasCenter.x + (centeredCoordinate.x * adjustedTileSize) 
        + adjustedTileSize/2;
    const tileCenterY = (canvas.height/2 - adjustedTileSize/2) 
        + canvasCenter.y + (-centeredCoordinate.y * adjustedTileSize) 
        + adjustedTileSize/2;

    return {tileCenterX, tileCenterY};
}

export function retrieveTileSize(
    placedSubtiles: PlacedSubtile[],
    rotation: Rotation,
    adjustedTileSize: number,
) {
    const {topLeftmostCoordinate, bottomRightmostCoordinate} = retrieveTopLeftCoordAndBottomRightCoord(
        placedSubtiles
    );

    //To calculate the tile size adjustments.
    const diffX = bottomRightmostCoordinate.x - topLeftmostCoordinate.x;
    const diffY = bottomRightmostCoordinate.y - topLeftmostCoordinate.y;

    //To account for canvas drawing different directions depending on rotation.
    const signOffset = (Rotation.SOUTH || Rotation.WEST) ? -1 : 1;

    let tileWidth = (adjustedTileSize * (diffX + 1))/2;
    let tileHeight = (adjustedTileSize * ((diffY * signOffset) + 1))/2;

    if (rotation === Rotation.EAST || rotation === Rotation.WEST) {
        //Need to get dimensions of tile pre-rotation for trigonometric manipulation to work
        //when drawing tile on canvas.
        [tileWidth, tileHeight] = [tileHeight, tileWidth];
    }

    return {tileWidth, tileHeight};
}