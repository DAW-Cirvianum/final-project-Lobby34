<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserShip extends Model
{
    protected $fillable = ['user_id', 'ship_model_id', 'fsd_id', 'total_mass'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shipModel()
    {
        return $this->belongsTo(ShipModel::class);
    }

    public function fsd()
    {
        return $this->belongsTo(Fsd::class);
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'user_ship_modules')
            ->withPivot('installed_slot_index');
    }

    public function calculateTotalMass() {
    // Sum Hull Mass + FSD Mass + All Modules Mass
    $mass = $this->shipModel->hull_mass + $this->fsd->mass;
    
    foreach($this->modules as $module) {
        $mass += $module->mass;
    }
    
    $this->total_mass = $mass;
    $this->save(); // Save to DB
    return $mass;
}

public function calculateJumpRange() {
    $this->calculateTotalMass(); // Ensure mass is up to date
    
    $fsd = $this->fsd;
    $totalMass = $this->total_mass;

    if ($totalMass <= 0) return 0;

    $term1 = pow(1000, (1 / $fsd->class_constant));
    $term2 = $fsd->optimal_mass;
    $term3 = pow(($fsd->max_fuel_jump / $fsd->rating_constant), (1 / $fsd->class_constant));

    return ($term1 * $term2 * $term3) / $totalMass;
}
}
