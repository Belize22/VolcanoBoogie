import { useRef, useEffect } from 'react';
import { drawTiles } from '@/helpers/canvas-game-helpers'
import { drawGrid } from '@/helpers/canvas-ui-helpers'

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

    useEffect(() => {
        initializeCanvas();
    }, [])

    return (
        <>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <canvas style={{position: "absolute", zIndex: 0}} id="gameCanvas" width="1080" height="720" ref={gameCanvasRef}></canvas>
                <canvas style={{position: "absolute", zIndex: 1}} id="gameCanvas" width="1080" height="720" ref={uiOverlayRef}></canvas>
            </div>
        </>
    );
}