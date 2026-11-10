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
        Schema::create('dice_roll_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dice_roll_id')->constrained('dice_rolls')->onDelete('cascade');
            $table->foreignId('dice_id')->constrained('dice')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dice_roll_summaries');
    }
};
