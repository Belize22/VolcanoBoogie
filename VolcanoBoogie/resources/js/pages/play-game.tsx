import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Board } from '@/interfaces/board';
import { Coordinate } from '@/interfaces/coordinate';
import { Tile } from '@/interfaces/tile';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state';
import Sidebar from '@/components/play-game/sidebar';
import Footer from '@/components/play-game/footer';
import GameCanvas from '@/components/play-game/game-canvas';

export default function PlayGame() {
    const DEFAULT_CANVAS_CENTER: Coordinate = {x: 0, y: 0};
    const DEFAULT_ZOOM_FACTOR: number = 1;

    const [canvasCenter, setCanvasCenter] = useState<Coordinate>(DEFAULT_CANVAS_CENTER)
    const [zoomFactor, setZoomFactor] = useState<number>(DEFAULT_ZOOM_FACTOR);
    const [canvasInteractionState, setCanvasInteractionState] = 
        useState<CanvasInteractionState>(
            CanvasInteractionState.GAME_INTERACTION
        );

    const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const [board, setBoard] = useState<Board>({
        tiles: [
            {subtiles: [{coordinate: {x: 0, y: 0}, image: '4waysafe.png'}]},
            {subtiles: [{coordinate: {x: -2, y: -2}, image: '4waysafe.png'}]}
        ]
    });

    function placeTile(coordinate: Coordinate) {
        const coordinates = board.tiles.flatMap(tile => tile.subtiles.flatMap(subtile => subtile.coordinate));
        if (!coordinates.some(currentCoordinate => currentCoordinate.x === coordinate.x && currentCoordinate.y === coordinate.y)) {
            const newTile: Tile = {subtiles: [{coordinate: coordinate, image: '4waysafe.png'}]}
            setBoard({...board, tiles: [...board.tiles, newTile]})
        }
    }
    
    return (
        <>
            <Head title="Play Game" />
            <div className="flex w-screen h-screen flex-1 flex-col gap-4 overflow-x-auto">
                <GameCanvas
                    board={board}
                    canvasCenter={canvasCenter}
                    setCanvasCenter={setCanvasCenter}
                    zoomFactor={zoomFactor}
                    setZoomFactor={setZoomFactor}
                    canvasInteractionState={canvasInteractionState}
                    placeTile={placeTile}
                    gameCanvasRef={gameCanvasRef}
                />
                <Footer />
                <Sidebar
                    setCanvasCenter={setCanvasCenter}
                    defaultCanvasCenter={DEFAULT_CANVAS_CENTER}
                    zoomFactor={zoomFactor}
                    setZoomFactor={setZoomFactor}
                    defaultZoomFactor={DEFAULT_ZOOM_FACTOR}
                    canvasInteractionState={canvasInteractionState}
                    setCanvasInteractionState={setCanvasInteractionState}
                />
            </div>
        </>
    );
}
