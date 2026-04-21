export function clearCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export function drawGrid(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (context) {
        const width = canvas.width;
        const height = canvas.height;

        for (let i = 1; i < Math.floor(width/10); i++) {
            context.strokeStyle = 'white';
            context.beginPath();
            context.setLineDash([5, 2]);
            context.moveTo(i * 100, 0);
            context.lineTo(i * 100, height);
            context.stroke();
        }

        for (let i = 1; i < Math.floor(height/10); i++) {
            context.strokeStyle = 'white';
            context.beginPath();
            context.setLineDash([5, 2]);
            context.moveTo(0, i * 100);
            context.lineTo(width, i * 100);
            context.stroke();
        }
    }
}

export function highlightCurrentTile(canvas: HTMLCanvasElement, posX: number, posY: number) {
    const context = canvas.getContext("2d");
    if (context) {
        //Highlight the specific tile in the grid, 
        //rather than have the highlighted square 
        //move continuously.
        const x = Math.floor(posX / 100) * 100;
        const y = Math.floor(posY / 100) * 100;
        
        context.fillStyle = 'rgba(255, 255, 0, 0.5)';
        context.fillRect(x, y, 100, 100);
    }
}