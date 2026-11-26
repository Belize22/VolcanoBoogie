import { Difficulty } from '@/enums/difficulty';
import { ExplorerRole } from '@/enums/explorer-role';
import { GameStatus } from '@/enums/game-status';

export async function getGames(statusList: GameStatus[]) {
    const response = await fetch('/api/get-games', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            statusList: statusList
        })
    });

    const data = await response.json();
    return data;
}

export async function createGame(
    selectedExplorerRoles: (ExplorerRole | undefined)[],
    selectedDifficulty: Difficulty
) {
    const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            selectedExplorerRoles: selectedExplorerRoles, 
            selectedDifficulty: selectedDifficulty
        })
    });

    const data = await response.json();
    return data;
}