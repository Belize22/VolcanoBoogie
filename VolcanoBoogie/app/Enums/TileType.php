<?php

namespace App\Enums;

use App\Enums\PathType;

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

    public static function tileTypeToPathType(TileType $tileType) {
        switch($tileType) {
            case TileType::FIRE_4_WAY:
            case TileType::CAVE_IN_1:
            case TileType::CAVE_IN_2:
            case TileType::CAVE_IN_3:
            case TileType::SPIKE_TRAP:
                return PathType::FOUR_WAY;
                break;
            case TileType::SAFE:
            case TileType::FIRE_T_JUNCTION:
            case TileType::CAVE_IN_4:
            case TileType::CAVE_IN_5:
            case TileType::CAVE_IN_6:
                return PathType::T_JUNCTION;
                break;
            case TileType::GUARDIAN_L_JUNCTION:
            case TileType::DART_TRAP:
                return PathType::L_JUNCTION;
                break;
            case TileType::GUARDIAN_DEAD_END:
            case TileType::KEY_CHAMBER:
                return PathType::DEAD_END;
                break;
            default: //Bridge
                return PathType::STRAIGHT;
        }
    }
}
