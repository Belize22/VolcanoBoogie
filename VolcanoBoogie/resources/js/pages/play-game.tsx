import { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Game } from '@/interfaces/game';
import { Board } from '@/interfaces/board';
import { Coordinate } from '@/interfaces/coordinate';
import { PlacedTile } from '@/interfaces/placed-tile';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state';
import Sidebar from '@/components/play-game/sidebar';
import Footer from '@/components/play-game/footer';
import GameCanvas from '@/components/play-game/game-canvas';

interface PlayGameProps extends PageProps {
    game: Game,
}

export default function PlayGame() {
    const { game, tiles } = usePage<PlayGameProps>().props;

    const DEFAULT_CANVAS_CENTER: Coordinate = {x: 0, y: 0};
    const DEFAULT_ZOOM_FACTOR: number = 1;

    const [canvasCenter, setCanvasCenter] = useState<Coordinate>(DEFAULT_CANVAS_CENTER)
    const [zoomFactor, setZoomFactor] = useState<number>(DEFAULT_ZOOM_FACTOR);
    const [canvasInteractionState, setCanvasInteractionState] = 
        useState<CanvasInteractionState>(
            CanvasInteractionState.GAME_INTERACTION
        );

    const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const [currentGame, setCurrentGame] = useState<Game>(game);
    console.log(game)

    function placeTile(coordinate: Coordinate) {
        //TO-DO: Transfer responsibility to back-end.
    }
    
    return (
        <>
            <Head title="Play Game" />
            <div className="flex w-screen h-screen flex-1 flex-col gap-4 overflow-x-auto">
                <GameCanvas
                    board={currentGame.board}
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
