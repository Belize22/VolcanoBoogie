import { useState, Dispatch, SetStateAction } from 'react';
import { Head, router } from '@inertiajs/react';
import { Play, X } from 'lucide-react';
import { Difficulty } from '@/enums/difficulty';
import { ExplorerRole } from '@/enums/explorer-role';
import { DifficultyOptions } from '@/interfaces/difficulty-options';
import { NumExplorerOptions } from '@/interfaces/num-explorer-options';
import ExplorerSelectionPane from '@/components/start-game/explorer-selection-pane';

export default function StartGame() {
    const UNSELECTED_NUM_EXPLORERS_STYLE = "bg-stone-500 p-2 px-3 m-1 rounded-lg hover:scale-110";
    const SELECTED_NUM_EXPLORERS_STYLE = "bg-stone-300 p-2 px-3 m-1 rounded-lg hover:scale-110";
    const DISABLED_START_GAME_STYLE = "ml-auto flex items-center gap-2 p-2 bg-green-600 rounded-lg opacity-50";
    const ENABLED_START_GAME_STYLE = "ml-auto flex items-center gap-2 p-2 bg-green-600 rounded-lg hover:scale-110";
        
    const [selectedNumExplorers, setSelectedNumExplorers] = useState<number>(4);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
    const [selectedExplorerRoles, setSelectedExplorerRoles] = useState<(ExplorerRole | undefined)[]>(
        new Array(selectedNumExplorers).fill(undefined)
    );

    const numExplorerOptions: NumExplorerOptions[] = [
        {id: 1, numExplorers: 3},
        {id: 2, numExplorers: 4},
        {id: 3, numExplorers: 5},
        {id: 4, numExplorers: 6},
    ]

    const difficultyOptions: DifficultyOptions[] = [
        {
            id: 1, 
            difficulty: Difficulty.BEGINNER, 
            unselectedStyle: "bg-green-900 p-2 m-1 rounded-lg hover:scale-110", 
            selectedStyle: "bg-green-500 p-2 m-1 rounded-lg"
        },
        {
            id: 2, 
            difficulty: Difficulty.NORMAL, 
            unselectedStyle: "bg-yellow-900 p-2 m-1 rounded-lg hover:scale-110", 
            selectedStyle: "bg-yellow-500 p-2 m-1 rounded-lg"
        },
        {
            id: 3, 
            difficulty: Difficulty.ADVANCED, 
            unselectedStyle: "bg-red-900 p-2 m-1 rounded-lg hover:scale-110", 
            selectedStyle: "bg-red-500 p-2 m-1 rounded-lg"
        },
        {
            id: 4, 
            difficulty: Difficulty.EXPERT, 
            unselectedStyle: "bg-purple-900 p-2 m-1 rounded-lg hover:scale-110", 
            selectedStyle: "bg-purple-500 p-2 m-1 rounded-lg"
        },
    ]

    function changeNumExplorers(selectedNumExplorers: number) {
        setSelectedNumExplorers(selectedNumExplorers);

        if (selectedNumExplorers < selectedExplorerRoles.length) {
            setSelectedExplorerRoles(selectedExplorerRoles.slice(0, selectedNumExplorers));
        }
        else if (selectedNumExplorers > selectedExplorerRoles.length) {
            const additionalExplorerRoles: (ExplorerRole | undefined)[] = new Array(
                selectedNumExplorers - selectedExplorerRoles.length
            ).fill(undefined);
            
            setSelectedExplorerRoles(
                previousSelectedExplorerRoles => previousSelectedExplorerRoles.concat(additionalExplorerRoles)
            );
        }
    }
    
    function createGame() {
        fetch('/api/create-game', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selectedExplorerRoles: selectedExplorerRoles, 
                selectedDifficulty: selectedDifficulty
            })
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
                    <div className="bg-stone-700 rounded-xl">
                        <div className="text-center p-2 mx-2">
                            <p className="text-xl">Select Number of Explorers</p>
                            <div className="flex justify-center rounded-xl py-2">
                                {numExplorerOptions.map((numExplorerOption) => (
                                    <button 
                                        className={numExplorerOption.numExplorers === selectedNumExplorers ? SELECTED_NUM_EXPLORERS_STYLE : UNSELECTED_NUM_EXPLORERS_STYLE}
                                        onClick={() => {changeNumExplorers(numExplorerOption.numExplorers)}}
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
                        <hr className="border-t border-stone-100 mx-3" />
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
                                            {difficultyOption.difficulty.charAt(0).toUpperCase() + difficultyOption.difficulty.slice(1)}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <hr className="border-t border-stone-100 mx-3" />
                        <ExplorerSelectionPane
                            selectedNumExplorers={selectedNumExplorers}
                            selectedExplorerRoles={selectedExplorerRoles}
                            setSelectedExplorerRoles={setSelectedExplorerRoles}
                        />
                        <hr className="border-t border-stone-100 mx-3" />
                        <div className="flex items-center bg-stone-700 p-2 m-2 rounded-xl">
                            <button
                                className="flex items-center gap-2 p-2 m-2 bg-red-500 rounded-lg hover:scale-110"
                                onClick={() => {router.get('/play-game')}}
                            >
                                <X/>
                                <p>Cancel</p>
                            </button>
                            <button
                                className={selectedExplorerRoles.includes(undefined) ? DISABLED_START_GAME_STYLE : ENABLED_START_GAME_STYLE}
                                onClick={selectedExplorerRoles.includes(undefined) ? undefined : createGame}
                            >
                                <Play/>
                                <p>Start Game</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}