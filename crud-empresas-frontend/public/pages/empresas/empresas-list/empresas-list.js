document.addEventListener('DOMContentLoaded', () => {
  const empresasList = document.getElementById('empresas-list');
  const btnAddEmpresa = document.getElementById('btn-add-empresa');
  const btnVoltarMenu = document.getElementById('btn-voltar-menu');
  const searchInput = document.getElementById('search-input');
  const btnRefresh = document.getElementById('btn-refresh');
  let empresas = [];
  let sortOrder = 'asc';
  let sortColumn = '';

  // Event Listeners
  btnAddEmpresa.addEventListener('click', () => {
    window.location.href = '../empresas-edit/empresas-edit.html';
  });

  btnVoltarMenu.addEventListener('click', () => {
    window.location.href = '../../menu/menu.html';
  });

  searchInput.addEventListener('input', (event) => {
    filterEmpresas(event.target.value);
  });

  // Atualiza a lista de empresas ao clicar no botão "Atualizar"
  btnRefresh.addEventListener('click', () => {
    fetchEmpresas();
  });

  document.querySelectorAll('.fa-sort').forEach(icon => {
    icon.addEventListener('click', () => {
      sortEmpresas(icon.getAttribute('data-column'));
    });
  });

  // Fetch empresas from API
  async function fetchEmpresas() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/empresas');
      const result = await response.json();

      if (result.success) {
        empresas = result.data;
        renderTable(empresas);
      } else {
        console.error('Erro ao buscar empresas:', result);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  }

  // Render table with empresas data
  function renderTable(empresas) {
    empresasList.innerHTML = ''; // Clear table before rendering
    empresas.forEach((empresa) => {
      const row = document.createElement('tr');

      row.addEventListener('click', () => {
        window.location.href = `../empresas-edit/empresas-edit.html?id=${empresa.id}&isView=true`;
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

  // Sort empresas by column
  function sortEmpresas(column) {
    sortOrder = (sortColumn === column && sortOrder === 'asc') ? 'desc' : 'asc';
    sortColumn = column;

    empresas.sort((a, b) => {
      if (a[column] < b[column]) return sortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    renderTable(empresas);
    updateSortIcons();
  }

  function updateSortIcons() {
    document.querySelectorAll('th').forEach(th => {
      th.classList.remove('sorted-asc', 'sorted-desc');
    });

    const sortedColumn = document.querySelector(`th[data-column="${sortColumn}"]`);
    if (sortedColumn) {
      sortedColumn.classList.add(sortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');
    }
  }

  // Filter empresas by search term
  function filterEmpresas(searchTerm) {
    const filteredEmpresas = empresas.filter(empresa =>
      empresa.id.toString().includes(searchTerm.toString()) ||
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.endereco.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderTable(filteredEmpresas);
  }

  // Edit empresa
  window.editEmpresa = function (event, id) {
    event.stopPropagation();
    window.location.href = `../empresas-edit/empresas-edit.html?id=${id}`;
  }

  // Delete empresa
  window.deleteEmpresa = async function (event, id) {
    event.stopPropagation();
    const confirmed = confirm('Tem certeza que deseja excluir esta empresa?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/empresas/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        alert('Empresa excluída com sucesso!');
        fetchEmpresas(); // Refresh table
      } else {
        console.error('Erro ao excluir empresa:', result);
      }
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
    }
  }

  // Reset search input and table
  window.resetInput = function () {
    searchInput.value = '';
    fetchEmpresas();
  }

  // Initialize table on page load
  fetchEmpresas();
});
