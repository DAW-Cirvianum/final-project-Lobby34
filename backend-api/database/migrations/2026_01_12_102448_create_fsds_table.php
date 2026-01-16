<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fsds', function (Blueprint $table) {
            $table->id();
            $table->integer('class_number');
            $table->char('rating_character', 1);
            $table->double('mass');
            $table->double('optimal_mass');
            $table->double('max_fuel_jump');
            $table->double('class_constant')->nullable();
            $table->double('rating_constant')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fsds');
    }
};
