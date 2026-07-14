<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Classes\Coordinate;
use App\Classes\SubtileGraph;
use App\Models\Bag;
use App\Models\Game;
use App\Models\Board;
use App\Models\BaggedTile;
use App\Models\PlacedTile;
use App\Models\PlacedSubtile;
use App\Models\Tile;
use App\Enums\GameState;
use App\Enums\GameStatus;
use App\Enums\PathType;
use App\Enums\PlacementStatus;
use App\Enums\Property;
use App\Enums\Rotation;
use App\Enums\TileType;

class TileController extends Controller
{
    public function placeTile(Request $request)
    {
        if (Game::where('status', GameStatus::IN_PROGRESS)->first()->game_state !== GameState::PLACING_TILE) {
            return response()->json([
                'error' => 'Cannot place tile!',
                'message' => 'Must resolve other actions before placing more tiles!',
            ], 409);
        }

        if ($this->isBagEmpty()) {
            return response()->json([
                'error' => 'Bag is empty!',
                'message' => 'All tiles have been placed on the board!',
            ], 409);
        }

        $coordinate = new Coordinate($request->coordinate["x"], $request->coordinate["y"]);

        if ($this->spaceIsOccupied($coordinate)) {
            return response()->json([
                'error' => 'Improper tile placement!',
                'message' => 'Space is already occupied by another tile!',
            ], 409);
        }

        if ($this->tileOutOfBounds($coordinate)) {
            return response()->json([
                'error' => 'Improper tile placement!',
                'message' => 'Tile placement is not within the bounds of the board!',
            ], 409);
        }

        if ($this->tileCannotConnectToAnother($coordinate)) {
            return response()->json([
                'error' => 'Improper tile placement!',
                'message' => 'Tile is unable to connect to another tile from here!',
            ], 409);
        }

        //Sanctum must be placed last.
        $selectedTile = BaggedTile::inRandomOrder()
            ->whereNot('tile_id', Tile::where('tile_type', TileType::SANCTUM)->first()->id)
            ->first();

        $pathType = TileType::tileTypeToPathType(Tile::where('id', $selectedTile->tile_id)->first()->tile_type);

        if ($this->placementClosesMap($pathType)) {
            return response()->json([
                'error' => 'Cannot place tile!',
                'message' => 'Tile selected will close the map!',
            ], 409);
        }
        
        $this->placeTileAndSubtileOnBoard($selectedTile, $request->boardId, $coordinate);

        if ($this->isOnlySanctumRemaining()) {
            $this->placeSanctum($request->boardId);
        }

        $activeGame = Game::where('status', GameStatus::IN_PROGRESS)->with([
            'board.placedTiles.anchor',
            'board.placedTiles.tile',
            'board.placedTiles.placedSubtiles',
        ])->first();

        return response()->json([
            'success' => true,
            'message' => 'Board has been returned',
            'game' => $activeGame,
        ], 200);
    }

