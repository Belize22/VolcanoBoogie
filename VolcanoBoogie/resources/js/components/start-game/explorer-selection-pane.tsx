import { useState, Dispatch, SetStateAction } from 'react';
import { ExplorerRole } from '@/enums/explorer-role';
import ExplorerLabelCard from '@/components/start-game/explorer-label-card';
import ExplorerOptionsPane from '@/components/start-game/explorer-options-pane';
import Modal from '@/components/modal';

type Props = {
    selectedNumExplorers: number;
    selectedExplorerRoles: (ExplorerRole | undefined)[];
    setSelectedExplorerRoles: Dispatch<SetStateAction<(ExplorerRole | undefined)[]>>;
}

export default function ExplorerSelectionPane({
    selectedNumExplorers,
    selectedExplorerRoles,
    setSelectedExplorerRoles
}: Props) {
    const [currentPlayer, setCurrentPlayer] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function openExplorerOptionsPane(selectedPlayer: number) {
        setCurrentPlayer(selectedPlayer);
        setIsModalOpen(true);
    }

    return (
        <div className="bg-stone-700 text-center p-2 m-2 rounded-xl">
            <p className="text-xl">Select Explorers</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-1">
            {selectedExplorerRoles.slice(0, selectedNumExplorers).map((selectedExplorerRole, index) => (
                <div className="flex items-center justify-center bg-stone-500 p-2 rounded-lg">
                    <p className="pr-3">Player {index + 1}: </p>
                    <button
                        className="hover:scale-105 w-full"
                        onClick={() => {openExplorerOptionsPane(index)}}
                    >
                        {selectedExplorerRole === undefined ? 
                            <p className="bg-stone-600 p-2 rounded-lg">Select Explorer...</p> :
                            <ExplorerLabelCard
                                explorerRole={selectedExplorerRole}
                            />
                        }
                    </button>
                </div>
            ))}
            </div>
            <Modal
                title={"Select Explorer"}
                description={"Select explorer you want to play as for the current player!"}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            >
                <ExplorerOptionsPane
                    selectedExplorerRoles={selectedExplorerRoles}
                    setSelectedExplorerRoles={setSelectedExplorerRoles}
                    currentPlayer={currentPlayer}
                    setIsModalOpen={setIsModalOpen}
                />
            </Modal>
        </div>
    )
}