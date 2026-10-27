<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Enums\Difficulty;

class TurnPresetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('turn_presets')->insert([
            [
                'players' => 3,
                'difficulty' => Difficulty::BEGINNER,
                'turns' => 27,
            ],
            [
                'players' => 4,
                'difficulty' => Difficulty::BEGINNER,
                'turns' => 24,
            ],
            [
                'players' => 5,
                'difficulty' => Difficulty::BEGINNER,
                'turns' => 22,
            ],
            [
                'players' => 6,
                'difficulty' => Difficulty::BEGINNER,
                'turns' => 20,
            ],
            [
                'players' => 3,
                'difficulty' => Difficulty::NORMAL,
                'turns' => 26,
            ],
            [
                'players' => 4,
                'difficulty' => Difficulty::NORMAL,
                'turns' => 21,
            ],
            [
                'players' => 5,
                'difficulty' => Difficulty::NORMAL,
                'turns' => 19,
            ],
            [
                'players' => 6,
                'difficulty' => Difficulty::NORMAL,
                'turns' => 17,
            ],
            [
                'players' => 3,
                'difficulty' => Difficulty::ADVANCED,
                'turns' => 22,
            ],
            [
                'players' => 4,
                'difficulty' => Difficulty::ADVANCED,
                'turns' => 18,
            ],
            [
                'players' => 5,
                'difficulty' => Difficulty::ADVANCED,
                'turns' => 16,
            ],
            [
                'players' => 6,
                'difficulty' => Difficulty::ADVANCED,
                'turns' => 14,
            ],
            [
                'players' => 3,
                'difficulty' => Difficulty::EXPERT,
                'turns' => 20,
            ],
            [
                'players' => 4,
                'difficulty' => Difficulty::EXPERT,
                'turns' => 16,
            ],
            [
                'players' => 5,
                'difficulty' => Difficulty::EXPERT,
                'turns' => 14,
            ],
            [
                'players' => 6,
                'difficulty' => Difficulty::EXPERT,
                'turns' => 12,
            ],
        ]);
    }
}
