import { PageProps } from '@inertiajs/core';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getGames } from '@/services/game-service';
import { ErrorDto } from '@/interfaces/error-dto';
import { Game } from '@/interfaces/game';
import { GamesDto } from '@/interfaces/games-dto';
import { GameStatus } from '@/enums/game-status';
import FilterPane from '@/components/view-games/filter-pane';
import GamePane from '@/components/view-games/game-pane';

interface PlayGameProps extends PageProps {
    games: Game[]
}

export default function ViewGames() {
    const { games } = usePage<PlayGameProps>().props;
    const [currentGames, setCurrentGames] = useState<Game[]>(games);
    const [showCompletedGames, setShowCompletedGames] = useState<boolean>(false);

    async function updateGameList() {
        const statusList = [GameStatus.IN_PROGRESS];

        if (showCompletedGames) {
            statusList.push(GameStatus.COMPLETE);
        }

        const data: GamesDto | ErrorDto = await getGames(statusList);

        if ("success" in data && data.success) {
            setCurrentGames(data.games);
        }
        else if ("error" in data && data.error) {
            console.log(data);
        }
    }

    useEffect(() => {
        updateGameList();
    }, [showCompletedGames]);

    return (
        <>
            <Head title="View Games" />
            <div className="flex w-screen h-screen flex-1 flex-col gap-4 overflow-x-auto">
                <div className="flex flex-col items-center justify-center bg-stone-900 border-l shadow-lg rounded-xl p-4 m-1">
                    <FilterPane
                        createGame={() => {router.get('/start-game')}}
                        showCompletedGames={showCompletedGames}
                        setShowCompletedGames={setShowCompletedGames}
                    />
                    <GamePane
                        games={currentGames}
                    />
                </div>
            </div>
        </>
    )
}