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
        Schema::create('ship_models', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->double('hull_mass');
            // Constraints (Max Class for slots)
            $table->integer('max_power_plant');
            $table->integer('max_thrusters');
            $table->integer('max_fsd');
            $table->integer('max_life_support');
            $table->integer('max_power_distributor');
            $table->integer('max_sensors');
            $table->integer('max_fuel_tank');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ship_models');
    }
};
