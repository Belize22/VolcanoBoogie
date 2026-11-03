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
        Schema::create('numerical_dice', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dice_id')->unique()->constrained('dice')->onDelete('cascade');
            $table->integer('value');
            $table->enum('context', ['cave_in', 'fight_guardian', 'dodge_trap']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('numerical_dice');
    }
};
