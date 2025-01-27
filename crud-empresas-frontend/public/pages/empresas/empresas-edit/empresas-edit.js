document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const isView = params.get('isView') === 'true';

    const elements = {
        form: document.getElementById('editForm'),
        nome: document.getElementById('nome'),
        email: document.getElementById('email'),
        endereco: document.getElementById('endereco'),
        telefone: document.getElementById('telefone'),
        site: document.getElementById('site'),
        btnSave: document.getElementById('btn-save'),
        btnBack: document.getElementById('btn-back'),
        formTitle: document.getElementById('form-title')
    };

    const setViewMode = (isView) => {
        if (elements.formTitle) elements.formTitle.textContent = isView ? 'Visualização de Empresa' : (id ? 'Edição de Empresa' : 'Cadastrar Empresa');
        if (elements.btnSave) elements.btnSave.style.display = isView ? 'none' : 'block';
        Object.values(elements).forEach(el => {
            if (el && el.tagName === 'INPUT') el.disabled = isView;
        });
    };

    const loadEmpresaData = async () => {
        if (!id) return;

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/empresas/empresas-edit/empresas-edit.html/${id}`);
            const empresa = response.data.data;

            if (response.data.success) {
                Object.keys(elements).forEach(key => {
                    if (elements[key] && empresa[key]) elements[key].value = empresa[key];
                });
            } else {
                alert('Erro ao carregar os dados da empresa.');
            }
        } catch (error) {
            console.error('Erro ao carregar os dados da empresa:', error);
        }
    };

    const saveEmpresaData = async (event) => {
        event.preventDefault();

        const empresaData = {
            nome: elements.nome.value,
            email: elements.email.value,
            endereco: elements.endereco.value,
            telefone: elements.telefone.value,
            site: elements.site.value
        };

        try {
            let response;
            if (id) {
                response = await axios.put(`http://127.0.0.1:8000/api/empresas/${id}`, empresaData);
            } else {
                response = await axios.post('http://127.0.0.1:8000/api/empresas', empresaData);
            }

            if (response.data.success) {
                alert(`Empresa ${id ? 'atualizada' : 'cadastrada'} com sucesso!`);
                window.location.href = '../empresas-list/empresas-list.html';
            } else {
                alert('Erro ao salvar a empresa.');
            }
        } catch (error) {
            console.error('Erro ao salvar a empresa:', error);
            alert('Erro ao salvar a empresa.');
        }
    };

    if (elements.form) elements.form.addEventListener('submit', saveEmpresaData);
    if (elements.btnBack) elements.btnBack.addEventListener('click', () => window.location.href = '../empresas-list/empresas-list.html');

    setViewMode(isView);
    loadEmpresaData();
});
