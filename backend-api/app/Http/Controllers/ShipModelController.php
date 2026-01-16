<?php

namespace App\Http\Controllers;

use App\Models\ShipModel;
use Illuminate\Http\Request;

class ShipModelController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/ship-models",
     * tags={"Ships"},
     * summary="Get list of ship models",
     * @OA\Response(
     * response=200,
     * description="Successful operation"
     * )
     * )
     */
    public function index()
    {
        return response()->json(ShipModel::all());
    }

    // Admin Only: Create a new ship model
    public function store(Request $request)
    {
        // 1. Validate Input
        $validated = $request->validate([
            'name' => 'required|string|unique:ship_models,name',
            'hull_mass' => 'required|numeric|min:1',
            'max_power_plant' => 'required|integer|min:1|max:8',
            'max_thrusters' => 'required|integer|min:1|max:8',
            'max_fsd' => 'required|integer|min:1|max:8',
            'max_life_support' => 'required|integer|min:1|max:8',
            'max_power_distributor' => 'required|integer|min:1|max:8',
            'max_sensors' => 'required|integer|min:1|max:8',
            'max_fuel_tank' => 'required|integer|min:1|max:8',
        ]);

        // 2. Create the Model
        $shipModel = ShipModel::create($validated);

        return response()->json([
            'message' => 'New Ship Prototype Registered Successfully',
            'ship_model' => $shipModel
        ], 201);
    }
}