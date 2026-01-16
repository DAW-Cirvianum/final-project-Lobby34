<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_number',
        'rating_character',
        'mass',
        'slot_type', // 1=Hardpoint, 2=PowerPlant, 3=Thrusters, etc.
    ];

    // Many ships can have this module installed
    public function userShips()
    {
        return $this->belongsToMany(UserShip::class, 'user_ship_modules')
                    ->withPivot('installed_slot_index')
                    ->withTimestamps();
    }
}