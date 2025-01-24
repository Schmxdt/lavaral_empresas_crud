// Captura o formulário de login
const loginForm = document.getElementById('login-form');

// Adiciona o evento de submit ao formulário
loginForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Evita o comportamento padrão do formulário

  // Obtém os valores dos campos de entrada
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Simula validação do login
  if (email === 'admin@example.com' && password === 'password') {
    alert('Login bem-sucedido! Redirecionando para o menu...');
    window.location.href = '../menu/menu.html'; // Redireciona para a página do menu
  } else {
    alert('Email ou senha inválidos! Tente novamente.');
  }
});
