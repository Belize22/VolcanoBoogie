<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tiles', function (Blueprint $table) {
            $table->id();
            $table->enum('tile_type', [
                'entrance', 
                'sanctum', 
                'west_wing', 
                'east_wing',
                'safe',
                'fire_4_way',
                'fire_t_junction',
                'cave_in_1',
                'cave_in_2',
                'cave_in_3',
                'cave_in_4',
                'cave_in_5',
                'cave_in_6',
                'guardian_l_junction',
                'guardian_dead_end',
                'spike_trap',
                'dart_trap',
                'bridge',
                'key_chamber'
            ]);
            $table->integer('quantity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiles');
    }
};
