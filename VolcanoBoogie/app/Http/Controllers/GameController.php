<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Game;
use App\Enums\GameStatus;

class GameController extends Controller
{
    public function playGame()
    {
        $activeGame = $this->getActiveGame();

        if (!$activeGame) {
            $activeGame = $this->createGame();
        }

        return Inertia::render('play-game', []);
    }

    private function createGame()
    {
        $game = Game::create([
            'status' => GameStatus::IN_PROGRESS,
        ]);
        
        return $game;
    }

    private function getActiveGame()
    {
        $game = Game::where('status', GameStatus::IN_PROGRESS)->first();
        return $game;
    }
}
