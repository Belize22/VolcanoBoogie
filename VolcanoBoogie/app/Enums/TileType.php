<?php

namespace App\Enums;

enum TileType: string
{
    case ENTRANCE = 'entrance';
    case SANCTUM = 'sanctum'; 
    case WEST_WING = 'west_wing';
    case EAST_WING = 'east_wing';
    case SAFE = 'safe';
    case FIRE_4_WAY = 'fire_4_way';
    case FIRE_T_JUNCTION = 'fire_t_junction';
    case CAVE_IN_1 = 'cave_in_1';
    case CAVE_IN_2 = 'cave_in_2';
    case CAVE_IN_3 = 'cave_in_3';
    case CAVE_IN_4 = 'cave_in_4';
    case CAVE_IN_5 = 'cave_in_5';
    case CAVE_IN_6 = 'cave_in_6';
    case GUARDIAN_L_JUNCTION = 'guardian_l_junction';
    case GUARDIAN_DEAD_END = 'guardian_dead_end';
    case SPIKE_TRAP = 'spike_trap';
    case DART_TRAP = 'dart_trap';
    case BRIDGE = 'bridge';
    case KEY_CHAMBER = 'key_chamber';
}
