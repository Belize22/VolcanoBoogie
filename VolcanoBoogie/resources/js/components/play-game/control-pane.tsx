import { Dispatch, SetStateAction } from 'react';
import { Gamepad, Hand, CircleDot } from 'lucide-react'

type Props = {
    setZoomFactor: Dispatch<SetStateAction<number>>;
};

export default function ControlPane({
    setZoomFactor
}: Props) {
    const UNSELECTED_STYLE = "mx-1 text-stone-300 hover:scale-110 hover:text-stone-100"
    return (
        <div className="flex justify-center bg-stone-700 border-l shadow-lg rounded-xl p-4">
            <Gamepad
                className={UNSELECTED_STYLE}
            />
            <Hand 
                className={UNSELECTED_STYLE}
            />
            <div className="w-0.5 h-6 mx-1 bg-stone-200"></div>
            <CircleDot 
                className={UNSELECTED_STYLE}
            />
        </div>
    );
}