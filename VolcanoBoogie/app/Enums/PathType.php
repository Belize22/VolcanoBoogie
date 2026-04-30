<?php

namespace App\Enums;

enum PathType: string
{
    case FOUR_WAY = "4_way";
    case T_JUNCTION = 't_junction';
    case L_JUNCTION = 'l_junction';
    case STRAIGHT = 'straight';
    case DEAD_END = 'dead_end';
}
