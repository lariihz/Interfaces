document.addEventListener("DOMContentLoaded", () => {
  const cepInput = document.getElementById("cep");
  const erro = document.getElementById("erro");

  if (cepInput) {
    cepInput.addEventListener("blur", () => {
      const cep = cepInput.value.replace(/\D/g, "");

      if (cep.length !== 8) {
        erro.textContent = "CEP inválido! Deve conter 8 dígitos.";
        limparCampos();
        return;
      }

      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (data.erro) {
            erro.textContent = "CEP não encontrado!";
            limparCampos();
          } else {
            erro.textContent = "";
            document.getElementById("endereco").value = data.logradouro;
            document.getElementById("bairro").value = data.bairro;
            document.getElementById("cidade").value = data.localidade;
            document.getElementById("estado").value = data.uf;
          }
        })
        .catch(() => {
          erro.textContent = "Erro ao buscar o CEP.";
          limparCampos();
        });
    });
  }

  function limparCampos() {
    document.getElementById("endereco").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("estado").value = "";
  }
});
