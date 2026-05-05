<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\Bag;

#[Fillable(['bag_id', 'tile_id'])]
class BaggedTile extends Model
{
    public function game(): BelongsTo
    {
        return $this->belongsTo(Bag::class);
    }

    protected function casts(): array
    {
        return [
            'bag_id' => 'integer',
            'tile_id' => 'integer',
        ];
    }
}
