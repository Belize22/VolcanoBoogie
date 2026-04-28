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
        Schema::create('placed_subtiles', function (Blueprint $table) {
            $table->id();
            $table->number('x_coordinate');
            $table->number('y_coordinate');
            $table->boolean('is_neutralized');
            $table->enum('path_type', ['4_way', 't_junction', 'l_junction', 'straight', 'dead_end']);
            $table->enum('property', [
                'safe', 
                'fire', 
                'cave_in', 
                'guardian', 
                'spike_trap', 
                'dart_trap', 
                'bridge', 
                'key_chamber',
                'sanctum_entrance',
                'sanctum_chamber'
            ]);
            $table->enum('item', ['none', 'key', 'artifact']);
            $table->timestamps();

            //TO-DO: Create many-to-many bridge table for adjacent subtiles.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placed_subtiles');
    }
};
