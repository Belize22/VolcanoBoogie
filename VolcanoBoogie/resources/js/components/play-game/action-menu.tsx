import { CircleCheck } from 'lucide-react';

type Props = {
}

export default function ActionMenu({
}: Props) {
    return (
        <div className="py-1 m-1">
            <button 
                className="flex justify-center gap-2 p-1 bg-orange-600 rounded-lg border-2 border-stone-800 hover:scale-110 my-1"
                onClick={undefined}
            >
                <CircleCheck className="text-stone-900"/>
                <p className="text-stone-900">End Turn</p>
            </button>
        </div>
    )
}