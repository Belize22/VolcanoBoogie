<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;


Route::post('/place-tile', [GameController::class, 'placeTile'])->name('place-tile');
Route::post('/confirm-tile-rotation', [GameController::class, 'confirmTileRotation'])->name('confirm-tile-rotation');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
