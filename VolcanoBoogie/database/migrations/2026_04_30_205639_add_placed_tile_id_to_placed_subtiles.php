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
        Schema::table('placed_subtiles', function (Blueprint $table) {
            $table->foreignId('placed_tile_id')->constrained('placed_tiles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('placed_subtiles', function (Blueprint $table) {
            $table->dropColumn('placed_tile_id');
        });
    }
};
