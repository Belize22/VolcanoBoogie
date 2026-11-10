<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\Context;
use App\Enums\Hazard;
use App\Models\Board;
use App\Models\Dice;
use App\Models\DiceRoll;
use App\Models\HazardDice;
use App\Models\NumericalDice;
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

        $diceRoll = DiceRoll::create();
        $dice = Dice::create();
        $hazardDice = HazardDice::create([
            'dice_id' => $dice->id,
            'hazard' => $selectedHazardValue,
        ]);
        $diceRoll->dice()->attach([$dice->id]);

        if ($selectedHazardValue === Hazard::CAVE_IN) {
            $diceValue = rand(1, 6);
            $dice = Dice::create();
            $numericalDice = NumericalDice::create([
                'dice_id' => $dice->id,
                'value' => $diceValue,
                'context' => Context::CAVE_IN,
            ]);
            $diceRoll->dice()->attach([$dice->id]);
        }
        
        $activeGame = Game::where('id', $request->gameId)->with([
            'board.placedTiles.anchor',
            'board.placedTiles.tile',
            'board.placedTiles.placedSubtiles',
            'currentPlayer'
        ])->first();

        $diceRoll = DiceRoll::where('id', $diceRoll->id)->with([
            'dice.hazardDice',
            'dice.numericalDice',
        ])->first();

        return response()->json([
            'success' => true,
            'message' => 'Turn has been successfully advanced!',
            'game' => $activeGame,
            'diceRoll' => $diceRoll,
        ], 200);
    }
}
