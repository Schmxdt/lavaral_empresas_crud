// Referências aos elementos HTML
const empresasList = document.getElementById('empresas-list');
const btnAddEmpresa = document.getElementById('btn-add-empresa');
const btnVoltarMenu = document.getElementById('btn-voltar-menu');

// Redireciona para a tela de cadastro ao clicar no botão "Adicionar Empresa"
btnAddEmpresa.addEventListener('click', () => {
  window.location.href = '../empresas-edit/empresas-edit.html';
});

// Redireciona para a tela de menu ao clicar no botão "Voltar ao Menu"
btnVoltarMenu.addEventListener('click', () => {
  window.location.href = '../../menu/menu.html';
});

// Função para buscar empresas
async function fetchEmpresas() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/empresas');
    const result = await response.json();

    if (result.success) {
      renderTable(result.data);
    } else {
      console.error('Erro ao buscar empresas:', result);
    }
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
  }
}

// Renderiza a tabela com os dados das empresas
function renderTable(empresas) {
  empresasList.innerHTML = ''; // Limpa a tabela antes de renderizar
  empresas.forEach((empresa) => {
    const row = document.createElement('tr');

    // Quando clica na linha, vai para a página de detalhes
    row.addEventListener('click', () => {
      window.location.href = `empresa-detalhes.html?id=${empresa.id}`;
    });

    row.innerHTML = `
          <td>${empresa.id}</td>
          <td>${empresa.nome}</td>
          <td>${empresa.email}</td>
          <td>${empresa.endereco}</td>
          <td>
            <button class="btn-action btn-edit" onclick="editEmpresa(event, ${empresa.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action btn-delete" onclick="deleteEmpresa(event, ${empresa.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;

    empresasList.appendChild(row);
  });
}

// Evita a propagação do clique ao usar os botões de ação
function stopPropagation(event) {
  event.stopPropagation();
}

// Função para editar empresa
function editEmpresa(event, id) {
  stopPropagation(event);
  alert(`Editar empresa com ID ${id}`);
}

// Função para excluir empresa
async function deleteEmpresa(event, id) {
  stopPropagation(event);
  const confirmed = confirm('Tem certeza que deseja excluir esta empresa?');
  if (!confirmed) return;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();

    if (result.success) {
      alert('Empresa excluída com sucesso!');
      fetchEmpresas(); // Atualiza a tabela
    } else {
      console.error('Erro ao excluir empresa:', result);
    }
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
  }
}

// Inicializa a tabela ao carregar a página
fetchEmpresas(); 