<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\ShipManageController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {

    Route::get('/login', function () {
        if (Auth::check()) {
            if (Auth::user()->role_id === 1) {
                return redirect()->route('admin.ships.index');
            } else {
                Auth::logout();
            }
        }
        return view('admin.login');
    })->name('login'); 

    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'login' => 'required',
            'password' => 'required'
        ]);

        $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'name';

        if (Auth::attempt([$loginType => $request->login, 'password' => $request->password])) {
            
            $user = Auth::user();

            if ($user->role_id === 1) {
                $request->session()->regenerate();
                return redirect()->intended('/admin/ships');
            }

            Auth::logout();
            return back()->withErrors([
                'login' => 'Access Denied: You do not have administrator privileges.',
            ]);
        }

        return back()->withErrors([
            'login' => 'Invalid credentials provided.',
        ]);
    })->name('admin.login.post');

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    })->name('admin.logout');


    Route::middleware(['auth'])->name('admin.')->group(function () {
        
        Route::get('/ships', [ShipManageController::class, 'index'])->name('ships.index');
        Route::get('/ships/{id}/edit', [ShipManageController::class, 'edit'])->name('ships.edit');
        Route::put('/ships/{id}', [ShipManageController::class, 'update'])->name('ships.update');
        Route::delete('/ships/{id}', [ShipManageController::class, 'destroy'])->name('ships.destroy');
    });

});