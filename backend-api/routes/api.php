<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserShipController;
use App\Http\Controllers\ShipModelController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\NewPasswordController;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Admin\ShipManageController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/ship-models', [ShipModelController::class, 'index']);
Route::post('/forgot-password', [NewPasswordController::class, 'forgotPassword']);
Route::post('/reset-password', [NewPasswordController::class, 'reset']);


//Protected Routes
Route::group(['middleware' => ['auth:sanctum']], function() {
    Route::post('/logout', [AuthController::class, 'logout']);

    //See available Modules and FSDs
    Route::get('/modules', [ModuleController::class, 'index']);
    
    //UserShips CRUD
    Route::get('/my-ships', [UserShipController::class, 'index']);
    Route::post('/my-ships', [UserShipController::class, 'store']);
    Route::get('/my-ships/{id}', [UserShipController::class, 'show']);
    Route::put('/my-ships/{id}', [UserShipController::class, 'update']);
    Route::delete('/my-ships/{id}', [UserShipController::class, 'destroy']);

    //Admin Only - Ship Models Management
    Route::post('/ship-models', [ShipModelController::class, 'store']);
    
});