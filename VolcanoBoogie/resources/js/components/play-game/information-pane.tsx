import { Sword, Swords } from 'lucide-react';
import { GameState } from '@/enums/game-state';

type Props = {
    gameState: GameState;
    zoomFactor: number;
    turns: number;
};

export default function InformationPane({
    gameState,
    zoomFactor,
    turns
}: Props) {
    function prettyPrintGameState(gameState: string) { 
        //Replace underscores with spaces.
        let prettyPrintedGameState = gameState.replaceAll('_', ' ');

        //Capitalize all first letters of each word.
        prettyPrintedGameState = prettyPrintedGameState.replace(/\b\w/g, char => char.toUpperCase());

        return prettyPrintedGameState;
    }

    function getExplorerToken() {
        return (
            <div className="bg-green-800 ml-auto rounded-3xl p-2 m-1 border-2 border-stone-900">
                <Sword className="size-7 text-amber-300"/>
            </div>
        );

        {/* Cursed side. Conditional to be implemented once back-end is updated accordingly. */}
        return (
            <div className="bg-red-800 ml-auto rounded-3xl p-2 m-1 border-2 border-stone-900">
                <Swords className="size-7 text-yellow-300"/>
            </div>
        );
    }

    return (
        <div className="flex items-center bg-stone-700 border-l shadow-lg rounded-2xl p-4 m-1">
            <div className="flex flex-col">
                <p>Current Action: {prettyPrintGameState(gameState)}</p>
                <p>Zoom Factor: {zoomFactor}</p>
            </div>
            {getExplorerToken()}
            <div className="bg-orange-600 rounded-3xl p-2 m-1 border-2 border-stone-900">
                <p className="text-xl text-stone-900">{turns}</p>
            </div>
        </div>
    )
}