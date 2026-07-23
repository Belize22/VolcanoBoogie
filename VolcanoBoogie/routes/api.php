<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TileController;

Route::post('/place-tile', [TileController::class, 'placeTile'])->name('place-tile');
Route::post('/confirm-tile-rotation', [TileController::class, 'confirmTileRotation'])->name('confirm-tile-rotation');
Route::get('/get-tile-placement-candidates', [TileController::class, 'getAvailableSpotsForTilePlacement'])->name('get-tile-placement-candidates');
Route::get('/get-sanctum-placement-candidates', [TileController::class, 'getAvailableSpotsForSanctumPlacement'])->name('get-sanctum-placement-candidates');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