    public function confirmTileRotation(Request $request) {
        $requestSubtile = $request->pendingTiles[0]['placed_subtiles'][0];
        $connectedAdjacencies = $this->retrieveAllConnectingDirections(new Coordinate($requestSubtile['coordinate']['x'], $requestSubtile['coordinate']['y']));
        $tileAdjacencies = Rotation::getAdjacencies(
            Rotation::from($requestSubtile['rotation']), 
            PathType::from($requestSubtile['path_type'])
        );

        //Filters out all available directions and only provides the directions relevant to the
        //current tile type and rotation.
        $intersectingAdjacencies = array_uintersect(
            $tileAdjacencies,
            $connectedAdjacencies, 
            fn($dir1, $dir2) => $dir1->value <=> $dir2->value
        );

        if (count($intersectingAdjacencies) === 0) {
            return response()->json([
                'error' => 'Improper tile orientation!',
                'message' => 'Tile to be rotated does not connect to the rest of the map!',
            ], 409);
        }

        //Confirm placement.
        $tile = PlacedTile::find($request->pendingTiles[0]['id']);
        $tile->placement_status = PlacementStatus::PLACED;
        $tile->save();

        //Update rotation.
        $subtile = PlacedSubtile::find($tile->placedSubtiles[0]->id);
        $subtile->rotation = $requestSubtile['rotation'];
        $subtile->save();

        $pendingTiles = PlacedTile::where('placement_status', PlacementStatus::PENDING)->get();

        //Change game state if there are no tiles left to be rotated.
        if (count($pendingTiles) === 0) {
            $game = Game::where('status', GameStatus::IN_PROGRESS)->first();
            $game->game_state = GameState::PLACING_TILE;
            $game->save();
        }

        $activeGame = Game::where('status', GameStatus::IN_PROGRESS)->with([
            'board.placedTiles.anchor',
            'board.placedTiles.tile',
            'board.placedTiles.placedSubtiles',
        ])->first();

        return response()->json([
            'success' => true,
            'message' => 'Tile rotation has been confirmed!',
            'game' => $activeGame,
        ], 200);
    }

    private function placeTileAndSubtileOnBoard(BaggedTile $baggedTile, int $boardId, Coordinate $coordinate) {
        $connectedAdjacencies = $this->retrieveAllConnectingDirections($coordinate);

        if (empty($connectedAdjacencies)) {
            return;
        }

        $availableAdjacencies = $this->retrieveAllAvailableDirections($coordinate);

        $pathType = TileType::tileTypeToPathType(Tile::where('id', $baggedTile->tile_id)->first()->tile_type);

        //Place tile on board.
        $placedTile = PlacedTile::create([
            'board_id' => $boardId,
            'tile_id' => $baggedTile->tile_id,
            'placement_status' => $this->isRotateable($connectedAdjacencies, $pathType) 
                ? PlacementStatus::PENDING : PlacementStatus::PLACED,
        ]);
        PlacedSubtile::create([
            'placed_tile_id' => $placedTile->id,    
            'x_coordinate' => $coordinate->x,
            'y_coordinate' => $coordinate->y,
            'path_type' => $pathType,
            'rotation' => $connectedAdjacencies[0],
            'property' => Property::SAFE,
            'is_neutralized' => false,
        ]);

        if ($placedTile->placement_status === PlacementStatus::PENDING) {
            $activeGame = Game::where('status', GameStatus::IN_PROGRESS)->first();
            $activeGame->game_state = GameState::ROTATING_TILE;
            $activeGame->save();
        }

        //Indicate that tile is removed from bag.
        $baggedTile->delete();
    }

    private function placeSanctum(int $boardId)
    {
        //First is a stop gap until UI to choose a sanctum location is implemented!
        $furthestSubtile = PlacedSubtile::where('y_coordinate', PlacedSubtile::max('y_coordinate'))->first();
        $sanctum = BaggedTile::where('tile_id', Tile::where('tile_type', TileType::SANCTUM)->first()->id)->first();

        //Place tile on board.
        $placedTile = PlacedTile::create([
            'board_id' => $boardId,
            'tile_id' => $sanctum->tile_id,
            'placement_status' => PlacementStatus::PLACED,
        ]);
        PlacedSubtile::create([
            'placed_tile_id' => $placedTile->id,
            'x_coordinate' => $furthestSubtile->coordinate->x,
            'y_coordinate' => $furthestSubtile->coordinate->y + 1,
            'path_type' => PathType::STRAIGHT,
            'rotation' => Rotation::NORTH,
            'property' => Property::SAFE,
            'is_neutralized' => false,
        ]);
        PlacedSubtile::create([
            'placed_tile_id' => $placedTile->id,
            'x_coordinate' => $furthestSubtile->coordinate->x,
            'y_coordinate' => $furthestSubtile->coordinate->y + 2,
            'path_type' => PathType::DEAD_END,
            'rotation' => Rotation::SOUTH,
            'property' => Property::SAFE,
            'is_neutralized' => false,
        ]);

        //Indicate that sanctum is placed.
        $sanctum->delete();
    }

