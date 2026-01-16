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
        Schema::create('user_ship_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_ship_id')->constrained('user_ships')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules');
            $table->integer('installed_slot_index');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_ship_modules');
    }
};
