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