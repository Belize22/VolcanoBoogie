<?php

namespace App\Enums;

enum GameState: string
{
    case PLACING_TILE = "placing_tile";
    case ROTATING_TILE = "rotating_tile";
    case PLACING_SANCTUM = "placing_sanctum";
    case ROTATING_SANCTUM = "rotating_sanctum";
}
