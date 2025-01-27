<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

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

    public function checkExistingEmail($email)
    {
        $existingEmpresa = Empresa::withTrashed()->where('email', $email)->first();

        if ($existingEmpresa && !$existingEmpresa->trashed()) {
            return [
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => ['email' => ['O email já está em uso.']]
            ];
        }

        return null;
    }

    // Salva uma nova empresa no banco
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email',
            'endereco' => 'required|string',
            'telefone' => 'nullable|string',
            'site' => 'nullable|string'
        ]);

        // Verifica se o email já existe, incluindo registros excluídos logicamente
        $existingEmpresa = EmpresaController::checkExistingEmail($validatedData['email']);

        if ($existingEmpresa) {
            return response()->json($existingEmpresa, 422);
        }

        DB::beginTransaction();
        try {
            $empresa = Empresa::create($validatedData);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Empresa criada com sucesso!',
                'data' => $empresa
            ], 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar a empresa.',
                'error' => $e->getMessage()
            ], 500);
        }
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
            'email' => 'required|email',
            'endereco' => 'required|string',
            'telefone' => 'nullable|string',
            'site' => 'nullable|string'
        ]);

        DB::beginTransaction();
        try {
            $empresa->update($validatedData);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Empresa atualizada com sucesso!',
                'data' => $empresa
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar a empresa.',
                'error' => $e->getMessage()
            ], 500);
        }
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

        DB::beginTransaction();
        try {
            $empresa->delete();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Empresa excluída com sucesso!'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir a empresa.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
