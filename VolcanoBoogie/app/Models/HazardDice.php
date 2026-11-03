<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HazardDice extends Model
{
    protected function casts(): array
    {
        return [
            'dice_id' => 'integer',
            'hazard' => Hazard::class,
        ];
    }
}
