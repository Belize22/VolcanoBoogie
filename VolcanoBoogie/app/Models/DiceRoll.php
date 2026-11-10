<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Dice;

class DiceRoll extends Model
{
    public function Dice(): BelongsToMany 
    {
        return $this->belongsToMany(Dice::class, 'dice_roll_summaries');
    }
}
