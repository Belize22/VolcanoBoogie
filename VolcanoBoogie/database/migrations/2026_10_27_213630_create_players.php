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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->unique()->constrained('games')->onDelete('cascade');
            $table->enum('explorer_role', [
                'sapper',
                'foreman',
                'veteran',
                'marksman',
                'aristocrat',
                'archaeologist',
                'rogue',
                'guide',
                'healer',
                'priest'
            ]);
            $table->integer('current_health');
            $table->integer('max_health');
            $table->enum('item', ['key', 'artifact'])->nullable();
            $table->enum('player_status', ['active', 'downed', 'fallen']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
