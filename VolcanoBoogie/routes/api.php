<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;


Route::post('/place-tile', [GameController::class, 'placeTile'])->name('place-tile');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
