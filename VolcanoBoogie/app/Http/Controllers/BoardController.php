<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\Hazard;
use App\Models\Board;
use App\Models\Game;
use App\Models\Player;

class BoardController extends Controller
{
    public function endTurn(Request $request)
    {
        $playerQuantity = Player::where('game_id', $request->gameId)
            ->count();

        $currentPlayer = Player::where('game_id', $request->gameId)
            ->where('is_current_player', true)
            ->first();
        
        $nextPlayer = Player::where('game_id', $request->gameId)
            ->where('turn_order', $currentPlayer->turn_order !== $playerQuantity ? $currentPlayer->turn_order + 1 : 1)
            ->first();

        $currentPlayer->is_current_player = false;
        $currentPlayer->save();

        $nextPlayer->is_current_player = true;
        $nextPlayer->save();

        if ($currentPlayer->turn_order + 1 > $playerQuantity) {
            $board = Board::where('game_id', $request->gameId)->first();
            if ($board->turns_remaining > 0) {
                $board->turns_remaining = $board->turns_remaining - 1;
                $board->save();
            }
        }

        $hazardValues = Hazard::cases();
        $selectedHazardValue = $hazardValues[rand(0, count($hazardValues) - 1)];

        \Log::info($selectedHazardValue->value);

        if ($selectedHazardValue === Hazard::CAVE_IN) {
            \Log::info(rand(1, 6));
        }
        
        $activeGame = Game::where('id', $request->gameId)->with([
            'board.placedTiles.anchor',
            'board.placedTiles.tile',
            'board.placedTiles.placedSubtiles',
            'currentPlayer'
        ])->first();

        return response()->json([
            'success' => true,
            'message' => 'Turn has been successfully advanced!',
            'game' => $activeGame,
        ], 200);
    }
}
