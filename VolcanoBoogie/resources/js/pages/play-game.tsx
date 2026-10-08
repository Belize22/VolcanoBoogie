import { PageProps } from '@inertiajs/core';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Game } from '@/interfaces/game';
import { Coordinate } from '@/interfaces/coordinate';
import { CanvasInteractionState } from '@/enums/canvas-interaction-state';
import { GameState } from '@/enums/game-state';
import { GameStatus } from '@/enums/game-status';
import { PathType } from '@/enums/path-type';
import { PlacementStatus } from '@/enums/placement-status';
import { getCoordinateRelativeToDirection } from '@/helpers/coordinate-helpers';
import { convertRotationToNumeric, convertNumericToRotation } from '@/helpers/rotation-helpers';
import { Map, SquareMenu } from 'lucide-react';
import Sidebar from '@/components/play-game/sidebar';
import Footer from '@/components/play-game/footer';
import GameCanvas from '@/components/play-game/game-canvas';
import Modal from '@/components/modal';
import NotificationPopup from '@/components/notification-popup';

interface PlayGameProps extends PageProps {
    game: Game,
}

export default function PlayGame() {
    const { game, tiles } = usePage<PlayGameProps>().props;

    const DEFAULT_CANVAS_CENTER: Coordinate = {x: 0, y: 0};
    const DEFAULT_ZOOM_FACTOR: number = 1;

    const [canvasCenter, setCanvasCenter] = useState<Coordinate>(DEFAULT_CANVAS_CENTER)
    const [zoomFactor, setZoomFactor] = useState<number>(DEFAULT_ZOOM_FACTOR);
    const [canvasInteractionState, setCanvasInteractionState] = 
        useState<CanvasInteractionState>(
            CanvasInteractionState.GAME_INTERACTION
        );

    const [notificationStatus, setNotificationStatus] = useState<string>("");
    const [notificationMessage, setNotificationMessage] = useState<string>("");
    const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const [currentGame, setCurrentGame] = useState<Game>(game);
    const [availableSpots, setAvailableSpots] = useState<Coordinate[]>([]);

    function triggerErrorMessage(message: string) {
        setNotificationStatus('error');
        setNotificationMessage(message);
        setIsNotificationVisible(true);
    }

    function placeTile(coordinate: Coordinate) {
        fetch('/api/place-tile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({boardId: game.board.id, coordinate: coordinate})
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setCurrentGame(data.game);
            }
            else if (data.error) {
                console.log(data);
                triggerErrorMessage(data.message);
            }
        });
    }

    function confirmTileRotation() {
        fetch('/api/confirm-tile-rotation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: currentGame.board.id, 
                pendingTiles: currentGame.board.placed_tiles.filter(
                    placed_tile => placed_tile.placement_status === PlacementStatus.PENDING
                )
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setCurrentGame(data.game);
            }
            else if (data.error) {
                console.log(data);
                triggerErrorMessage(data.message);
            }
        });
    }

    function placeSanctum(coordinate: Coordinate) {
        fetch('/api/place-sanctum', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({boardId: game.board.id, coordinate: coordinate})
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setCurrentGame(data.game);
            }
            else if (data.error) {
                console.log(data);
                triggerErrorMessage(data.message);
            }
        });
    }

    function confirmSanctumRotation() {
        fetch('/api/confirm-sanctum-rotation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boardId: currentGame.board.id, 
                pendingTiles: currentGame.board.placed_tiles.filter(
                    placed_tile => placed_tile.placement_status === PlacementStatus.PENDING
                )
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setCurrentGame(data.game);
            }
            else if (data.error) {
                console.log(data);
                triggerErrorMessage(data.message);
            }
        });
    }

    function getAvailableSpotsForTilePlacement() {
        fetch('/api/get-tile-placement-candidates/' + game.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                console.log(data.availableSpots);
                setAvailableSpots(data.availableSpots);
            }
            else if (data.error) {
                console.log(data);
                triggerErrorMessage(data.message);
            }
        });
    }

    function getAvailableSpotsForSanctumPlacement() {
        fetch('/api/get-sanctum-placement-candidates/' + game.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setAvailableSpots(data.availableSpots);
            }
            else if (data.error) {
                console.log(data);
                triggerErrorMessage(data.message);
            }
        });
    }

    function rotateTile(isClockwise: boolean) {
        const previousGame = currentGame;
        const placedTiles = currentGame.board.placed_tiles;

        for (let i = 0; i < placedTiles.length; i++) {
            //Avoid filtering since we need access to all placed tiles to update
            //currentGame in an immutable fashion.
            if (placedTiles[i].placement_status === PlacementStatus.PENDING) {
                placedTiles[i].rotation = convertNumericToRotation(
                    (convertRotationToNumeric(placedTiles[i].rotation) + (isClockwise ? 1 : -1)) % 4
                )
                placedTiles[i].placed_subtiles[0].rotation = convertNumericToRotation(
                    (convertRotationToNumeric(placedTiles[i].placed_subtiles[0].rotation) + (isClockwise ? 1 : -1)) % 4
                )
                break; //Only consider first result. After confirmation using endpoint, it will move on to the next.
            }
        }

        setCurrentGame(
            {
                ...previousGame,
                board: {
                    ...previousGame.board,
                    placed_tiles: placedTiles
                }
            }
        )
    }

    function rotateSanctum(isClockwise: boolean) {
        const previousGame = currentGame;
        const placedTiles = currentGame.board.placed_tiles;
        const sanctumIndex = placedTiles.findIndex(
            placed_tile => placed_tile.placement_status === PlacementStatus.PENDING
        );

        if (sanctumIndex >= 0) {
            const keyChamberIndex = placedTiles[sanctumIndex].placed_subtiles.findIndex(
                placed_subtile => placed_subtile.path_type === PathType.STRAIGHT
            )
            const artifactChamberIndex = placedTiles[sanctumIndex].placed_subtiles.findIndex(
                placed_subtile => placed_subtile.path_type === PathType.DEAD_END
            )

            if (keyChamberIndex >= 0 && artifactChamberIndex >= 0) {
                const flippedPrevRotation = convertNumericToRotation(
                    (convertRotationToNumeric(placedTiles[sanctumIndex].rotation) + 2) % 4
                );
                const currentRotation = convertNumericToRotation(
                    (convertRotationToNumeric(placedTiles[sanctumIndex].rotation) + (isClockwise ? 1 : 3)) % 4
                );
                const flippedCurrentRotation = convertNumericToRotation(
                    (convertRotationToNumeric(currentRotation) + 2) % 4
                );

                const adjustedArtifactCoordinate = getCoordinateRelativeToDirection(
                    getCoordinateRelativeToDirection(
                        placedTiles[sanctumIndex].placed_subtiles[artifactChamberIndex].coordinate, 
                        flippedPrevRotation
                    ), currentRotation
                );

                placedTiles[sanctumIndex].rotation = currentRotation;
                placedTiles[sanctumIndex].placed_subtiles[keyChamberIndex].rotation = flippedCurrentRotation;
                placedTiles[sanctumIndex].placed_subtiles[artifactChamberIndex].rotation = currentRotation;
                placedTiles[sanctumIndex].placed_subtiles[artifactChamberIndex].coordinate = adjustedArtifactCoordinate;
            }

            setCurrentGame(
                {
                    ...previousGame,
                    board: {
                        ...previousGame.board,
                        placed_tiles: placedTiles
                    }
                }
            )
        }
    }

    useEffect(() => {
        if (currentGame.game_state === GameState.PLACING_TILE) {
            getAvailableSpotsForTilePlacement();
        }
        if (currentGame.game_state === GameState.PLACING_SANCTUM) {
            getAvailableSpotsForSanctumPlacement();
        }
        console.log(currentGame);
    }, [currentGame.board]);

    useEffect(() => {
        if (currentGame.status === GameStatus.COMPLETE) {
            setIsModalOpen(true);
        }
    }, [currentGame.status])
    
    return (
        <>
            <Head title="Play Game" />
            <div className="flex w-screen h-screen flex-1 flex-col gap-4 overflow-x-auto">
                <GameCanvas
                    availableSpots={availableSpots}
                    board={currentGame.board}
                    canvasCenter={canvasCenter}
                    setCanvasCenter={setCanvasCenter}
                    zoomFactor={zoomFactor}
                    setZoomFactor={setZoomFactor}
                    canvasInteractionState={canvasInteractionState}
                    placeTile={placeTile}
                    placeSanctum={placeSanctum}
                    gameCanvasRef={gameCanvasRef}
                    gameState={currentGame.game_state}
                />
                <Footer />
                <Sidebar
                    setCanvasCenter={setCanvasCenter}
                    defaultCanvasCenter={DEFAULT_CANVAS_CENTER}
                    zoomFactor={zoomFactor}
                    setZoomFactor={setZoomFactor}
                    defaultZoomFactor={DEFAULT_ZOOM_FACTOR}
                    canvasInteractionState={canvasInteractionState}
                    setCanvasInteractionState={setCanvasInteractionState}
                    confirmTileRotation={confirmTileRotation}
                    confirmSanctumRotation={confirmSanctumRotation}
                    rotateTile={rotateTile}
                    rotateSanctum={rotateSanctum}
                    gameState={currentGame.game_state}
                    gameStatus={currentGame.status}
                    setIsModalOpen={setIsModalOpen}
                />
                <NotificationPopup
                    status={notificationStatus}
                    message={notificationMessage}
                    isVisible={isNotificationVisible}
                    setIsVisible={setIsNotificationVisible}
                />
            </div>
            <Modal
                title={"Game Over"}
                description={"The map has been built!"}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            >
                <p>The map has been properly developed and the sanctum has been placed!</p>
                <div className="flex justify-center py-2">
                    <button 
                        className="flex items-center gap-2 p-2 bg-stone-400 rounded-lg hover:scale-110 mx-2"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <Map className="text-stone-800"/>
                        <p className="text-stone-800">View Map</p>
                    </button>
                    <button 
                        className="flex items-center gap-2 p-2 bg-stone-400 rounded-lg hover:scale-110 mx-2"
                        onClick={() => {router.get('/play-game');}}
                    >
                        <SquareMenu className="text-stone-800"/>
                        <p className="text-stone-800">Back to Game Menu</p>
                    </button>
                </div>
            </Modal>
        </>
    );
}
