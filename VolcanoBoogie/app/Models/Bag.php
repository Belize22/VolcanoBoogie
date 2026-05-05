<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\BaggedTile;
use App\Models\Game;

#[Fillable(['game_id'])]
class Bag extends Model
{    
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function baggedTiles(): HasMany
    {
        return $this->hasMany(BaggedTile::class);
    }

    protected function casts(): array
    {
        return [
            'game_id' => 'integer',
        ];
    }
}
