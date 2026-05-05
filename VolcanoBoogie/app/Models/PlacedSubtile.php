<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\PlacedTile;
use App\Enums\PathType;
use App\Enums\Rotation;
use App\Enums\Property;

#[Fillable(['placed_tile_id', 'x_coordinate', 'y_coordinate', 'path_type', 'rotation', 'property', 'is_neutralized'])]
class PlacedSubtile extends Model
{
    public function placedTile(): BelongsTo
    {
        return $this->belongsTo(PlacedTile::class);
    }

    protected function casts(): array
    {
        return [
            'placed_tile_id' => 'integer',
            'x_coordinate' => 'integer',
            'y_coordinate' => 'integer',
            'path_type' => PathType::class,
            'rotation' => Rotation::class,
            'property' => Property::class,
            'is_neutralized' => 'boolean',
        ];
    }
}
