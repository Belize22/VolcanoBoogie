import { Dispatch, SetStateAction } from 'react';
import { Difficulty } from '@/enums/difficulty';
import { DifficultyOptions } from '@/interfaces/difficulty-options';
import { NumExplorerOptions } from '@/interfaces/num-explorer-options';
import ExplorerSelectionPane from '@/components/view-games/explorer-selection-pane';

type Props = {
    selectedNumExplorers: number;
    setSelectedNumExplorers: Dispatch<SetStateAction<number>>;
    selectedDifficulty: Difficulty;
    setSelectedDifficulty: Dispatch<SetStateAction<Difficulty>>;
}

export default function CreateGame({
    selectedNumExplorers,
    setSelectedNumExplorers,
    selectedDifficulty,
    setSelectedDifficulty
}: Props) {
    const UNSELECTED_NUM_EXPLORERS_STYLE = "bg-stone-500 p-2 px-3 m-1 rounded-lg hover:scale-110";
    const SELECTED_NUM_EXPLORERS_STYLE = "bg-stone-300 p-2 px-3 m-1 rounded-lg hover:scale-110";

    const numExplorerOptions: NumExplorerOptions[] = [
        {id: 1, numExplorers: 3},
        {id: 2, numExplorers: 4},
        {id: 3, numExplorers: 5},
        {id: 4, numExplorers: 6},
    ]

    const difficultyOptions: DifficultyOptions[] = [
        {id: 1, difficulty: Difficulty.BEGINNER, unselectedStyle: "bg-green-900 p-2 m-1 rounded-lg hover:scale-110", selectedStyle: "bg-green-500 p-2 m-1 rounded-lg"},
        {id: 2, difficulty: Difficulty.INTERMEDIATE, unselectedStyle: "bg-yellow-900 p-2 m-1 rounded-lg hover:scale-110", selectedStyle: "bg-yellow-500 p-2 m-1 rounded-lg"},
        {id: 3, difficulty: Difficulty.ADVANCED, unselectedStyle: "bg-red-900 p-2 m-1 rounded-lg hover:scale-110", selectedStyle: "bg-red-500 p-2 m-1 rounded-lg"},
        {id: 4, difficulty: Difficulty.EXPERT, unselectedStyle: "bg-purple-900 p-2 m-1 rounded-lg hover:scale-110", selectedStyle: "bg-purple-500 p-2 m-1 rounded-lg"},
    ]

    function prettyPrintDifficulty(difficulty: Difficulty) {
        //Capitalize first letter.
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="bg-stone-700 text-center p-2 mx-2 rounded-xl">
                    <p className="text-xl">Select Number of Explorers</p>
                    <div className="flex justify-center rounded-xl py-2">
                        {numExplorerOptions.map((numExplorerOption) => (
                            <button 
                                className={numExplorerOption.numExplorers === selectedNumExplorers ? SELECTED_NUM_EXPLORERS_STYLE : UNSELECTED_NUM_EXPLORERS_STYLE}
                                onClick={() => {setSelectedNumExplorers(numExplorerOption.numExplorers)}}
                            >
                                <p 
                                    className={numExplorerOption.numExplorers === selectedNumExplorers ? "text-stone-900" : "text-stone-100"}
                                >
                                    {numExplorerOption.numExplorers}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-stone-700 text-center p-2 mx-2 rounded-xl">
                    <p className="text-xl">Select Difficulty</p>
                    <div className="flex justify-center rounded-xl py-2">
                        {difficultyOptions.map((difficultyOption) => (
                            <button 
                                className={difficultyOption.difficulty === selectedDifficulty ? difficultyOption.selectedStyle : difficultyOption.unselectedStyle}
                                onClick={() => {setSelectedDifficulty(difficultyOption.difficulty)}}
                            >
                                <p 
                                    className={difficultyOption.difficulty === selectedDifficulty ? "text-stone-900" : "text-stone-100"}
                                >
                                    {prettyPrintDifficulty(difficultyOption.difficulty)}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <ExplorerSelectionPane/>
        </>
    );
}