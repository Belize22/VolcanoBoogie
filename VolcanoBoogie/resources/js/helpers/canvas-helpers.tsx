export function adjustCanvasSizeToElement(canvas: HTMLCanvasElement) {
    if (canvas != null) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
}