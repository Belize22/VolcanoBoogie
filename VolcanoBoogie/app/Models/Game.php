<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Enums\GameState;
use App\Enums\GameStatus;
use App\Models\Bag;
use App\Models\Board;
use App\Models\Player;

#[Fillable(['status', 'game_state'])]
class Game extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    
    public function board(): HasOne
    {
        return $this->hasOne(Board::class);
    }

    public function bag(): HasOne
    {
        return $this->hasOne(Bag::class);
    }

    public function currentPlayer(): HasOne
    {
        return $this->hasOne(Player::class);
    }

    protected function casts(): array
    {
        return [
            'status' => GameStatus::class,
            'game_state' => GameState::class,
        ];
    }
}
