<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\Board;

#[Fillable(['board_id', 'tile_id'])]
class PlacedTile extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    
    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }
    
    public function placedSubtiles(): HasMany
    {
        return $this->hasMany(PlacedSubtile::class);
    }

    public function anchor(): HasOne
    {
        return $this->hasOne(PlacedSubtile::class);
    }

    protected function casts(): array
    {
        return [
            'board_id' => 'integer',
            'tile_id' => 'integer',
            'anchor' => 'array',
        ];
    }
}
