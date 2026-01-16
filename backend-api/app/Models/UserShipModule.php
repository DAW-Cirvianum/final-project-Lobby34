<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;
class UserShipModule extends Pivot
{
    use HasFactory;

    protected $table = 'user_ship_modules';

    protected $fillable = [
        'user_ship_id',
        'module_id',
        'installed_slot_index',
    ];
}