    private function spaceIsOccupied(Coordinate $coordinate)
    {
        $existingSubtile = PlacedSubtile::where('x_coordinate', $coordinate->x)
            ->where('y_coordinate', $coordinate->y)
            ->count();

        return $existingSubtile > 0;
    }

    private function tileOutOfBounds(Coordinate $coordinate)
    {
        //West and east wing tiles act as basis of board boundaries!
        $wingSubtiles = PlacedSubtile::whereIn(
            'placed_tile_id', PlacedTile::whereIn(
                'tile_id', Tile::whereIn('tile_type', [TileType::WEST_WING, TileType::EAST_WING])->get()->pluck('id')
            )->get()->pluck('id')
        )->get();

        $minX = $wingSubtiles->min('x_coordinate');
        $maxX = $wingSubtiles->max('x_coordinate');
        $minY = $wingSubtiles->min('y_coordinate');

        return ($coordinate->x < $minX || $coordinate->x > $maxX || $coordinate->y < $minY);
    }

    private function tileCannotConnectToAnother(Coordinate $coordinate)
    {
        return empty($this->retrieveAllConnectingDirections($coordinate));
    }

    private function retrieveAllConnectingDirections(Coordinate $coordinate)
    {
        $subtileCandidates = $this->retrieveAdjacentSubtileCandidates($coordinate);

        //Nothing adjacent, cannot connect!
        if ($subtileCandidates->count() === 0) {
            return [];
        }

        $validDirections = [];

        //Go through all adjacent subtile candidates and check if there is an open passage
        //to the space we want to place a new tile on.
        foreach($subtileCandidates as $subtile) {
            //Get direction where current adjacent tile is
            $relativeDirection = Rotation::getDirectionRelativeToCoordinates($coordinate, $subtile->coordinate);
            $adjacencies = Rotation::getAdjacencies($subtile->rotation, $subtile->path_type);

            //Verify that the adjacent tile has an opening to the spot we want to place a tile on.
            if (in_array(Rotation::flip($relativeDirection), $adjacencies)) {
                array_push($validDirections, $relativeDirection);
            }
        }

        return $validDirections;
    }

    private function retrieveAllAvailableDirections(Coordinate $coordinate)
    {
        $subtileCandidates = $this->retrieveAdjacentSubtileCandidates($coordinate);
        $validDirections = [];

        //Get directions of all adjacent subtiles.
        foreach($subtileCandidates as $subtile) {
            $relativeDirection = Rotation::getDirectionRelativeToCoordinates(
                $coordinate, $subtile->coordinate
            );
            array_push($validDirections, $relativeDirection);
        }

        //Get directions of all available spots by providing the directions that
        //aren't part of adjacent subtiles.
        $availableDirections = array_udiff(
            [Rotation::NORTH, Rotation::EAST, Rotation::SOUTH, Rotation::WEST],
            $validDirections, 
            fn($dir1, $dir2) => $dir1->value <=> $dir2->value
        );

        //Delete directions that go to out of bound coordinates.
        foreach($availableDirections as $key => $availableDirection) {
            if ($this->tileOutOfBounds(Rotation::getCoordinateRelativeToDirection($coordinate, $availableDirection))) {
                unset($availableDirections[$key]);
            }
        }

        return $availableDirections;
    }

    private function retrieveAdjacentSubtileCandidates($coordinate)
    {
        //Adjacent subtiles for cardinal directions only! Also don't include the initial tile being compared to.
        $subtileCandidates = PlacedSubtile::where(function ($query) use ($coordinate) {
            $query->whereIn('x_coordinate', [$coordinate->x - 1, $coordinate->x + 1])
                ->where('y_coordinate', $coordinate->y);
        })
        ->orWhere(function ($query) use ($coordinate) {
            $query->whereIn('y_coordinate', [$coordinate->y - 1, $coordinate->y + 1])
                ->where('x_coordinate', $coordinate->x);
        })->get();

        return $subtileCandidates;
    }

