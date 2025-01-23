<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;

class EmpresaController extends Controller
{
    // Lista todas as empresas
    public function index()
    {
        $empresas = Empresa::all();
        return response()->json([
            'success' => true,
            'data' => $empresas
        ], 200);
    }

    // Salva uma nova empresa no banco
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:empresas',
            'endereco' => 'required|string',
        ]);

        $empresa = Empresa::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Empresa criada com sucesso!',
            'data' => $empresa
        ], 201);
    }

    // Mostra os detalhes de uma empresa específica
    public function show($id)
    {
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json([
                'success' => false,
                'message' => 'Empresa não encontrada.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $empresa
        ], 200);
    }

    // Atualiza os dados de uma empresa no banco
    public function update(Request $request, $id)
    {
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json([
                'success' => false,
                'message' => 'Empresa não encontrada.'
            ], 404);
        }

        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:empresas,email,' . $id,
            'endereco' => 'required|string',
        ]);

        $empresa->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Empresa atualizada com sucesso!',
            'data' => $empresa
        ], 200);
    }

    // Remove uma empresa do banco de dados
    public function destroy($id)
    {
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json([
                'success' => false,
                'message' => 'Empresa não encontrada.'
            ], 404);
        }

        $empresa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Empresa excluída com sucesso!'
        ], 200);
    }
}
