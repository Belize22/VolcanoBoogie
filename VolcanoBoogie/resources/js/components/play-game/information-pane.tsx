import { GameState } from '@/enums/game-state';

type Props = {
    gameState: GameState
    zoomFactor: number
};

export default function InformationPane({
    gameState,
    zoomFactor
}: Props) {
    function prettyPrintGameState(gameState: string) { 
        //Replace underscores with spaces.
        let prettyPrintedGameState = gameState.replaceAll('_', ' ');

        //Capitalize all first letters of each word.
        prettyPrintedGameState = prettyPrintedGameState.replace(/\b\w/g, char => char.toUpperCase());

        return prettyPrintedGameState;
    }

    return (
        <div className="flex flex-col justify-center bg-stone-700 border-l shadow-lg rounded-2xl p-4 my-1">
            <p>Current Action: {prettyPrintGameState(gameState)}</p>
            <p>Zoom Factor: {zoomFactor}</p>
        </div>
    )
}