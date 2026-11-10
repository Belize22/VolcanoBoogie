<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\Hazard;
use App\Models\Dice;

#[Fillable(['dice_id', 'hazard'])]
class HazardDice extends Model
{
    protected $table = 'hazard_dice';

    public function dice(): BelongsTo
    {
        return $this->belongsTo(Dice::class);
    }

    protected function casts(): array
    {
        return [
            'dice_id' => 'integer',
            'hazard' => Hazard::class,
        ];
    }
}
