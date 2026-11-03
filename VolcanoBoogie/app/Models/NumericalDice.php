<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NumericalDice extends Model
{
    protected function casts(): array
    {
        return [
            'dice_id' => 'integer',
            'value' => 'integer',
            'context' => Context::class,
        ];
    }
}
