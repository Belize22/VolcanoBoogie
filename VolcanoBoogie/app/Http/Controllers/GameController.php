<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Classes\Coordinate;
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

class GameController extends Controller
{
    public function playGame()
    {
        $activeGame = $this->getActiveGame();

        if (!$activeGame) {
            $activeGame = $this->createGame();
        }

        $game = $activeGame::with([
            'board.placedTiles.anchor',
            'board.placedTiles.tile',
            'board.placedTiles.placedSubtiles',
        ])->first();

        return Inertia::render('play-game', [
            'game' => $game,
        ]);
    }

    public function placeTile(Request $request)
    {
        if ($this->getActiveGame()->game_state !== GameState::PLACING_TILE) {
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

        if ($this->spaceIsOccupied($request->coordinate)) {
            return response()->json([
                'error' => 'Improper tile placement!',
                'message' => 'Space is already occupied by another tile!',
            ], 409);
        }

        if ($this->tileOutOfBounds($request->coordinate)) {
            return response()->json([
                'error' => 'Improper tile placement!',
                'message' => 'Tile placement is not within the bounds of the board!',
            ], 409);
        }

        if ($this->tileCannotConnectToAnother($request->coordinate)) {
            return response()->json([
                'error' => 'Improper tile placement!',
                'message' => 'Tile is unable to connect to another tile from here!',
            ], 409);
        }

        //Sanctum must be placed last.
        $selectedTile = BaggedTile::inRandomOrder()
            ->whereNot('tile_id', Tile::where('tile_type', TileType::SANCTUM)->first()->id)
            ->first();
        $this->placeTileAndSubtileOnBoard($selectedTile, $request->boardId, $request->coordinate);

        if ($this->isOnlySanctumRemaining()) {
            $this->placeSanctum($request->boardId);
        }

        $activeGame = $this->getActiveGame()::with([
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
        \Log::info($request);

        $activeGame = $this->getActiveGame()::with([
            'board.placedTiles.anchor',
            'board.placedTiles.tile',
            'board.placedTiles.placedSubtiles',
        ])->first();

        return response()->json([
            'success' => true,
            'message' => 'API call returns response!',
            'game' => $activeGame,
        ], 200);
    }

    private function placeTileAndSubtileOnBoard(BaggedTile $baggedTile, int $boardId, array $coordinate) {
        $connectedAdjacencies = $this->retrieveAllConnectingDirections($coordinate);

        if (empty($connectedAdjacencies)) {
            return;
        }

        $availableAdjacencies = $this->retrieveAllAvailableDirections($coordinate);

        //Place tile on board.
        $placedTile = PlacedTile::create([
            'board_id' => $boardId,
            'tile_id' => $baggedTile->tile_id,
            'placement_status' => count($availableAdjacencies) > 1 ? PlacementStatus::PENDING : PlacementStatus::PLACED,
        ]);
        PlacedSubtile::create([
            'placed_tile_id' => $placedTile->id,
            'x_coordinate' => $coordinate["x"],
            'y_coordinate' => $coordinate["y"],
            'path_type' => TileType::tileTypeToPathType(Tile::where('id', $placedTile->tile_id)->first()->tile_type),
            'rotation' => $connectedAdjacencies[0],
            'property' => Property::SAFE,
            'is_neutralized' => false,
        ]);

        if ($placedTile->placement_status === PlacementStatus::PENDING) {
            $activeGame = $this->getActiveGame();
            $activeGame->game_state = GameState::ROTATING_TILE;
            $activeGame->save();
        }

        //Indicate that tile is removed from bag.
        $baggedTile->delete();
    }

    private function createGame()
    {
        $game = Game::create([
            'status' => GameStatus::IN_PROGRESS,
            'state' => GameState::PLACING_TILE,
        ]);

        $board = Board::create([
            'game_id' => $game->id,
        ]);

        $bag = Bag::create([
            'game_id' => $game->id,
        ]);

        $tilesToBag = Tile::whereNotIn('tile_type', ['entrance', 'west_wing', 'east_wing'])->get();
        $tilesToPlace = Tile::whereIn('tile_type', ['entrance', 'west_wing', 'east_wing'])->get();
        
        //Place relevant tiles in the bag.
        foreach ($tilesToBag as $tile) {
            for ($i = 0; $i < $tile->quantity; $i++) {
                $baggedTile = BaggedTile::create([
                    'bag_id' => $bag->id,
                    'tile_id' => $tile->id,
                ]);
            }
        }

        //Place entrance, west wing, and east wing on board to start.
        foreach ($tilesToPlace as $tile) {
            $placedTile = PlacedTile::create([
                'board_id' => $board->id,
                'tile_id' => $tile->id,
                'placement_status' => PlacementStatus::PLACED,
            ]);

            $tileInstance = Tile::find($placedTile->tile_id);

            if ($tileInstance->tile_type === TileType::ENTRANCE) {
                $anchor = PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => 0,
                    'y_coordinate' => -1,
                    'path_type' => PathType::FOUR_WAY,
                    'rotation' => Rotation::NORTH,
                    'property' => Property::SAFE,
                    'is_neutralized' => false,
                ]);
                PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => 0,
                    'y_coordinate' => 0,
                    'path_type' => PathType::DEAD_END,
                    'rotation' => Rotation::NORTH,
                    'property' => Property::SAFE,
                    'is_neutralized' => false,
                ]);
                $placedTile->anchor = $anchor->id;
                $placedTile->save();
            }
            else if ($tileInstance->tile_type === TileType::WEST_WING) {
                $anchor = PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => -1,
                    'y_coordinate' => 0,
                    'path_type' => PathType::T_JUNCTION,
                    'rotation' => Rotation::WEST,
                    'property' => Property::SAFE,
                    'is_neutralized' => false,
                ]);
                PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => -2,
                    'y_coordinate' => 0,
                    'path_type' => PathType::T_JUNCTION,
                    'rotation' => Rotation::WEST,
                    'property' => Property::SAFE,
                    'is_neutralized' => false,
                ]);
                PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => -3,
                    'y_coordinate' => 0,
                    'path_type' => PathType::DEAD_END,
                    'rotation' => Rotation::EAST,
                    'property' => Property::GUARDIAN,
                    'is_neutralized' => false,
                ]);
                $placedTile->anchor = $anchor->id;
                $placedTile->save();
            }
            else if ($tileInstance->tile_type === TileType::EAST_WING) {
                $anchor = PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => 1,
                    'y_coordinate' => 0,
                    'path_type' => PathType::T_JUNCTION,
                    'rotation' => Rotation::WEST,
                    'property' => Property::SAFE,
                    'is_neutralized' => false,
                ]);
                PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => 2,
                    'y_coordinate' => 0,
                    'path_type' => PathType::T_JUNCTION,
                    'rotation' => Rotation::WEST,
                    'property' => Property::SAFE,
                    'is_neutralized' => false,
                ]);
                PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => 3,
                    'y_coordinate' => 0,
                    'path_type' => PathType::DEAD_END,
                    'rotation' => Rotation::WEST,
                    'property' => Property::GUARDIAN,
                    'is_neutralized' => false,
                ]);
                $placedTile->anchor = $anchor->id;
                $placedTile->save();
            }
        }

        return $game;
    }

    private function getActiveGame()
    {
        $game = Game::where('status', GameStatus::IN_PROGRESS)->first();
        return $game;
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

    private function spaceIsOccupied($coordinate)
    {
        $existingSubtile = PlacedSubtile::where('x_coordinate', $coordinate["x"])
            ->where('y_coordinate', $coordinate["y"])
            ->count();

        return $existingSubtile > 0;
    }

    private function tileOutOfBounds($coordinate)
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

        return ($coordinate["x"] < $minX || $coordinate["x"] > $maxX || $coordinate["y"] < $minY);
    }

    private function tileCannotConnectToAnother($coordinate)
    {
        return empty($this->retrieveAllConnectingDirections($coordinate));
    }

    private function retrieveAllConnectingDirections($coordinate)
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
            $relativeDirection = Rotation::getDirectionRelativeToCoordinates(
                new Coordinate($coordinate["x"], $coordinate["y"]), $subtile->coordinate
            );
            $adjacencies = Rotation::getAdjacencies($subtile->rotation, $subtile->path_type);

            //Verify that the adjacent tile has an opening to the spot we want to place a tile on.
            if (in_array(Rotation::flip($relativeDirection), $adjacencies)) {
                array_push($validDirections, $relativeDirection);
            }
        }

        return $validDirections;
    }

    private function retrieveAllAvailableDirections($coordinate)
    {
        $subtileCandidates = $this->retrieveAdjacentSubtileCandidates($coordinate);
        $validDirections = [];

        //Get directions of all adjacent subtiles.
        foreach($subtileCandidates as $subtile) {
            $relativeDirection = Rotation::getDirectionRelativeToCoordinates(
                new Coordinate($coordinate["x"], $coordinate["y"]), $subtile->coordinate
            );
            array_push($validDirections, $relativeDirection);
        }

        //Get directions of all available spots by providing the directions that
        //aren't part of adjacent subtiles.
        return array_udiff(
            [Rotation::NORTH, Rotation::EAST, Rotation::SOUTH, Rotation::WEST],
            $validDirections, 
            fn($dir1, $dir2) => $dir1->value <=> $dir2->value
        );
    }

    private function retrieveAdjacentSubtileCandidates($coordinate)
    {
        //Adjacent subtiles for cardinal directions only! Also don't include the initial tile being compared to.
        $subtileCandidates = PlacedSubtile::where(function ($query) use ($coordinate) {
            $query->whereIn('x_coordinate', [$coordinate["x"] - 1, $coordinate["x"] + 1])
                ->where('y_coordinate', $coordinate["y"]);
        })
        ->orWhere(function ($query) use ($coordinate) {
            $query->whereIn('y_coordinate', [$coordinate["y"] - 1, $coordinate["y"] + 1])
                ->where('x_coordinate', $coordinate["x"]);
        })->get();

        return $subtileCandidates;
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
}
