document.addEventListener("DOMContentLoaded", () => {
  buscarAlunos();

  document.getElementById("formCadastro").addEventListener("submit", cadastrar);
});

function buscarAlunos() {
  fetch("http://localhost:8080/api/alunos")
    .then((response) => response.json())
    .then((data) => {
      atualizarTabela(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar alunos:", error);
    });
}

function atualizarTabela(alunos) {
  const tabela = document.getElementById("tabelaCorpo");
  tabela.innerHTML = "";

  alunos.forEach((aluno) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-4 py-2">${aluno.id}</td>
      <td class="px-4 py-2">${aluno.nome}</td>
      <td class="px-4 py-2">${aluno.email}</td>
      <td class="px-4 py-2">
        <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="remover(${aluno.id}, this)">Remover</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

function cadastrar(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || !email) {
    Swal.fire("Erro", "Preencha todos os campos.", "error");
    return;
  }

  const aluno = { nome, email };

  fetch("http://localhost:8080/api/alunos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aluno),
  })
    .then((response) => response.json())
    .then((data) => {
      buscarAlunos(); // atualiza a lista
      document.getElementById("formCadastro").reset();
      Swal.fire("Sucesso", "Aluno cadastrado!", "success");
    })
    .catch((error) => {
      console.error("Erro ao cadastrar aluno:", error);
      Swal.fire("Erro", "Não foi possível cadastrar.", "error");
    });
}

function remover(id, botao) {
  Swal.fire({
    title: "Tem certeza?",
    text: "Essa ação não pode ser desfeita!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, remover!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/alunos/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          const linha = botao.closest("tr");
          linha.remove();
          Swal.fire("Removido!", "Aluno excluído com sucesso.", "success");
        })
        .catch((error) => {
          console.error("Erro ao remover aluno:", error);
          Swal.fire("Erro", "Falha ao remover aluno.", "error");
        });
    }
  });
}
