<?php

namespace App\Enums;

enum Context: string
{
    case CAVE_IN = "cave_in";
    case FIGHT_GUARDIAN = "fight_guardian";
    case DODGE_TRAP = "dodge_trap";
}
