<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaController;

// Rota inicial (opcional)
Route::prefix('api')->group(function () {
    Route::get('/empresas', [EmpresaController::class, 'index']);
});

// Empresas 
Route::get('/empresas', [EmpresaController::class, 'index'])->name('empresas.index'); 
Route::get('/empresas/create', [EmpresaController::class, 'create'])->name('empresas.create'); 
Route::post('/empresas', [EmpresaController::class, 'store'])->name('empresas.store'); 
Route::get('/empresas/{id}', [EmpresaController::class, 'show'])->name('empresas.show'); 
Route::get('/empresas/{id}/edit', [EmpresaController::class, 'edit'])->name('empresas.edit'); 
Route::put('/empresas/{id}', [EmpresaController::class, 'update'])->name('empresas.update'); 
Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy'])->name('empresas.destroy');
