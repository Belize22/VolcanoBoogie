import { Head } from '@inertiajs/react';
import { useRef } from 'react';
import { Board } from '@/interfaces/board'
import GameCanvas from '@/components/play-game/game-canvas'

export default function PlayGame() {
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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <GameCanvas
                    board={board}
                    gameCanvasRef={gameCanvasRef}
                />
            </div>
        </>
    );
}
