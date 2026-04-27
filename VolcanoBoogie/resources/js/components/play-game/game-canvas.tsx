import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Board } from '@/interfaces/board';
import { Coordinate } from '@/interfaces/coordinate';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state';
import { adjustCanvasSizeToElement } from '@/helpers/canvas-helpers';
import { drawTiles } from '@/helpers/canvas-game-helpers';
import { clearCanvas, highlightCurrentTile, drawGrid } from '@/helpers/canvas-ui-helpers';

type Props = {
    board: Board;
    canvasCenter: Coordinate;
    setCanvasCenter: Dispatch<SetStateAction<Coordinate>>;
    zoomFactor: number;
    setZoomFactor: Dispatch<SetStateAction<number>>;
    canvasInteractionState: CanvasInteractionState;
    gameCanvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export default function GameCanvas({
    board,
    canvasCenter,
    setCanvasCenter,
    zoomFactor,
    setZoomFactor,
    canvasInteractionState,
    gameCanvasRef
}: Props) {
    const TILE_SIZE = 100;
    const MIN_ZOOM_FACTOR = 0.5;
    const MAX_ZOOM_FACTOR = 5;
    const SCROLL_SENSITIVITY = 0.005;

    const [isMovingCanvas, setIsMovingCanvas] = useState<boolean>(false);

    const uiOverlayRef = useRef<HTMLCanvasElement | null>(null);

    function renderCanvasElements() {
        resizeCanvases();
        if (gameCanvasRef.current !== null) {
            drawTiles(gameCanvasRef.current, board, TILE_SIZE, canvasCenter, zoomFactor);
        }

        if (uiOverlayRef.current !== null) {
            drawGrid(uiOverlayRef.current, TILE_SIZE, canvasCenter, zoomFactor);
        }
    }

    function handleMouseDown(event: MouseEvent) {
        if (canvasInteractionState === CanvasInteractionState.MOVE_CANVAS) {
            setIsMovingCanvas(true);
        }
    }

    function handleMouseUp(event: MouseEvent) {
        if (canvasInteractionState === CanvasInteractionState.MOVE_CANVAS) {
            setIsMovingCanvas(false);
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (canvasInteractionState === CanvasInteractionState.GAME_INTERACTION) {
            if (uiOverlayRef.current != null) {
                const canvas = uiOverlayRef.current;
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                clearCanvas(canvas);
                highlightCurrentTile(canvas, x, y, TILE_SIZE, canvasCenter, zoomFactor);
                drawGrid(canvas, TILE_SIZE, canvasCenter, zoomFactor);
            }
        }
        else if (canvasInteractionState === CanvasInteractionState.MOVE_CANVAS
            && isMovingCanvas
        ) {
            setCanvasCenter(
                {
                    x: canvasCenter.x + event.movementX, 
                    y: canvasCenter.y + event.movementY
                }
            )
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
    }, [canvasCenter, zoomFactor, canvasInteractionState]);

    useEffect(() => {
        window.addEventListener("resize", renderCanvasElements);
        if (uiOverlayRef.current !== null) {
            uiOverlayRef.current.addEventListener("mousedown", handleMouseDown);
            uiOverlayRef.current.addEventListener("mouseup", handleMouseUp);
            uiOverlayRef.current.addEventListener("mousemove", handleMouseMove);
            uiOverlayRef.current.addEventListener("wheel", handleMouseScroll);
        }
        return () => {
            window.removeEventListener("resize", renderCanvasElements);
            if (uiOverlayRef.current !== null) {
                uiOverlayRef.current.removeEventListener("mousedown", handleMouseDown);
                uiOverlayRef.current.removeEventListener("mouseup", handleMouseUp);
                uiOverlayRef.current.removeEventListener("mousemove", handleMouseMove);
                uiOverlayRef.current.removeEventListener("wheel", handleMouseScroll);
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