import { router } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Game } from '@/interfaces/game';
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

    function updateGameList() {
        const statusList = [GameStatus.IN_PROGRESS];

        if (showCompletedGames) {
            statusList.push(GameStatus.COMPLETE);
        }

        fetch('/api/get-games', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                statusList: statusList
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setCurrentGames(data.games);
            }
            else if (data.error) {
                console.log(data);
            }
        });
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
                        createGame={createGame}
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