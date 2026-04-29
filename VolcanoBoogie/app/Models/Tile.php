<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\TileType;

class Tile extends Model
{
    protected function casts(): array
    {
        return [
            'tile_type' => TileType::class,
            'quantity' => 'integer',
        ];
    }
}
