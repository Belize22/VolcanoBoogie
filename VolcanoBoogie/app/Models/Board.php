<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\BaggedTile;
use App\Models\Game;

#[Fillable(['game_id'])]
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

    protected function casts(): array
    {
        return [
            'game_id' => 'integer',
        ];
    }
}
