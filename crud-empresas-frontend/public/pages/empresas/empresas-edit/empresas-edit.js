async function loadEmpresa(id) {
    const response = await fetch(`/api/empresas/${id}`);
    const empresa = await response.json();
    document.getElementById('nome').value = empresa.nome;
    document.getElementById('email').value = empresa.email;
    document.getElementById('endereco').value = empresa.endereco;
}

const id = new URLSearchParams(window.location.search).get('id');
loadEmpresa(id);

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        endereco: document.getElementById('endereco').value,
    };

    await fetch(`/api/empresas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });

    window.location.href = 'empresas.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    const id = params.get('id'); // Obtém o ID
    const isView = params.get('isView') === 'true'; // Verifica se é modo visualização

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const enderecoInput = document.getElementById('endereco');
    const btnSave = document.getElementById('btn-save');
    const btnBack = document.getElementById('btn-back');

    // Se for modo visualização, desativa os campos e o botão salvar
    if (isView) {
        nomeInput.disabled = true;
        emailInput.disabled = true;
        enderecoInput.disabled = true;
        btnSave.style.display = 'none';
    }

    // Função para carregar os dados da empresa
    async function loadEmpresaData() {
        if (!id) return; // Sem ID, não carrega dados

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}`);
            const result = await response.json();

            if (result.success) {
                nomeInput.value = result.data.nome;
                emailInput.value = result.data.email;
                enderecoInput.value = result.data.endereco;
            } else {
                alert('Erro ao carregar os dados da empresa.');
            }
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
        }
    }

    // Salvar alterações
    document.getElementById('editForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // faz o create
        const newData = {
            nome: nomeInput.value,
            email: emailInput.value,
            endereco: enderecoInput.value,
        };

        if (!id) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/empresas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newData),
                });

                const result = await response.json();

                if (result.success) {
                    alert('Empresa criada com sucesso!');
                    window.location.href = 'empresas.html';
                } else {
                    alert('Erro ao criar empresa.');
                }
            } catch (error) {
                console.error('Erro ao criar empresa:', error);
            }
        } else {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });

                const result = await response.json();

                if (result.success) {
                    alert('Empresa atualizada com sucesso!');
                    window.location.href = 'empresas.html';
                } else {
                    alert('Erro ao atualizar empresa.');
                }
            } catch (error) {
                console.error('Erro ao atualizar empresa:', error);
            }
        };
    });

    // Voltar para a lista
    btnBack.addEventListener('click', () => {
        window.location.href = 'empresas.html';
    });

    // Carrega os dados da empresa ao iniciar
    loadEmpresaData();
});
