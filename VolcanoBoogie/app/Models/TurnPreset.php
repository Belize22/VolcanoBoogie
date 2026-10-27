<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\Difficulty;

class TurnPreset extends Model
{
    protected $hidden = ['created_at', 'updated_at', 'quantity'];

    protected function casts(): array
    {
        return [
            'players' => 'integer',
            'quantity' => Difficulty::class,
            'turns' => 'integer'
        ];
    }
}
