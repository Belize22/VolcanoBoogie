import { CircleCheck } from 'lucide-react';

type Props = {
    endTurn: () => void;
}

export default function ActionMenu({
    endTurn
}: Props) {
    return (
        <div className="py-1 m-1">
            <button 
                className="flex justify-center gap-2 p-1 bg-orange-600 rounded-lg border-2 border-stone-800 hover:scale-110 my-1"
                onClick={endTurn}
            >
                <CircleCheck className="text-stone-900"/>
                <p className="text-stone-900">End Turn</p>
            </button>
        </div>
    )
}