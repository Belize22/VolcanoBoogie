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
        Schema::create('placed_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('placed_tile_id')->constrained('placed_subtiles')->onDelete('cascade');
            $table->enum('item', ['key', 'artifact']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placed_items');
    }
};
