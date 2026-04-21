export function drawTiles(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (context) {
        const width = canvas.width;
        const height = canvas.height;

        context.fillStyle = 'red';
        context.fillRect(0, 0, width, height);

        const image = new Image();
        image.src = 'http://localhost:8000/storage/images/4waysafe.png'
        image.onload = () => {
            context.drawImage(image, 500, 600)
        };
    }
}