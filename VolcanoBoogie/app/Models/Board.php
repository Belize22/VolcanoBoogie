<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\BaggedTile;
use App\Models\DiceRolls;
use App\Models\Game;

#[Fillable(['game_id', 'turns', 'turns_remaining', 'is_cursed'])]
class Board extends Model
{
    protected $hidden = ['created_at', 'updated_at'];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function placedTiles(): HasMany
    {
        return $this->hasMany(PlacedTile::class);
    }

    public function diceRolls(): HasMany
    {
        return $this->hasMany(DiceRoll::class);
    }

    protected function casts(): array
    {
        return [
            'game_id' => 'integer',
            'turns' => 'integer',
            'turns_remaining' => 'integer',
            'is_cursed' => 'boolean'
        ];
    }
}
