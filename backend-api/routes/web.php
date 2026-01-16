<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\ShipManageController;

// 1. Default Welcome
Route::get('/', function () {
    return view('welcome');
});

// --- AUTHENTICATION ROUTES ---

// Show the Login Form
Route::get('/login', function () {
    if (Auth::check()) {
        return redirect()->route('admin.ships.index');
    }
    return view('admin.login');
})->name('login');

// Process the Login Form
Route::post('/login', function (Request $request) {
    // Validate input
    $credentials = $request->validate([
        'login' => 'required',
        'password' => 'required'
    ]);

    // Determine if input is email or username
    $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'name';

    // Attempt to log in
    if (Auth::attempt([$loginType => $request->login, 'password' => $request->password])) {
        $request->session()->regenerate();
        return redirect()->intended('/admin/ships');
    }

    // If failed, go back with error
    return back()->withErrors([
        'login' => 'Invalid credentials provided.',
    ]);
})->name('login.post');

// Logout Route
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login');
})->name('logout');


// --- ADMIN BACKEND ROUTES (Protected) ---
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    
    // Ship Manager
    Route::get('/ships', [ShipManageController::class, 'index'])->name('ships.index');
    Route::get('/ships/{id}/edit', [ShipManageController::class, 'edit'])->name('ships.edit');
    Route::put('/ships/{id}', [ShipManageController::class, 'update'])->name('ships.update');
    Route::delete('/ships/{id}', [ShipManageController::class, 'destroy'])->name('ships.destroy');

});