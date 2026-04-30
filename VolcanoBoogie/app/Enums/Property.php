<?php

namespace App\Enums;

enum Property: string
{
    case SAFE = 'safe'; 
    case FIRE = 'fire'; 
    case CAVE_IN = 'cave_in'; 
    case GUARDIAN = 'guardian'; 
    case SPIKE_TRAP = 'spike_trap'; 
    case DART_TRAP = 'dart_trap'; 
    case BRIDGE = 'bridge'; 
    case KEY_CHAMBER = 'key_chamber';
    case SANCTUM_ENTRANCE = 'sanctum_entrance';
    case SANCTUM_CHAMBER = 'sanctum_chamber';
}
