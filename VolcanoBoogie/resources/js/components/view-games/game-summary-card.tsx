import { router } from '@inertiajs/react';
import { Game } from '@/interfaces/game';
import { GameStatus } from '@/enums/game-status';
import { Play, FileChartColumn } from 'lucide-react';

type Props = {
    index: number,
    game: Game
}

export default function GameSummaryCard({
    index,
    game
}: Props) {
    const IN_PROGRESS_BACKGROUND = "flex flex-col items-center bg-stone-500 p-2 rounded-lg";
    const COMPLETED_BACKGROUND = "flex flex-col items-center bg-yellow-600 p-2 rounded-lg"
    const IN_PROGRESS_BUTTON = "flex items-center justify-center gap-2 p-2 bg-green-600 rounded-lg hover:scale-110";
    const COMPLETED_BUTTON = "flex items-center justify-center gap-2 p-2 bg-gray-800 rounded-lg hover:scale-110";

    return (
        <div key={index} className={game.status === GameStatus.IN_PROGRESS ? IN_PROGRESS_BACKGROUND : COMPLETED_BACKGROUND}>
            <p className="p-1 text-lg">Game {game.id}</p>
            <button 
                onClick={() => {router.get('/play-game/' + game.id)}}
                className={game.status === GameStatus.IN_PROGRESS ? IN_PROGRESS_BUTTON : COMPLETED_BUTTON}
            >
                {game.status === GameStatus.IN_PROGRESS ? <Play/> : <FileChartColumn/>}
                <p>{game.status === GameStatus.IN_PROGRESS ? "Continue Game" : "View Results"}</p>
            </button>
        </div>
    )
}