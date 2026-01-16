<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Fsd;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
        return response()->json([
            'modules' => Module::all(),
            'fsds' => Fsd::all()
        ]);
    }
}