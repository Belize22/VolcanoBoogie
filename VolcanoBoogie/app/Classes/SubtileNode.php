<?php

namespace App\Classes;

use App\Models\PlacedSubtile;

class SubtileNode
{
    /**
     * Create a new class instance.
     */
    public function __construct(PlacedSubtile $subtile)
    {
        $this->coordinate = $subtile->coordinate;
        $this->rotation = $subtile->rotation;
        $this->pathType = $subtile->path_type;
        $this->adjacentNodes = [];
        $this->visited = false;
    }
}
