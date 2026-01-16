<?php

namespace App\Http\Controllers;

use App\Models\UserShip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserShipController extends Controller
{
    // GET ALL SHIPS
    public function index()
    {
        // Return only the logged-in user's ships
        $ships = UserShip::where('user_id', Auth::id())
            ->with(['shipModel', 'fsd']) // Load relations
            ->get();

        return response()->json($ships);
    }

    // ADD NEW SHIP
    public function store(Request $request)
    {
        $request->validate([
            'ship_model_id' => 'required|exists:ship_models,id',
            'fsd_id' => 'required|exists:fsds,id'
        ]);

        $ship = UserShip::create([
            'user_id' => Auth::id(),
            'ship_model_id' => $request->ship_model_id,
            'fsd_id' => $request->fsd_id,
            'total_mass' => 0 // Will be calculated
        ]);

        // Logic to calculate mass immediately after creation
        $ship->calculateTotalMass();

        return response()->json([
            'message' => 'Ship added successfully',
            'ship' => $ship
        ], 201);
    }

    // GET SINGLE SHIP & JUMP RANGE
    public function show($id)
    {
        $ship = UserShip::where('user_id', Auth::id())
            ->with(['shipModel', 'fsd', 'modules'])
            ->findOrFail($id);

        $jumpRange = $ship->calculateJumpRange();

        return response()->json([
            'ship_details' => $ship,
            'max_jump_range' => $jumpRange
        ]);
    }

    // UPDATE SHIP MODULES
    public function update(Request $request, $id)
    {
        // 1. Find the ship
        $ship = UserShip::where('user_id', Auth::id())->findOrFail($id);

        // 2. Update FSD if provided
        if ($request->has('fsd_id')) {
            $ship->fsd_id = $request->fsd_id;
            $ship->save();
        }

        // 3. Update Modules (The "Re-fit" logic)
        if ($request->has('modules')) {
            // 'modules' should be an array like: [ { "module_id": 10, "slot": 2 }, ... ]

            // Remove all old modules to prevent duplicates/conflicts
            $ship->modules()->detach();

            // Re-install new modules
            foreach ($request->modules as $moduleData) {
                // Skip empty slots
                if (!$moduleData['module_id'])
                    continue;

                $ship->modules()->attach($moduleData['module_id'], [
                    'installed_slot_index' => $moduleData['slot']
                ]);
            }
        }

        // 4. Recalculate Physics
        $ship->calculateTotalMass();

        return response()->json([
            'message' => 'Ship configuration updated successfully',
            'ship' => $ship->load(['shipModel', 'fsd', 'modules'])
        ]);
    }

    // REMOVE SHIP
    public function destroy($id)
    {
        // 1. Find the ship (Ensure it belongs to the logged-in user)
        $ship = \App\Models\UserShip::where('user_id', \Illuminate\Support\Facades\Auth::id())
            ->findOrFail($id);

        // 2. Delete it
        $ship->delete();

        return response()->json(['message' => 'Ship sold for scrap successfully.']);
    }
}