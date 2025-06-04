// Função para carregar alunos da API e mostrar na tabela
function carregarAlunos() {
  fetch('http://localhost:8080/api/alunos')
    .then(response => response.json())
    .then(data => addLinhas(data))
    .catch(error => console.error('Erro ao carregar alunos:', error));
}

// Função que adiciona linhas na tabela com os dados da API
function addLinhas(dadosAPI) {
  const tabela = document.getElementById('tabelaCorpo');
  tabela.innerHTML = ''; // Limpa tabela

  dadosAPI.forEach(({ id, nome, email }) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td class="px-4 py-2">${id}</td>
      <td class="px-4 py-2">${nome}</td>
      <td class="px-4 py-2">${email}</td>
      <td class="px-4 py-2">
        <button class="bg-yellow-500 text-white px-2 py-1 rounded" onclick="editar(${id}, '${nome.replace(/'/g, "\\'")}', '${email.replace(/'/g, "\\'")}')">Editar</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="remover(${id})">Remover</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// Função para cadastrar novo aluno (POST)
function cadastrar(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nome || !email) {
    return Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Preencha todos os campos',
    });
  }

  fetch('http://localhost:8080/api/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email }),
  })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao cadastrar');
      return response.json();
    })
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Aluno cadastrado com sucesso!',
      });
      document.getElementById('formCadastro').reset();
      carregarAlunos();
    })
    .catch(error => {
      console.error('Erro ao cadastrar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Falha ao cadastrar aluno',
      });
    });
}

// Função para remover aluno (DELETE)
function remover(id) {
  Swal.fire({
    icon: 'warning',
    title: 'Deseja remover este aluno?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/alunos/${id}`, { method: 'DELETE' })
        .then(() => {
          Swal.fire('Removido!', '', 'success');
          carregarAlunos();
        })
        .catch(error => {
          console.error('Erro ao remover:', error);
          Swal.fire('Erro ao remover aluno', '', 'error');
        });
    }
  });
}

// Função para editar aluno (PUT)
function editar(id, nomeAntigo, emailAntigo) {
  Swal.fire({
    title: 'Editar aluno',
    html: `
      <input id="swal-nome" class="swal2-input" placeholder="Nome" value="${nomeAntigo}" />
      <input id="swal-email" class="swal2-input" placeholder="Email" value="${emailAntigo}" />
    `,
    confirmButtonText: 'Salvar',
    focusConfirm: false,
    preConfirm: () => {
      const nome = document.getElementById('swal-nome').value.trim();
      const email = document.getElementById('swal-email').value.trim();
      if (!nome || !email) {
        Swal.showValidationMessage('Preencha os dois campos');
        return false;
      }
      return { nome, email };
    },
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/alunos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.value),
      })
        .then(() => {
          Swal.fire('Atualizado com sucesso!', '', 'success');
          carregarAlunos();
        })
        .catch(error => {
          console.error('Erro ao editar:', error);
        });
    }
  });
}

// Eventos
document.getElementById('formCadastro').addEventListener('submit', cadastrar);
document.addEventListener('DOMContentLoaded', carregarAlunos);
