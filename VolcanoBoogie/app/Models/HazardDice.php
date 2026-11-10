<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Enums\Hazard;

#[Fillable(['dice_id', 'hazard'])]
class HazardDice extends Model
{
    protected $table = 'hazard_dice';

    protected function casts(): array
    {
        return [
            'dice_id' => 'integer',
            'hazard' => Hazard::class,
        ];
    }
}
