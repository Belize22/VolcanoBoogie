import { useState, Dispatch, SetStateAction } from 'react';
import { Head, router } from '@inertiajs/react';
import { Difficulty } from '@/enums/difficulty';
import { ExplorerRole } from '@/enums/explorer-role';
import { DifficultyOptions } from '@/interfaces/difficulty-options';
import { NumExplorerOptions } from '@/interfaces/num-explorer-options';
import ExplorerSelectionPane from '@/components/start-game/explorer-selection-pane';

export default function StartGame() {
    const UNSELECTED_NUM_EXPLORERS_STYLE = "bg-stone-500 p-2 px-3 m-1 rounded-lg hover:scale-110";
    const SELECTED_NUM_EXPLORERS_STYLE = "bg-stone-300 p-2 px-3 m-1 rounded-lg hover:scale-110";
        
    const [selectedNumExplorers, setSelectedNumExplorers] = useState<number>(4);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.INTERMEDIATE);
    const [selectedExplorerRoles, setSelectedExplorerRoles] = useState<(ExplorerRole | undefined)[]>(
        new Array(6).fill(undefined)
    );

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
    
    function createGame() {
        fetch('/api/create-game', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                router.get(data.redirect_url);
            }
            if (data.error) {
                console.log(data);
            }
        });
    }

    return (
        <>
            <Head title="Start Game" />
            <div className="flex w-screen h-screen flex-1 flex-col gap-4 overflow-x-auto">
                <div className="flex flex-col items-center justify-center bg-stone-900 border-l shadow-lg rounded-xl p-4 m-1">
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
                    <ExplorerSelectionPane
                        selectedNumExplorers={selectedNumExplorers}
                        selectedExplorerRoles={selectedExplorerRoles}
                        setSelectedExplorerRoles={setSelectedExplorerRoles}
                    />
                </div>
            </div>
        </>
    );
}