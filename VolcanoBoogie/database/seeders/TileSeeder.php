<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Tile;
use App\Enums\TileType;

class TileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tiles')->insert([
            [
                'tile_type' => TileType::ENTRANCE,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::SANCTUM,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::WEST_WING,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::EAST_WING,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::SAFE,
                'quantity' => 3,
            ],
            [
                'tile_type' => TileType::FIRE_4_WAY,
                'quantity' => 3,
            ],
            [
                'tile_type' => TileType::FIRE_T_JUNCTION,
                'quantity' => 2,
            ],
            [
                'tile_type' => TileType::CAVE_IN_1,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::CAVE_IN_2,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::CAVE_IN_3,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::CAVE_IN_4,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::CAVE_IN_5,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::CAVE_IN_6,
                'quantity' => 1,
            ],
            [
                'tile_type' => TileType::GUARDIAN_L_JUNCTION,
                'quantity' => 2,
            ],
            [
                'tile_type' => TileType::GUARDIAN_DEAD_END,
                'quantity' => 2,
            ],
            [
                'tile_type' => TileType::GUARDIAN_L_JUNCTION,
                'quantity' => 2,
            ],
            [
                'tile_type' => TileType::SPIKE_TRAP,
                'quantity' => 3,
            ],
            [
                'tile_type' => TileType::DART_TRAP,
                'quantity' => 4,
            ],
            [
                'tile_type' => TileType::BRIDGE,
                'quantity' => 2,
            ],
            [
                'tile_type' => TileType::KEY_CHAMBER,
                'quantity' => 3,
            ],
        ]);
    }
}
