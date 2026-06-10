<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
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
                    'y_coordinate' => 0,
                    'path_type' => PathType::FOUR_WAY,
                    'rotation' => Rotation::NORTH,
                    'property' => Property::SAFE,
                    'is_neutralized' => false,
                ]);
                PlacedSubtile::create([
                    'placed_tile_id' => $placedTile->id,
                    'x_coordinate' => 0,
                    'y_coordinate' => -1,
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
}
