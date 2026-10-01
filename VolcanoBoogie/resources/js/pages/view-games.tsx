import { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { Game } from '@/interfaces/game';
import FilterPane from '@/components/view-games/filter-pane';
import GamePane from '@/components/view-games/game-pane';

interface PlayGameProps extends PageProps {
    games: Game[]
}

export default function ViewGames() {
    return (
        <>
            <Head title="View Games" />
            <div className="flex w-screen h-screen flex-1 flex-col gap-4 overflow-x-auto">
                <div className="flex flex-col items-center justify-center bg-stone-900 border-l shadow-lg rounded-xl p-4 m-1">
                    <FilterPane/>
                    <GamePane/>
                </div>
            </div>
        </>
    )
}