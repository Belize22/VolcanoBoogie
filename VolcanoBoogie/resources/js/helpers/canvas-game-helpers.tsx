import { Board } from '@/interfaces/board';
import { Coordinate } from '@/interfaces/coordinate';
import { convertRotationToNumeric } from '@/helpers/rotation-helpers';

export function drawTiles(
    canvas: HTMLCanvasElement, 
    board: Board, 
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

        for (let i = 0; i < board.placed_tiles.length; i++) {
            const image = new Image();

            //Get only coordinates of all subtiles for tile.
            const subtileCoordinates = board.placed_tiles[i].placed_subtiles.map(({ coordinate, ...fields}) => coordinate);

            //Since draw function for image always takes top and left as placement coordinates.
            const topLeftmostCoordinate = subtileCoordinates.reduce((prevCoord, currentCoord) => 
                currentCoord.x < prevCoord.x ? currentCoord : (currentCoord.y > prevCoord.y ? currentCoord : prevCoord)
            );

            image.src = `http://localhost:8000/storage/images/${board.placed_tiles[i].tile.tile_type}.png`
            image.onload = () => {
                const rotationOffset = board.placed_tiles[i].placed_subtiles.length === 1 ? 
                    convertRotationToNumeric(board.placed_tiles[i].placed_subtiles[0].rotation) : 
                    0;
                const tileCenterX = (canvas.width/2 - adjustedTileSize/2) 
                    + canvasCenter.x + (topLeftmostCoordinate.x * adjustedTileSize) 
                    + adjustedTileSize/2;
                const tileCenterY = (canvas.height/2 - adjustedTileSize/2) 
                    + canvasCenter.y + (-topLeftmostCoordinate.y * adjustedTileSize) 
                    + adjustedTileSize/2
                const rotationDegrees = rotationOffset * 90 * Math.PI/180;

                context.translate(tileCenterX,tileCenterY); //Make center of tile the pivot point of rotation.
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