import { Coordinate } from '@/interfaces/coordinate'

export function clearCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export function drawGrid(
    canvas: HTMLCanvasElement, 
    tileSize: number, 
    canvasCenter: Coordinate, 
    zoomFactor: number
) {
    const context = canvas.getContext("2d");
    if (context) {
        const DASH_LENGTH = 5;
        const DASH_GAP_LENGTH = 2;

        const width = canvas.width;
        const height = canvas.height;

        const adjustedTileSize = tileSize * zoomFactor;

        //Ideal range is i = 1, i < Math.floor(width/tileSize)
        //We expand that range by 1 on each side to account for off-centering
        //for grid lines relative to the current center position of the canvas.
        for (let i = 0; i < Math.floor(width/adjustedTileSize) + 2; i++) {
            context.strokeStyle = 'white';
            context.beginPath();
            context.setLineDash([DASH_LENGTH, DASH_GAP_LENGTH]);
            context.moveTo(i * adjustedTileSize + (width/2 % adjustedTileSize) - adjustedTileSize/2 + (canvasCenter.x % adjustedTileSize), 0);
            context.lineTo(i * adjustedTileSize + (width/2 % adjustedTileSize) - adjustedTileSize/2 + (canvasCenter.x % adjustedTileSize), height);
            context.stroke();
        }

        for (let i = 0; i < Math.floor(height/adjustedTileSize) + 2; i++) {
            context.strokeStyle = 'white';
            context.beginPath();
            context.setLineDash([DASH_LENGTH, DASH_GAP_LENGTH]);
            context.moveTo(0, i * adjustedTileSize + (height/2 % adjustedTileSize) - adjustedTileSize/2 + (canvasCenter.y % adjustedTileSize));
            context.lineTo(width, i * adjustedTileSize + (height/2 % adjustedTileSize) - adjustedTileSize/2 + (canvasCenter.y % adjustedTileSize));
            context.stroke();
        }
    }
}

export function highlightCurrentTile(
    canvas: HTMLCanvasElement, 
    posX: number, 
    posY: number, 
    tileSize: number, 
    canvasCenter: Coordinate,
    zoomFactor: number
) {
    const context = canvas.getContext("2d");
    if (context) {
        const width = canvas.width;
        const height = canvas.height;

        const adjustedTileSize = tileSize * zoomFactor;

        const WIDTH_OFFSET = (width/2 % adjustedTileSize) - adjustedTileSize/2 + (canvasCenter.x % adjustedTileSize);
        const HEIGHT_OFFSET = (height/2 % adjustedTileSize) - adjustedTileSize/2 + (canvasCenter.y % adjustedTileSize);

        //Highlight the specific tile in the grid, 
        //rather than have the highlighted square 
        //move continuously.
        //Subtract by width offset to ensure moving mouse to a different tile
        //properly changes highlighted tile.
        const x = Math.floor((posX - WIDTH_OFFSET) / adjustedTileSize) * adjustedTileSize;
        const y = Math.floor((posY - HEIGHT_OFFSET) / adjustedTileSize) * adjustedTileSize;
        
        context.fillStyle = 'rgba(255, 255, 0, 0.5)';

        //Add by width offset to ensure highlighted square fits grid tile.
        context.fillRect(x + WIDTH_OFFSET, y + HEIGHT_OFFSET, adjustedTileSize, adjustedTileSize);
    }
}