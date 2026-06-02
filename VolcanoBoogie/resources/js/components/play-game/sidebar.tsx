import { Dispatch, SetStateAction } from 'react';
import { Coordinate } from '@/interfaces/coordinate';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state';
import { GameState } from '@/enums/game-state';
import ControlPane from '@/components/play-game/control-pane';
import RotationPane from '@/components/play-game/rotation-pane';

type Props = {
    setCanvasCenter: Dispatch<SetStateAction<Coordinate>>;
    defaultCanvasCenter: Coordinate;
    zoomFactor: number;
    setZoomFactor: Dispatch<SetStateAction<number>>;
    defaultZoomFactor: number;
    canvasInteractionState: CanvasInteractionState;
    setCanvasInteractionState: Dispatch<SetStateAction<CanvasInteractionState>>;
    rotateTile: (isClockwise: boolean) => void;
    gameState: GameState;
};

export default function Sidebar({
    setCanvasCenter,
    defaultCanvasCenter,
    zoomFactor,
    setZoomFactor,
    defaultZoomFactor,
    canvasInteractionState,
    setCanvasInteractionState,
    rotateTile,
    gameState
}: Props) {
    return (
        <div className="fixed inset-y-0 right-0 w-2/10 bg-stone-900 border-l shadow-lg">
            Current Zoom Factor: {zoomFactor}
            <ControlPane
                setCanvasCenter={setCanvasCenter}
                defaultCanvasCenter={defaultCanvasCenter}
                setZoomFactor={setZoomFactor}
                defaultZoomFactor={defaultZoomFactor}
                canvasInteractionState={canvasInteractionState}
                setCanvasInteractionState={setCanvasInteractionState}
            />
            {gameState === GameState.ROTATING_TILE && 
                <RotationPane
                    rotateTile={rotateTile}
                />
            }
        </div>
    );
}