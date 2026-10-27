<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Enums\ExplorerRole;
use App\Enums\Item;
use App\Enums\PlayerStatus;

#[Fillable(['game_id', 'explorer_role', 'current_health', 'max_health', 'item', 'player_status'])]
class Player extends Model
{
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    protected function casts(): array
    {
        return [
            'game_id' => 'integer',
            'explorer_role' => ExplorerRole::class,
            'current_health' => 'integer',
            'max_health' => 'integer',
            'item' => Item::class,
            'player_status' => PlayerStatus::class,
        ];
    }
}
