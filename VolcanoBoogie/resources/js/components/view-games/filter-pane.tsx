import { useState } from 'react';
import { Dices } from 'lucide-react';

type Props = {

}

export default function FilterPane({

}: Props) {
    const [showCompletedGames, useShowCompletedGames] = useState<boolean>(false);

    return (
        <div className="flex bg-stone-500 border-l shadow-lg rounded-xl p-4 m-1 w-3/4">
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={showCompletedGames}
                    onChange={() => useShowCompletedGames(!showCompletedGames)}
                    className="size-5 accent-yellow-200"
                />
                <span className="px-1">Show Completed Games</span>
            </label>
            <button className="ml-auto flex items-center gap-2 p-2 bg-green-600 rounded-lg hover:scale-110">
                <Dices/>
                <p>New Game</p>
            </button>
        </div>
    );
}