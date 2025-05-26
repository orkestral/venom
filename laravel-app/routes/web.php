<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController; // Added
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Updated dashboard route
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () { // Ensured dashboard routes are also within this group
    Route::post('/dashboard/connect', [DashboardController::class, 'connect'])->name('dashboard.connect');
    Route::post('/dashboard/disconnect', [DashboardController::class, 'disconnect'])->name('dashboard.disconnect');
    Route::post('/dashboard/simulate-connection', [DashboardController::class, 'simulateConnection'])->name('dashboard.simulate_connection');
    Route::post('/dashboard/send-message', [DashboardController::class, 'sendMessage'])->name('dashboard.send_message'); // Added
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
