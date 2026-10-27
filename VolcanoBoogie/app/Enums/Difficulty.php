<?php

namespace App\Enums;

enum Difficulty: string
{
    case BEGINNER = "beginner";
    case NORMAL = "normal";
    case ADVANCED = "advanced";
    case EXPERT = "expert";
}
