import { Coordinate } from '@/interfaces/coordinate';
import { PlacedTile } from '@/interfaces/placed-tile';
import { convertRotationToNumeric } from '@/helpers/rotation-helpers';
import { retrieveTileCenter } from '@/helpers/tile-helpers';

export function drawTiles(
    canvas: HTMLCanvasElement, 
    placedTiles: PlacedTile[], 
    tileSize: number, 
    canvasCenter: Coordinate, 
    zoomFactor: number
) {
    const context = canvas.getContext("2d");
    if (context) {
        const width = canvas.width;
        const height = canvas.height;

        const adjustedTileSize = tileSize * zoomFactor;

        context.fillStyle = 'rgba(50, 0, 0, 1)';
        context.fillRect(0, 0, width, height);

        for (let i = 0; i < placedTiles.length; i++) {
            const image = new Image();

            image.src = `http://localhost:8000/storage/images/${placedTiles[i].tile.tile_type}.png`
            image.onload = () => {
                const rotationOffset = placedTiles[i].placed_subtiles.length === 1 ? 
                    convertRotationToNumeric(placedTiles[i].placed_subtiles[0].rotation) : 
                    0;
                const rotationDegrees = rotationOffset * 90 * Math.PI/180;

                const {tileCenterX, tileCenterY} = retrieveTileCenter(
                    canvas,
                    placedTiles[i].placed_subtiles,
                    canvasCenter,
                    adjustedTileSize
                )

                context.translate(tileCenterX, tileCenterY); //Make center of tile the pivot point of rotation.
                context.rotate(rotationDegrees); //Rotate the tile to its proper orientation.
                context.drawImage(
                    image, 
                    -adjustedTileSize/2, //Conversion from center defined square to top-left defined square.
                    -adjustedTileSize/2,
                    image.naturalWidth * zoomFactor,
                    image.naturalHeight * zoomFactor
                )

                //Rotation and translation must be isolated at the scope of a tile placement.
                //Otherwise context adds up and tiles are placed weirdly.
                context.rotate(-rotationDegrees); 
                context.translate(-tileCenterX, -tileCenterY);
                context.restore();
            };
        }
    }
}