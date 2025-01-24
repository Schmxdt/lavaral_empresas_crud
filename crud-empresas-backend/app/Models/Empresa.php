<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Empresa extends Model
{
    use HasFactory, SoftDeletes;

    // Tabela associada à model (opcional, se o nome não for o padrão pluralizado)
    protected $table = 'empresas';

    // Atributos que podem ser preenchidos em massa
    protected $fillable = [
        'nome',
        'email',
        'endereco',
        'telefone',
        'site'
    ];
}