    private function isRotateable(array $connectedAdjacencies, PathType $pathType)
    {
        //Four ways are placed automatically.
        if ($pathType === PathType::FOUR_WAY) {
            return false;
        }

        //Dead-ends are placed automatically if there is only one tile to connect to.
        if ($pathType === PathType::DEAD_END && count($connectedAdjacencies) === 1) {
            return false;
        }

        //Straightaways are placed automatically if there aren't multiple tiles to 
        //connect to that are not across from each other.
        if ($pathType === PathType::STRAIGHT) {
            if (in_array(Rotation::NORTH, $connectedAdjacencies) || in_array(Rotation::SOUTH, $connectedAdjacencies)) {
                if (!in_array(Rotation::EAST, $connectedAdjacencies) && !in_array(Rotation::WEST, $connectedAdjacencies)) {
                    return false;
                }
            }
            else if (in_array(Rotation::EAST, $connectedAdjacencies) || in_array(Rotation::WEST, $connectedAdjacencies)) {
                if (!in_array(Rotation::NORTH, $connectedAdjacencies) && !in_array(Rotation::SOUTH, $connectedAdjacencies)) {
                    return false;
                }
            }
        }

        return true;
    }

    private function isBagEmpty()
    {
        $tileCount = BaggedTile::whereNot('tile_id', Tile::where('tile_type', TileType::SANCTUM)->first()->id)->count();
        return $tileCount === 0;
    }

    private function isOnlySanctumRemaining()
    {
        $noSanctumTileCount = BaggedTile::whereNot('tile_id', Tile::where('tile_type', TileType::SANCTUM)->first()->id)->count();
        $totalTileCount = BaggedTile::count();

        return ($totalTileCount === 1 && $noSanctumTileCount === 0);
    }

    private function placementClosesMap(PathType $pathType) {
        $highestYCoordinate = PlacedSubtile::max('y_coordinate');

        $subtileGraph = $this->getSubtileGraph();
        $placementCandidates = $subtileGraph->findAvailablePlacementsWithBFS();
        $connectingSpots = $subtileGraph->findOpenConnectionPositionsToMapWithBFS($highestYCoordinate);
        
        if (count($placementCandidates) === 1 || count($connectingSpots) === 1) {
            $placementCandidate = count($placementCandidates) === 1 ? $placementCandidates[0] : $connectingSpots[0];
            $adjacentTileDirections = $this->retrieveAllConnectingDirections($placementCandidate);
            $adjacentConnectionDirections = $this->retrieveAllAvailableDirections($placementCandidate);

            if (count($adjacentConnectionDirections) === 0) {
                return true;
            }
            else if ($pathType === PathType::DEAD_END) {
                return true;
            }
            else if ($pathType === PathType::L_JUNCTION || $pathType === PathType::T_JUNCTION) {
                foreach($adjacentTileDirections as $adjacentTileDirection) {
                    $connectsToFreeSpot = array_uintersect(
                        [
                            Rotation::rotate($adjacentTileDirection, true), 
                            Rotation::rotate($adjacentTileDirection, false)
                        ],
                        $adjacentConnectionDirections, 
                        fn($dir1, $dir2) => $dir1->value <=> $dir2->value
                    );

                    if (!empty($connectsToFreeSpot)) {
                        return false;
                    };
                }
                
                return true;
            }
            else if ($pathType === PathType::STRAIGHT) {
                foreach($adjacentTileDirections as $adjacentTileDirection) {
                    $connectsToFreeSpot = in_array(Rotation::flip($adjacentTileDirection), $adjacentConnectionDirections);

                    if (!empty($connectsToFreeSpot)) {
                        return false;
                    };
                }

                return true;
            }
        }

        return false;
    }

    private function getSubtileGraph()
    {
        $subtileGraph = new SubtileGraph(1);
        return $subtileGraph;
    }
}
