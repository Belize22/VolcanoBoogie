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
        
        Schema::create('turn_presets', function (Blueprint $table) {
            $table->id();
            $table->integer('players');
            $table->enum('difficulty', ['beginner', 'normal', 'advanced', 'expert']);
            $table->integer('turns');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turn_presets');
    }
};
