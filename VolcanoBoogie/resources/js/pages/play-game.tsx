import { Head } from '@inertiajs/react';
import { useRef } from 'react';
import GameCanvas from '@/components/play-game/game-canvas'

export default function PlayGame() {
    const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);
    
    return (
        <>
            <Head title="Play Game" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <GameCanvas
                    gameCanvasRef={gameCanvasRef}
                />
            </div>
        </>
    );
}
