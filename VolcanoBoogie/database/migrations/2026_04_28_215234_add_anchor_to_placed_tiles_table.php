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
        Schema::table('placed_tiles', function (Blueprint $table) {
            $table->foreignId('anchor')->constrained('placed_subtiles')->nullable()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('placed_tiles', function (Blueprint $table) {
            $table->dropForeign('anchor');
        });
    }
};
