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
        Schema::table('players', function (Blueprint $table) {
            $table->dropForeign(['current_placed_subtile_id']);
            $table->dropColumn('current_placed_subtile_id');
        });

        Schema::table('players', function (Blueprint $table) {
            $table->integer('x_coordinate')->nullable();
            $table->integer('y_coordinate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->foreignId('current_placed_subtile_id')->nullable()->constrained('placed_subtiles')->onDelete('cascade')->default(null);
        });
        
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn('x_coordinate');
            $table->dropColumn('y_coordinate');
        });
    }
};
