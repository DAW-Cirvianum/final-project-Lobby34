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
        Schema::table('user_ships', function (Blueprint $table) {
            // 1. Drop the old "Strict" constraint
            // We use the exact name from your error log
            $table->dropForeign('user_ships_ship_model_id_foreign');

            // 2. Add the new "Cascade" constraint
            // When a Ship Model is deleted, delete the user's ship too.
            $table->foreign('ship_model_id')
                  ->references('id')
                  ->on('ship_models') // <--- Make sure this matches your real ships table name
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_ships', function (Blueprint $table) {
            // Drop the cascade rule
            $table->dropForeign(['ship_model_id']);

            // Restore the strict rule
            $table->foreign('ship_model_id')
                  ->references('id')
                  ->on('ship_models');
        });
    }
};