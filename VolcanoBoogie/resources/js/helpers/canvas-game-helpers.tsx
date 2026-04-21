import { Board } from '@/interfaces/board'

export function drawTiles(canvas: HTMLCanvasElement, board: Board) {
    const context = canvas.getContext("2d");
    if (context) {
        const width = canvas.width;
        const height = canvas.height;

        context.fillStyle = 'rgba(50, 0, 0, 1)';
        context.fillRect(0, 0, width, height);

        for (let i = 0; i < board.tiles.length; i++) {
            for (let j = 0; j < board.tiles[i].subtiles.length; j++) {
                const image = new Image();
                const subtile = board.tiles[i].subtiles[j];
                image.src = `http://localhost:8000/storage/images/${subtile.image}`
                image.onload = () => {
                    context.drawImage(image, 500 + (subtile.coordinate.x * 100), 600 + (subtile.coordinate.y * 100))
                };
            }
        }
    }
}