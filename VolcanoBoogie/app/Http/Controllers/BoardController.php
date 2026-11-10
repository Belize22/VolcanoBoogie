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
    const MIN_NUMBER_DICE_VALUE = 1;
    const MAX_NUMBER_DICE_VALUE = 6;

    public function endTurn(Request $request)
    {
        $this->advanceTurn($request);
        
        $board = Board::where('game_id', $request->gameId)->first();
        $diceRoll = DiceRoll::create([
            'board_id' => $board->id
        ]);

        $this->rollHazardDice($diceRoll);

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

    private function advanceTurn(Request $request)
    {
        $playerQuantity = Player::where('game_id', $request->gameId)
            ->count();

        $currentPlayer = Player::where('game_id', $request->gameId)
            ->where('is_current_player', true)
            ->first();
        
        //Next player is Player 1 if last player ended their turn.
        $nextPlayer = Player::where('game_id', $request->gameId)
            ->where('turn_order', $currentPlayer->turn_order !== $playerQuantity ? $currentPlayer->turn_order + 1 : 1)
            ->first();

        //Give next player their turn.
        $currentPlayer->is_current_player = false;
        $currentPlayer->save();

        $nextPlayer->is_current_player = true;
        $nextPlayer->save();

        //Decrease turns remaining by one if last player ended their turn.
        if ($currentPlayer->turn_order + 1 > $playerQuantity) {
            $board = Board::where('game_id', $request->gameId)->first();
            if ($board->turns_remaining > 0) {
                $board->turns_remaining = $board->turns_remaining - 1;
                $board->save();
            }
        }
    }

    private function rollHazardDice(DiceRoll $diceRoll)
    {
        $hazardValues = Hazard::cases();
        $selectedHazardValue = $hazardValues[rand(0, count($hazardValues) - 1)];

        $dice = Dice::create();
        $hazardDice = HazardDice::create([
            'dice_id' => $dice->id,
            'hazard' => $selectedHazardValue,
        ]);
        $diceRoll->dice()->attach([$dice->id]);

        //Cave-Ins need a numerical die rolled to determine which
        //tile gets caved in.
        if ($selectedHazardValue === Hazard::CAVE_IN) {
            $diceValue = rand(BoardController::MIN_NUMBER_DICE_VALUE, BoardController::MAX_NUMBER_DICE_VALUE);
            $dice = Dice::create();
            $numericalDice = NumericalDice::create([
                'dice_id' => $dice->id,
                'value' => $diceValue,
                'context' => Context::CAVE_IN,
            ]);
            $diceRoll->dice()->attach([$dice->id]);
        }
    }
}
