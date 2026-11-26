import { CircleCheck } from 'lucide-react';
import { endTurn } from '@/services/board-service';

type Props = {
    gameId: number;
    updateGameState: <TArgs extends any[], TReturn>(serviceFunction: (...parameters: TArgs) => Promise<any>, ...parameters: TArgs) => Promise<void>;
}

export default function ActionMenu({
    gameId,
    updateGameState
}: Props) {
    return (
        <div className="py-1 m-1">
            <button 
                className="flex justify-center gap-2 p-1 bg-orange-600 rounded-lg border-2 border-stone-800 hover:scale-110 my-1"
                onClick={() => updateGameState(endTurn, gameId)}
            >
                <CircleCheck className="text-stone-900"/>
                <p className="text-stone-900">End Turn</p>
            </button>
        </div>
    )
}