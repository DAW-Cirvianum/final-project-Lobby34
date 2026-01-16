<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShipModel;
use Illuminate\Http\Request;

class ShipManageController extends Controller
{
    // 1. List all ships
    public function index() {
        $ships = ShipModel::all();
        return view('admin.ships.index', compact('ships'));
    }

    // 2. Show the Edit Form
    public function edit($id) {
        $ship = ShipModel::findOrFail($id);
        return view('admin.ships.edit', compact('ship'));
    }

    // 3. Update the Ship in Database
    public function update(Request $request, $id) {
        $ship = ShipModel::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string',
            'hull_mass' => 'required|integer',
            'max_fsd' => 'required|integer|max:8',
            'max_thrusters' => 'required|integer|max:8',
        ]);

        $ship->update($request->all());

        return redirect()->route('admin.ships.index')
                         ->with('success', 'Ship updated successfully!');
    }
    
    // 4. Delete Ship
    public function destroy($id) {
        ShipModel::destroy($id);
        return redirect()->route('admin.ships.index')
                         ->with('success', 'Ship model deleted.');
    }
}
