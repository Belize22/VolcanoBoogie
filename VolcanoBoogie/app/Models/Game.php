<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Enums\GameStatus;
use App\Models\Bag;
use App\Models\Board;

#[Fillable(['status'])]
class Game extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    
    public function board(): HasOne
    {
        return $this->hasOne(Board::class);
    }

    public function bag(): HasOne
    {
        return $this->hasOne(Bag::class);
    }

    protected function casts(): array
    {
        return [
            'status' => GameStatus::class,
        ];
    }
}
