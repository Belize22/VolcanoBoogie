<?php

namespace App\Enums;

enum ExplorerRole: string
{
    case SAPPER = "sapper";
    case FOREMAN = "foreman";
    case VETERAN = "veteran";
    case MARKSMAN = "marksman";
    case ARISTOCRAT = "aristocrat";
    case ARCHAEOLOGIST = "archaeologist";
    case ROGUE = "rogue";
    case GUIDE = "guide";
    case HEALER = "healer";
    case PRIEST = "priest";
}
