<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // REGISTER (Java Case: Not explicitly in main loop, but required for web app)
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|unique:users,name',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed' // Expects password_confirmation field
        ]);

        // Assign default role (e.g., 'user')
        // Ensure you run your Role seeder first so ID 2 exists, or look it up by name
        $userRole = Role::where('name', 'user')->first(); 
        
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'role_id' => $userRole ? $userRole->id : 1 // Fallback or strict assignment
        ]);

        $token = $user->createToken('EliteAppToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // LOGIN (Java Case: Main.java authentication loop)
    public function login(Request $request)
    {
        $fields = $request->validate([
            'login' => 'required|string', // Can be name OR email
            'password' => 'required|string'
        ]);

        // Check if input is email or username
        $loginType = filter_var($fields['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'name';

        // Attempt login
        if (!Auth::attempt([$loginType => $fields['login'], 'password' => $fields['password']])) {
            return response()->json([
                'message' => 'User or Password Incorrect' // Matching your Java error message
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('EliteAppToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    // LOGOUT (Java Case 6 & 7)
    public function logout(Request $request)
    {
        // Delete the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}