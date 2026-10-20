import { Dispatch, SetStateAction } from 'react';
import { ExplorerRole } from '@/enums/explorer-role';
import ExplorerLabelCard from '@/components/start-game/explorer-label-card';

type Props = {
    selectedExplorerRoles: (ExplorerRole | undefined)[];
    setSelectedExplorerRoles: Dispatch<SetStateAction<(ExplorerRole | undefined)[]>>;
    currentPlayer: number | null;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ExplorerOptionsPane({
    selectedExplorerRoles,
    setSelectedExplorerRoles,
    currentPlayer,
    setIsModalOpen
}: Props) {
    const ENABLED_STYLE = "hover:scale-105";
    const DISABLED_STYLE = "opacity-50";
    const explorerRoles = Object.values(ExplorerRole);

    function confirmChoice(selectedExplorerRole: ExplorerRole) {
        setSelectedExplorerRoles(prevExplorerRoles =>
            prevExplorerRoles.map((explorerRole, index) => index === currentPlayer ? selectedExplorerRole : explorerRole)
        );
        setIsModalOpen(false);
    }
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-1">
            {explorerRoles.map((explorerRole) => (
                <button 
                    className={selectedExplorerRoles.includes(explorerRole) ? DISABLED_STYLE : ENABLED_STYLE}
                    onClick={selectedExplorerRoles.includes(explorerRole) ? undefined : () => {confirmChoice(explorerRole)}}
                >
                    <ExplorerLabelCard
                        explorerRole={explorerRole}
                    />
                </button>
            ))}
            </div>
        </>
    )
}