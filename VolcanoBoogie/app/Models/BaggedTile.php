<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['game_id', 'tile_id'])]
class BaggedTile extends Model
{
    protected function casts(): array
    {
        return [
            'game_id' => 'integer',
            'tile_id' => 'integer',
        ];
    }
}
