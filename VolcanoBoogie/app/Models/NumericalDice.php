<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Enums\Context;

#[Fillable(['dice_id', 'value', 'context'])]
class NumericalDice extends Model
{
    protected $table = 'numerical_dice';

    protected function casts(): array
    {
        return [
            'dice_id' => 'integer',
            'value' => 'integer',
            'context' => Context::class,
        ];
    }
}
