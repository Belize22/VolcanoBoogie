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
        Schema::create('hazard_dice', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dice_id')->unique()->constrained('dice')->onDelete('cascade');
            $table->enum('hazard', ['fire', 'trigger_traps', 'stumble', 'cave_in', 'spawn_guardian', 'move_guardian']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hazard_dice');
    }
};
