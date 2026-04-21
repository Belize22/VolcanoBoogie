import { useRef, useEffect } from 'react';
import { drawTiles } from '@/helpers/canvas-game-helpers'
import { clearCanvas, highlightCurrentTile, drawGrid } from '@/helpers/canvas-ui-helpers'

type Props = {
    gameCanvasRef: React.RefObject<HTMLCanvasElement | null>
};

export default function GameCanvas({
    gameCanvasRef
}: Props) {
    const uiOverlayRef = useRef<HTMLCanvasElement | null>(null);

    function initializeCanvas() {
        if (gameCanvasRef.current !== null) {
            drawTiles(gameCanvasRef.current);
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

    useEffect(() => {
        initializeCanvas();
    }, [])

    useEffect(() => {
        if (uiOverlayRef.current !== null) {
            uiOverlayRef.current.addEventListener("mousemove", handleMouseMove)
        }
        return () => {
            if (uiOverlayRef.current !== null) {
                uiOverlayRef.current.removeEventListener("mousemove", handleMouseMove)
            }
        }
    })

    return (
        <>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <canvas style={{position: "absolute", zIndex: 0}} id="gameCanvas" width="1080" height="720" ref={gameCanvasRef}></canvas>
                <canvas style={{position: "absolute", zIndex: 1}} id="gameCanvas" width="1080" height="720" ref={uiOverlayRef}></canvas>
            </div>
        </>
    );
}