<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipModel extends Model
{
    use HasFactory;

    // 1. ADD THIS ARRAY TO FIX THE ERROR
    protected $fillable = [
        'name',
        'hull_mass',
        'max_power_plant',
        'max_thrusters',
        'max_fsd',
        'max_life_support',
        'max_power_distributor',
        'max_sensors',
        'max_fuel_tank',
    ];

    // Relationships
    public function userShips() {
        return $this->hasMany(UserShip::class);
    }
}