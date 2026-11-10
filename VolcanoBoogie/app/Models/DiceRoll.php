<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\Board;
use App\Models\Dice;

#[Fillable(['board_id'])]
class DiceRoll extends Model
{
    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function Dice(): BelongsToMany 
    {
        return $this->belongsToMany(Dice::class, 'dice_roll_summaries');
    }
    protected function casts(): array
    {
        return [
            'board_id' => 'integer',
        ];
    }
}
