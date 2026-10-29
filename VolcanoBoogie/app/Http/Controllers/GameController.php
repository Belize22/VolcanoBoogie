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
use App\Models\Player;
use App\Models\Tile;
use App\Models\TurnPreset;
use App\Enums\Difficulty;
use App\Enums\ExplorerRole;
use App\Enums\GameState;
use App\Enums\GameStatus;
use App\Enums\PathType;
use App\Enums\PlacementStatus;
use App\Enums\PlayerStatus;
use App\Enums\Property;
use App\Enums\Rotation;
use App\Enums\TileType;

class GameController extends Controller
{
    public function playGame(String $id)
    {
        $game = Game::with([
            'board.placedTiles.anchor',
            'board.placedTiles.tile',
            'board.placedTiles.placedSubtiles',
        ])->where('id', $id)->first();

        if (!$game) {
            abort(404);
        }

        $players = Player::where('game_id', $game->id)->get();

        return Inertia::render('play-game', [
            'game' => $game,
            'players' => $players
        ]);
    }

    public function viewGames()
    {
        $games = Game::where('status', 'in_progress')->get();

        return Inertia::render('view-games', [
            'games' => $games,
        ]);
    }

    public function startGame()
    {
        $turnPresets = TurnPreset::all();

        return Inertia::render('start-game', [
            'turnPresets' => $turnPresets
        ]);
    }

    public function getGames(Request $request) {
        $games = Game::whereIn('status', $request->statusList)->get();

        return response()->json([
            'success' => true,
            'message' => 'List of games has been successfully retrieved!',
            'games' => $games,
        ], 200);
    }

    public function createGame(Request $request)
    {
        if (count($request['selectedExplorerRoles']) < 3 || count($request['selectedExplorerRoles']) > 6)
        {
            return response()->json([
                'error' => 'Improper settings applied!',
                'message' => 'Explorer count must be between 3-6 explorers!',
            ], 409);
        }

        if (in_array(NULL, $request['selectedExplorerRoles'], true))
        {
            return response()->json([
                'error' => 'Improper settings applied!',
                'message' => 'Not all explorers have an explorer role assigned!',
            ], 409);
        }

        $startingTurns = TurnPreset::where('players', count($request['selectedExplorerRoles']))
            ->where('difficulty', Difficulty::from($request['selectedDifficulty']))
            ->pluck('turns')->first();

        $game = Game::create([
            'status' => GameStatus::IN_PROGRESS,
            'state' => GameState::PLACING_TILE,
        ]);

        $board = Board::create([
            'game_id' => $game->id,
            'turns' => $startingTurns,
            'turns_remaining' => $startingTurns,
            'is_cursed' => false
        ]);

        foreach ($request['selectedExplorerRoles'] as $index => $selectedExplorer) {
            $player = Player::create([
                'game_id' => $game->id,
                'explorer_role' => ExplorerRole::from($selectedExplorer),
                'current_health' => 5,
                'max_health' => 5,
                'item' => NULL,
                'player_status' => PlayerStatus::ACTIVE,
                'turn_order' => $index + 1,
            ]);

            if ($index === 0) {
                $game->current_player = $player->id;
                $game->save();
            }
        }

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
                'rotation' => Rotation::NORTH,
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

        return response()->json([
            'success' => true,
            'message' => 'Game successfully created!',
            'redirect_url' => '/play-game/' . $game->id,
        ], 200);
    }
}
