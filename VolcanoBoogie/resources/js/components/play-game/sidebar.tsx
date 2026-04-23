import { Dispatch, SetStateAction } from 'react';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state'
import ControlPane from '@/components/play-game/control-pane'

type Props = {
    zoomFactor: number;
    setZoomFactor: Dispatch<SetStateAction<number>>;
    canvasInteractionState: CanvasInteractionState;
    setCanvasInteractionState: Dispatch<SetStateAction<CanvasInteractionState>>;
};

export default function Sidebar({
    zoomFactor,
    setZoomFactor,
    canvasInteractionState,
    setCanvasInteractionState
}: Props) {
    return (
        <div className="fixed inset-y-0 right-0 w-2/10 bg-stone-900 border-l shadow-lg">
            Current Zoom Factor: {zoomFactor}
            <ControlPane
                setZoomFactor={setZoomFactor}
                canvasInteractionState={canvasInteractionState}
                setCanvasInteractionState={setCanvasInteractionState}
            />
        </div>
    );
}