<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fsd extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_number',
        'rating_character',
        'mass',
        'optimal_mass',
        'max_fuel_jump',
        'class_constant',
        'rating_constant',
    ];

    public function userShips()
    {
        return $this->hasMany(UserShip::class);
    }
}