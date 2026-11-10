<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\Context;
use App\Models\Dice;

#[Fillable(['dice_id', 'value', 'context'])]
class NumericalDice extends Model
{
    protected $table = 'numerical_dice';

    public function dice(): BelongsTo
    {
        return $this->belongsTo(Dice::class);
    }

    protected function casts(): array
    {
        return [
            'dice_id' => 'integer',
            'value' => 'integer',
            'context' => Context::class,
        ];
    }
}
