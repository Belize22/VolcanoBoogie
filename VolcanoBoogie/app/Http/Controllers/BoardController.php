<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Board;
use App\Models\Game;
use App\Models\Player;

class BoardController extends Controller
{
    public function endTurn(Request $request)
    {
        $playerIds = Player::where('game_id', $request->gameId)
            ->orderBy('id')
            ->pluck('id')
            ->toArray();

        $currentPlayerId = Game::where('id', $request->gameId)
            ->pluck('current_player')
            ->first();

        $game = Game::where('id', $request->gameId)->first();
        if (in_array($currentPlayerId + 1, $playerIds)) {
            $game->current_player = $currentPlayerId + 1;
            $game->save();
        }
        else {
            $game->current_player = min($playerIds);
            $game->save();

            $board = Board::where('game_id', $request->gameId)->first();
            if ($board->turns_remaining > 0) {
                $board->turns_remaining = $board->turns_remaining - 1;
                $board->save();
            }
        }        
        
        $activeGame = Game::where('id', $request->gameId)->with([
            'board.placedTiles.anchor',
            'board.placedTiles.tile',
            'board.placedTiles.placedSubtiles',
        ])->first();

        return response()->json([
            'success' => true,
            'message' => 'Turn has been successfully advanced!',
            'game' => $activeGame,
        ], 200);
    }
}
