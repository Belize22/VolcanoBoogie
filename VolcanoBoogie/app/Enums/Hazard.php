<?php

namespace App\Enums;

enum Hazard: string
{
    case FIRE = "fire";
    case TRIGGER_TRAPS = "trigger_traps";
    case STUMBLE = "stumble";
    case CAVE_IN = "cave_in";
    case SPAWN_GUARDIAN = "spawn_guardian";
    case MOVE_GUARDIAN = "move_guardian";
}
