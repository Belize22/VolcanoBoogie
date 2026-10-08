import { Dispatch, SetStateAction } from 'react';
import { Gamepad, Hand, ZoomOut, ZoomIn, CircleDot } from 'lucide-react'
import { Coordinate } from '@/interfaces/coordinate';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state'

type Props = {
    setCanvasCenter: Dispatch<SetStateAction<Coordinate>>;
    defaultCanvasCenter: Coordinate;
    zoomFactor: number;
    setZoomFactor: Dispatch<SetStateAction<number>>;
    defaultZoomFactor: number;
    minZoomFactor: number;
    maxZoomFactor: number;
    scrollSensitivity: number;
    canvasInteractionState: CanvasInteractionState;
    setCanvasInteractionState: Dispatch<SetStateAction<CanvasInteractionState>>;
};

export default function ControlPane({
    setCanvasCenter,
    defaultCanvasCenter,
    zoomFactor,
    setZoomFactor,
    defaultZoomFactor,
    minZoomFactor,
    maxZoomFactor,
    scrollSensitivity,
    canvasInteractionState,
    setCanvasInteractionState
}: Props) {
    const UNSELECTED_STYLE = "mx-1 text-stone-300 hover:scale-110 hover:text-stone-100";
    const SELECTED_STYLE = "mx-1 bg-stone-100 text-stone-900 rounded-md";
    const DISABLED_STYLE = "mx-1 text-stone-300 opacity-50";

    function zoomOut() {
        let updatedZoomFactor;

        if (zoomFactor - scrollSensitivity < minZoomFactor) {
            updatedZoomFactor = minZoomFactor;
        }
        else {
            updatedZoomFactor = zoomFactor - scrollSensitivity;
        }
        
        updatedZoomFactor = Math.round(updatedZoomFactor * 10) / 10; //1 decimal place.
        setZoomFactor(updatedZoomFactor);
    }    
    
    function zoomIn() {
        let updatedZoomFactor;

        if (zoomFactor + scrollSensitivity > maxZoomFactor) {
            updatedZoomFactor = maxZoomFactor;
        }
        else {
            updatedZoomFactor = zoomFactor + scrollSensitivity;
        }
        
        updatedZoomFactor = Math.round(updatedZoomFactor * 10) / 10; //1 decimal place.
        setZoomFactor(updatedZoomFactor);
    }

    function resetCenterAndZoom() {
        setCanvasCenter(defaultCanvasCenter);
        setZoomFactor(defaultZoomFactor);
    }

    return (
        <div className="flex justify-center bg-stone-700 border-l shadow-lg rounded-xl p-4 my-1">
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
            <ZoomOut
                className={zoomFactor > minZoomFactor ? UNSELECTED_STYLE : DISABLED_STYLE}
                onClick={zoomFactor > minZoomFactor ? zoomOut : undefined}
            />
            <ZoomIn
                className={zoomFactor < maxZoomFactor ? UNSELECTED_STYLE : DISABLED_STYLE}
                onClick={zoomFactor < maxZoomFactor ? zoomIn : undefined}
            />
            <CircleDot 
                className={UNSELECTED_STYLE}
                onClick={resetCenterAndZoom}
            />
        </div>
    );
}