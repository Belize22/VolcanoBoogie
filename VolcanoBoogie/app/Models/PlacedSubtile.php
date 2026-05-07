<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Classes\Coordinate;
use App\Models\PlacedTile;
use App\Enums\PathType;
use App\Enums\Rotation;
use App\Enums\Property;

#[Fillable(['placed_tile_id', 'x_coordinate', 'y_coordinate', 'path_type', 'rotation', 'property', 'is_neutralized'])]
class PlacedSubtile extends Model
{
    protected $appends = ['coordinate'];
    protected $hidden = ['x_coordinate', 'y_coordinate'];

    public function placedTile(): BelongsTo
    {
        return $this->belongsTo(PlacedTile::class);
    }

    protected function coordinate(): Attribute
    {
        return Attribute::make(
            get: fn(mixed $value, array $attributes) => new Coordinate(
                $attributes['x_coordinate'],
                $attributes['y_coordinate'],
            ),
        );
    }

    protected function casts(): array
    {
        return [
            'placed_tile_id' => 'integer',
            'path_type' => PathType::class,
            'rotation' => Rotation::class,
            'property' => Property::class,
            'is_neutralized' => 'boolean',
        ];
    }
}
