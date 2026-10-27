<?php

namespace App\Enums;

enum PlayerStatus: string
{
    case ACTIVE = "active";
    case DOWNED = "downed";
    case FALLEN = "fallen";
}
