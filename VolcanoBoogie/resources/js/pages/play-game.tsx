import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Board } from '@/interfaces/board';
import { Coordinate } from '@/interfaces/coordinate';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state';
import Sidebar from '@/components/play-game/sidebar';
import Footer from '@/components/play-game/footer';
import GameCanvas from '@/components/play-game/game-canvas';

export default function PlayGame() {
    const DEFAULT_ZOOM_FACTOR = 1;

    const [canvasCenter, setCanvasCenter] = useState<Coordinate>({x: 0, y: 0})
    const [zoomFactor, setZoomFactor] = useState<number>(DEFAULT_ZOOM_FACTOR);
    const [canvasInteractionState, setCanvasInteractionState] = 
        useState<CanvasInteractionState>(
            CanvasInteractionState.GAME_INTERACTION
        );

    const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const board: Board = {
        tiles: [
            {subtiles: [{coordinate: {x: 0, y: 0}, image: '4waysafe.png'}]},
            {subtiles: [{coordinate: {x: -2, y: -2}, image: '4waysafe.png'}]}
        ]
    };
    
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
                    gameCanvasRef={gameCanvasRef}
                />
                <Footer />
                <Sidebar 
                    zoomFactor={zoomFactor}
                    setZoomFactor={setZoomFactor}
                    canvasInteractionState={canvasInteractionState}
                    setCanvasInteractionState={setCanvasInteractionState}
                />
            </div>
        </>
    );
}
