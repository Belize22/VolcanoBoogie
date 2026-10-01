import { Game } from '@/interfaces/game';
import GameSummaryCard from '@/components/view-games/game-summary-card';

type Props = {
    games: Game[]
}

export default function GamePane({
    games
}: Props) {
    return (
        <div className="flex justify-center bg-stone-700 border-l shadow-lg rounded-xl p-1 m-1 w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-1 w-4/5">
                {games.map((game, index) => (
                    <GameSummaryCard
                        index={index}
                        game={game}
                    />
                ))}
            </div>
        </div>
    );
}