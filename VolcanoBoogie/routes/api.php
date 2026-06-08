<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TileController;


Route::post('/place-tile', [TileController::class, 'placeTile'])->name('place-tile');
Route::post('/confirm-tile-rotation', [TileController::class, 'confirmTileRotation'])->name('confirm-tile-rotation');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
