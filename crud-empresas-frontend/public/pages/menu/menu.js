// Redireciona ao clicar no botão
document.getElementById('btn-empresas').addEventListener('click', () => {
  window.location.href = '../empresas/empresas-list/empresas-list.html';
});

// Redireciona para a página de login
document.getElementById('btn-logout').addEventListener('click', () => {
  window.location.href = '../login/login.html';
});

// Atualiza o dashboard
async function updateDashboard() {
  try {
    // Faz uma chamada para a API
    const response = await fetch('http://127.0.0.1:8000/api/empresas');
    const result = await response.json();

    if (result.success) {
      const empresas = result.data;

      // Atualiza o total de empresas exibido
      document.getElementById('total-empresas').textContent = empresas.length;

      // Configura os dados do gráfico
      const labels = empresas.map(empresa => empresa.nome).reverse(); // Nomes das empresas, da última para a primeira
      const data = empresas.map((_, index) => index + 1).reverse(); // Exemplo de dados incrementais

      // Renderiza o gráfico
      renderVerticalChart(labels, data);
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

// Renderiza o gráfico de barras verticais
function renderVerticalChart(labels, data) {
  const ctx = document.getElementById('empresas-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar', // Tipo do gráfico: Barras verticais
    data: {
      labels: labels, // Nomes das empresas no eixo X
      datasets: [{
        label: 'Empresas Registradas',
        data: data, // Dados no eixo Y
        backgroundColor: labels.map((_, index) => `rgba(${index * 40}, ${200 - index * 20}, ${150 + index * 10}, 0.7)`), // Cores dinâmicas
        borderColor: labels.map((_, index) => `rgba(${index * 40}, ${200 - index * 20}, ${150 + index * 10}, 1)`), // Cor das bordas
        borderWidth: 1, // Largura da borda
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true, // Exibe a legenda
          position: 'top'
        },
        title: {
          display: true,
          text: 'Empresas Cadastradas (Última para a Primeira)'
        }
      },
      scales: {
        x: {
          grid: {
            display: true, // Linhas internas no eixo X
            color: 'rgba(200, 200, 200, 0.3)' // Cor das linhas
          }
        },
        y: {
          beginAtZero: true, // Eixo Y começa no zero
          grid: {
            display: true, // Linhas internas no eixo Y
            color: 'rgba(200, 200, 200, 0.3)' // Cor das linhas
          }
        }
      }
    }
  });
}

// Inicializa o dashboard
updateDashboard();