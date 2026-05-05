<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['board_id', 'tile_id'])]
class PlacedTile extends Model
{
    protected function casts(): array
    {
        return [
            'board_id' => 'integer',
            'tile_id' => 'integer',
            'anchor' => 'integer',
        ];
    }
}
