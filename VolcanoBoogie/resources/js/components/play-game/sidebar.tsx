import { router } from '@inertiajs/react';
import { Dispatch, SetStateAction } from 'react';
import { Coordinate } from '@/interfaces/coordinate';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state';
import { GameState } from '@/enums/game-state';
import { GameStatus } from '@/enums/game-status';
import { FileChartColumn, SquareMenu } from 'lucide-react';
import ControlPane from '@/components/play-game/control-pane';
import RotationPane from '@/components/play-game/rotation-pane';
import InformationPane from '@/components/play-game/information-pane';

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
    confirmTileRotation: () => void;
    confirmSanctumRotation: () => void;
    rotateTile: (isClockwise: boolean) => void;
    rotateSanctum: (isClockwise: boolean) => void;
    gameState: GameState;
    gameStatus: GameStatus;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({
    setCanvasCenter,
    defaultCanvasCenter,
    zoomFactor,
    setZoomFactor,
    defaultZoomFactor,
    minZoomFactor,
    maxZoomFactor,
    scrollSensitivity,
    canvasInteractionState,
    setCanvasInteractionState,
    confirmTileRotation,
    confirmSanctumRotation,
    rotateTile,
    rotateSanctum,
    gameState,
    gameStatus,
    setIsModalOpen
}: Props) {
    return (
        <div className="flex flex-col h-screen fixed inset-y-0 right-0 w-2/10 bg-stone-900 border-l shadow-lg">
            <InformationPane
                zoomFactor={zoomFactor}
            />
            <ControlPane
                setCanvasCenter={setCanvasCenter}
                defaultCanvasCenter={defaultCanvasCenter}
                zoomFactor={zoomFactor}
                setZoomFactor={setZoomFactor}
                defaultZoomFactor={defaultZoomFactor}
                minZoomFactor={minZoomFactor}
                maxZoomFactor={maxZoomFactor}
                scrollSensitivity={scrollSensitivity}
                canvasInteractionState={canvasInteractionState}
                setCanvasInteractionState={setCanvasInteractionState}
            />
            {(gameState === GameState.ROTATING_TILE || gameState === GameState.ROTATING_SANCTUM) && 
                <RotationPane
                    confirmTileRotation={gameState === GameState.ROTATING_TILE ? confirmTileRotation : confirmSanctumRotation}
                    rotateTile={gameState === GameState.ROTATING_TILE ? rotateTile : rotateSanctum}
                />
            }

            {gameStatus === GameStatus.COMPLETE && 
                <div className="mt-auto flex flex-col items-center justify-center py-2">
                    <button 
                        className="flex justify-center gap-2 p-2 w-4/5 bg-stone-400 rounded-lg hover:scale-110 my-1"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FileChartColumn className="text-stone-800"/>
                        <p className="text-stone-800">View Results</p>
                    </button>
                    <button 
                        className="flex justify-center gap-2 p-2 w-4/5 bg-stone-400 rounded-lg hover:scale-110 my-1"
                        onClick={() => {router.get('/play-game');}}
                    >
                        <SquareMenu className="text-stone-800"/>
                        <p className="text-stone-800">Back to Game Menu</p>
                    </button>
                </div>
            }
        </div>
    );
}