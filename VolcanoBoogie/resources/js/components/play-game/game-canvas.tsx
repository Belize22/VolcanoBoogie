import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Board } from '@/interfaces/board';
import { Coordinate } from '@/interfaces/coordinate';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state';
import { GameState } from '@/enums/game-state';
import { PlacementStatus } from '@/enums/placement-status';
import { adjustCanvasSizeToElement } from '@/helpers/canvas-helpers';
import { drawTiles } from '@/helpers/canvas-game-helpers';
import { 
    clearCanvas, 
    highlightCurrentTile, 
    highlightPlacementCandidates,
    convertCanvasCoordinatesToTileCoordinates, 
    drawGrid,
    applyShadowOverlay
} from '@/helpers/canvas-ui-helpers';

type Props = {
    availableSpots: Coordinate[];
    board: Board;
    canvasCenter: Coordinate;
    setCanvasCenter: Dispatch<SetStateAction<Coordinate>>;
    zoomFactor: number;
    setZoomFactor: Dispatch<SetStateAction<number>>;
    canvasInteractionState: CanvasInteractionState;
    placeTile: (coordinate: Coordinate) => void;
    gameCanvasRef: React.RefObject<HTMLCanvasElement | null>;
    gameState: GameState
};

export default function GameCanvas({
    availableSpots,
    board,
    canvasCenter,
    setCanvasCenter,
    zoomFactor,
    setZoomFactor,
    canvasInteractionState,
    placeTile,
    gameCanvasRef,
    gameState
}: Props) {
    const TILE_SIZE = 100;
    const MIN_ZOOM_FACTOR = 0.5;
    const MAX_ZOOM_FACTOR = 5;
    const SCROLL_SENSITIVITY = 0.2;

    const [isMovingCanvas, setIsMovingCanvas] = useState<boolean>(false);

    const uiOverlayRef = useRef<HTMLCanvasElement | null>(null);

    function renderCanvasElements() {
        resizeCanvases();
        if (gameCanvasRef.current !== null) {
            drawTiles(
                gameCanvasRef.current, 
                board.placed_tiles, TILE_SIZE, 
                canvasCenter, 
                zoomFactor
            );
        }

        if (uiOverlayRef.current !== null) {
            if (gameState === GameState.ROTATING_TILE) {
                applyShadowOverlay(
                    uiOverlayRef.current,
                    board.placed_tiles.filter(placed_tile => placed_tile.placement_status === PlacementStatus.PENDING),
                    TILE_SIZE,
                    canvasCenter,
                    zoomFactor
                );
            }
            else if (gameState === GameState.PLACING_TILE || gameState === GameState.PLACING_SANCTUM) {
                highlightPlacementCandidates(uiOverlayRef.current, TILE_SIZE, canvasCenter, zoomFactor, availableSpots);
            }
            drawGrid(uiOverlayRef.current, TILE_SIZE, canvasCenter, zoomFactor);
        }
    }

    function handleMouseDown(event: MouseEvent) {
        if (canvasInteractionState === CanvasInteractionState.GAME_INTERACTION) {
            if (uiOverlayRef.current != null) {
                const canvas = uiOverlayRef.current;
                const rect = canvas.getBoundingClientRect();
                const posX = event.clientX - rect.left;
                const posY = event.clientY - rect.top;

                let coordinate: Coordinate | null = null;

                coordinate = convertCanvasCoordinatesToTileCoordinates(
                    canvas, 
                    posX, 
                    posY, 
                    TILE_SIZE, 
                    canvasCenter, 
                    zoomFactor
                );

                if (coordinate) {
                    placeTile(coordinate);
                }
            }
        }
        else if (canvasInteractionState === CanvasInteractionState.MOVE_CANVAS) {
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
                if (gameState === GameState.PLACING_TILE || gameState === GameState.PLACING_SANCTUM) {
                    highlightCurrentTile(canvas, x, y, TILE_SIZE, canvasCenter, zoomFactor);
                    highlightPlacementCandidates(canvas, TILE_SIZE, canvasCenter, zoomFactor, availableSpots);
                }
                else if (gameState === GameState.ROTATING_TILE) {
                    applyShadowOverlay(
                        uiOverlayRef.current,
                        board.placed_tiles.filter(placed_tile => placed_tile.placement_status === PlacementStatus.PENDING),
                        TILE_SIZE,
                        canvasCenter,
                        zoomFactor
                    );
                }
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
            let updatedZoomFactor = zoomFactor - Math.sign(event.deltaY) * SCROLL_SENSITIVITY

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
    }, [availableSpots, board, canvasCenter, zoomFactor, canvasInteractionState]);

    useEffect(() => {
        window.addEventListener("resize", renderCanvasElements);
        if (uiOverlayRef.current !== null) {
            uiOverlayRef.current.addEventListener("mousedown", handleMouseDown);
            uiOverlayRef.current.addEventListener("mouseup", handleMouseUp);
            uiOverlayRef.current.addEventListener("mousemove", handleMouseMove);
            uiOverlayRef.current.addEventListener("mouseleave", renderCanvasElements);
            uiOverlayRef.current.addEventListener("wheel", handleMouseScroll);
        }
        return () => {
            window.removeEventListener("resize", renderCanvasElements);
            if (uiOverlayRef.current !== null) {
                uiOverlayRef.current.removeEventListener("mousedown", handleMouseDown);
                uiOverlayRef.current.removeEventListener("mouseup", handleMouseUp);
                uiOverlayRef.current.removeEventListener("mousemove", handleMouseMove);
                uiOverlayRef.current.removeEventListener("mouseleave", renderCanvasElements);
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