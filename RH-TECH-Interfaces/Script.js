async function buscarVinculos() {
  const btnBuscar = document.getElementById("btnBuscar");
  btnBuscar.disabled = true;
  btnBuscar.textContent = "Carregando...";

  const funcionarioId = document.getElementById("funcionarioFiltro").value;
  const cargoId = document.getElementById("cargoFiltro").value;

  let url = `${apiBase}/funcionarios-por-cargo`;
  const params = [];
  if (funcionarioId) params.push(`funcionarioId=${funcionarioId}`);
  if (cargoId) params.push(`cargoId=${cargoId}`);

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  try {
    const res = await fetch(url);
    const vinculos = await res.json();

    const tabela = document.getElementById("tabelaVinculos");
    tabela.innerHTML = "";

    if (vinculos.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5" style="text-align:center;">Nenhum vínculo encontrado</td>`;
      tabela.appendChild(tr);
    } else {
      for (const v of vinculos) {
        const funcionario = await buscarNomeFuncionario(v.funcionarioId);
        const cargo = await buscarNomeCargo(v.cargoId);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${funcionario}</td>
          <td>${cargo}</td>
          <td>${formatarData(v.dataInicio)}</td>
          <td>${formatarData(v.dataFim)}</td>
          <td>${v.detalhes || ''}</td>
        `;
        tabela.appendChild(tr);
      }
    }

  } catch (e) {
    alert("Erro ao buscar vínculos.");
  } finally {
    btnBuscar.disabled = false;
    btnBuscar.textContent = "Buscar";
  }
}

async function init() {
  await Promise.all([carregarFuncionarios(), carregarCargos()]);
  document.getElementById("btnBuscar").disabled = false;
}
document.getElementById("btnBuscar").disabled = true;
init();

vinculos.forEach(vinculo => {
    const tr = document.createElement('tr');

    const tdFuncionario = document.createElement('td');
    tdFuncionario.textContent = vinculo.funcionario.nome;

    const tdCargo = document.createElement('td');
    tdCargo.textContent = vinculo.cargo.nome;

    const tdDataInicio = document.createElement('td');
    tdDataInicio.textContent = vinculo.dataInicio;

    const tdDataFim = document.createElement('td');
    tdDataFim.textContent = vinculo.dataFim || '-';

    const tdDetalhes = document.createElement('td');
    tdDetalhes.textContent = vinculo.detalhes;

    tr.appendChild(tdFuncionario);
    tr.appendChild(tdCargo);
    tr.appendChild(tdDataInicio);
    tr.appendChild(tdDataFim);
    tr.appendChild(tdDetalhes);

    tabela.appendChild(tr);
});

