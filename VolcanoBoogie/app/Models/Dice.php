<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\DiceRoll;

class Dice extends Model
{
    protected $table = 'dice';

    public function hazardDice(): HasOne
    {
        return $this->hasOne(HazardDice::class);
    }
    
    public function numericalDice(): HasOne
    {
        return $this->hasOne(NumericalDice::class);
    }

    public function DiceRoll(): BelongsToMany 
    {
        return $this->belongsToMany(DiceRoll::class, 'dice_roll_summaries');
    }
}
