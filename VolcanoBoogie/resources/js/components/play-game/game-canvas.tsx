import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Board } from '@/interfaces/board'
import { adjustCanvasSizeToElement } from '@/helpers/canvas-helpers'
import { drawTiles } from '@/helpers/canvas-game-helpers'
import { clearCanvas, highlightCurrentTile, drawGrid } from '@/helpers/canvas-ui-helpers'

type Props = {
    board: Board;
    zoomFactor: number;
    setZoomFactor: Dispatch<SetStateAction<number>>;
    gameCanvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export default function GameCanvas({
    board,
    zoomFactor,
    setZoomFactor,
    gameCanvasRef
}: Props) {
    const MIN_ZOOM_FACTOR = 0.1;
    const MAX_ZOOM_FACTOR = 10;
    const SCROLL_SENSITIVITY = 0.01;

    const uiOverlayRef = useRef<HTMLCanvasElement | null>(null);

    function renderCanvasElements() {
        resizeCanvases();
        if (gameCanvasRef.current !== null) {
            drawTiles(gameCanvasRef.current, board);
        }

        if (uiOverlayRef.current !== null) {
            drawGrid(uiOverlayRef.current);
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (uiOverlayRef.current != null) {
            const canvas = uiOverlayRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            clearCanvas(canvas);
            highlightCurrentTile(canvas, x, y);
            drawGrid(canvas);
        }
    }

    function handleMouseScroll(event: WheelEvent) {
        if (uiOverlayRef.current != null) {
            let updatedZoomFactor = zoomFactor - event.deltaY * SCROLL_SENSITIVITY

            //Clamp between MIN_ZOOM_FACTOR and MAX_ZOOM_FACTOR
            updatedZoomFactor = Math.max(MIN_ZOOM_FACTOR, Math.min(MAX_ZOOM_FACTOR, updatedZoomFactor));
            updatedZoomFactor = Math.round(updatedZoomFactor * 10) / 10; //1 decimal place.

            setZoomFactor(updatedZoomFactor);
        }
    }

    function resizeCanvases() {
        gameCanvasRef.current ? adjustCanvasSizeToElement(gameCanvasRef.current) : {};
        uiOverlayRef.current ? adjustCanvasSizeToElement(uiOverlayRef.current) : {};
    }

    useEffect(() => {
        renderCanvasElements();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", renderCanvasElements);
        if (uiOverlayRef.current !== null) {
            uiOverlayRef.current.addEventListener("mousemove", handleMouseMove);
            uiOverlayRef.current.addEventListener("wheel", handleMouseScroll);
        }
        return () => {
            window.removeEventListener("resize", renderCanvasElements);
            if (uiOverlayRef.current !== null) {
                uiOverlayRef.current.removeEventListener("mousemove", handleMouseMove);
            }
        }
    });

    return (
        <>
            <div className="max-w-3/4 flex-1 bg-gray-100 p-4">
                <canvas style={{position: "absolute", top: 0, left: 0, zIndex: 0}} id="gameCanvas" className="w-8/10 h-9/10" ref={gameCanvasRef}></canvas>
                <canvas style={{position: "absolute", top: 0, left: 0, zIndex: 1}} id="uiCanvas" className="w-8/10 h-9/10" ref={uiOverlayRef}></canvas>
            </div>
        </>
    );
}