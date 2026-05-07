import { Board } from '@/interfaces/board';
import { Coordinate } from '@/interfaces/coordinate';

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
            for (let j = 0; j < board.placed_tiles[i].placed_subtiles.length; j++) {
                const image = new Image();
                const subtile = board.placed_tiles[i].placed_subtiles[j];
                image.src = `http://localhost:8000/storage/images/4_way_safe.png`
                image.onload = () => {
                    context.drawImage(
                        image, 
                        (canvas.width/2 - adjustedTileSize/2) + canvasCenter.x + (subtile.coordinate.x * adjustedTileSize), 
                        (canvas.height/2 - adjustedTileSize/2) + canvasCenter.y + (-subtile.coordinate.y * adjustedTileSize),
                        image.naturalWidth * zoomFactor,
                        image.naturalHeight * zoomFactor
                    )
                };
            }
        }
    }
}