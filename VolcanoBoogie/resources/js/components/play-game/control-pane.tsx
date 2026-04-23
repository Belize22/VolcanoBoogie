import { Dispatch, SetStateAction } from 'react';
import { Gamepad, Hand, CircleDot } from 'lucide-react'
import { CanvasInteractionState } from '@/enums/canvas-interaction-state'

type Props = {
    setZoomFactor: Dispatch<SetStateAction<number>>;
    canvasInteractionState: CanvasInteractionState;
    setCanvasInteractionState: Dispatch<SetStateAction<CanvasInteractionState>>;
};

export default function ControlPane({
    setZoomFactor,
    canvasInteractionState,
    setCanvasInteractionState
}: Props) {
    const UNSELECTED_STYLE = "mx-1 text-stone-300 hover:scale-110 hover:text-stone-100"
    const SELECTED_STYLE = "mx-1 bg-stone-100 text-stone-900 rounded-md"

    return (
        <div className="flex justify-center bg-stone-700 border-l shadow-lg rounded-xl p-4">
            <Gamepad
                className={
                    canvasInteractionState === CanvasInteractionState.GAME_INTERACTION ? 
                        SELECTED_STYLE : UNSELECTED_STYLE
                }
                onClick={() => setCanvasInteractionState(CanvasInteractionState.GAME_INTERACTION)}
            />
            <Hand
                className={
                    canvasInteractionState === CanvasInteractionState.MOVE_CANVAS ? 
                        SELECTED_STYLE : UNSELECTED_STYLE
                }
                onClick={() => setCanvasInteractionState(CanvasInteractionState.MOVE_CANVAS)}
            />
            <div className="w-0.5 h-6 mx-1 bg-stone-200"></div>
            <CircleDot 
                className={UNSELECTED_STYLE}
            />
        </div>
    );
}