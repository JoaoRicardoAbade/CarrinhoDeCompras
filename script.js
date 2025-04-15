/* Lista de produtos já cadastrados na loja */
const produtosDisponiveis = [
  { codigo: 'C001', nome: 'Camiseta Branca', valor: 39.90 }, // Produto 1
  { codigo: 'C002', nome: 'Calça Jeans', valor: 129.90 }, // Produto 2
  { codigo: 'C003', nome: 'Jaqueta de Couro', valor: 249.90 }, // Produto 3
  { codigo: 'C004', nome: 'Tênis Esportivo', valor: 199.90 }, // Produto 4
  { codigo: 'C005', nome: 'Boné Estiloso', valor: 59.90 } // Produto 5
];

/* Recupera o carrinho salvo no localStorage ou cria um vazio se não houver nada salvo */
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []; // Recupera ou inicia array vazio

/* Função que preenche o dropdown com os produtos disponíveis */
function preencherSelect() {
  const select = document.getElementById('selecao-produto'); // Seleciona o elemento <select>
  produtosDisponiveis.forEach(prod => { // Itera sobre cada produto disponível
    const option = document.createElement('option'); // Cria elemento <option>
    option.value = prod.codigo; // Define o valor como o código do produto
    option.textContent = `${prod.nome} - R$ ${prod.valor.toFixed(2)}`; // Define o texto do option
    select.appendChild(option); // Adiciona a opção ao <select>
  });
}

/* Função para adicionar um produto ao carrinho pelo dropdown */
function adicionarProduto() {
  const codigoSelecionado = document.getElementById('selecao-produto').value; // Pega o código selecionado
  const quantidade = parseInt(document.getElementById('quantidade').value); // Pega a quantidade digitada

  if (!codigoSelecionado || quantidade <= 0) { // Verifica se a seleção e a quantidade são válidas
    alert('Selecione um produto e informe uma quantidade válida.'); // Mostra alerta em caso de erro
    return; // Sai da função
  }

  const produto = produtosDisponiveis.find(p => p.codigo === codigoSelecionado); // Encontra o produto pelo código

  const itemExistente = carrinho.find(item => item.codigo === produto.codigo); // Verifica se o item já está no carrinho
  if (itemExistente) {
    itemExistente.quantidade += quantidade; // Se existir, apenas incrementa a quantidade
  } else {
    carrinho.push({ ...produto, quantidade }); // Se não existir, adiciona novo item ao carrinho
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva o carrinho no localStorage
  renderizarCarrinho(); // Atualiza a visualização do carrinho
}

/* Função para adicionar um produto diretamente ao carrinho pelos cards */
function comprarDireto(codigo) {
  const produto = produtosDisponiveis.find(p => p.codigo === codigo); // Encontra o produto pelo código
  if (!produto) { // Se não encontrar
    alert('Produto não encontrado.'); // Mostra erro
    return; // Sai da função
  }

  const itemExistente = carrinho.find(item => item.codigo === codigo); // Verifica se já está no carrinho
  if (itemExistente) {
    itemExistente.quantidade += 1; // Se sim, aumenta a quantidade
  } else {
    carrinho.push({ ...produto, quantidade: 1 }); // Se não, adiciona com quantidade 1
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
  renderizarCarrinho(); // Reexibe o carrinho
}

/* Função para remover um produto do carrinho */
function removerProduto(codigo) {
  carrinho = carrinho.filter(item => item.codigo !== codigo); // Remove o item com o código correspondente
  localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
  renderizarCarrinho(); // Atualiza o carrinho na tela
}

/* Função para limpar todo o carrinho */
function limparCarrinho() {
  if (confirm('Tem certeza que deseja limpar o carrinho?')) { // Pergunta ao usuário antes de limpar
    carrinho = []; // Limpa o array do carrinho
    localStorage.removeItem('carrinho'); // Remove o item do localStorage
    renderizarCarrinho(); // Atualiza a visualização
  }
}

/* Função que renderiza o conteúdo do carrinho na tabela */
function renderizarCarrinho() {
  const tbody = document.querySelector('#tabela-carrinho tbody'); // Seleciona o corpo da tabela
  tbody.innerHTML = ''; // Limpa o conteúdo atual da tabela
  let totalGeral = 0; // Inicializa o total geral

  carrinho.forEach(produto => { // Para cada item no carrinho
    const total = produto.quantidade * produto.valor; // Calcula o total do item
    totalGeral += total; // Adiciona ao total geral
    const row = `<tr>
      <td>${produto.codigo}</td>
      <td>${produto.nome}</td>
      <td>${produto.quantidade}</td>
      <td>R$ ${produto.valor.toFixed(2)}</td>
      <td>R$ ${total.toFixed(2)}</td>
      <td><button class="remover" onclick="removerProduto('${produto.codigo}')">Remover</button></td>
    </tr>`; // Monta a linha da tabela
    tbody.innerHTML += row; // Adiciona a linha à tabela
  });

  document.getElementById('total-geral').innerText = `Total da Compra: R$ ${totalGeral.toFixed(2)}`; // Exibe o total geral
}

/* Função para finalizar a compra */
function finalizarCompra() {
  if (carrinho.length === 0) { // Verifica se o carrinho está vazio
    alert('O carrinho está vazio!'); // Alerta o usuário
    return; // Sai da função
  }

  const audio = document.getElementById('som-finalizacao'); // Seleciona o áudio da finalização
  if (audio) audio.play(); // Toca o som se existir

  alert('Compra finalizada com sucesso! Obrigado pela preferência.'); // Mostra confirmação
  limparCarrinho(); // Limpa o carrinho após finalização
}

/* Reproduz a música de fundo ao primeiro clique do usuário */
window.addEventListener('click', function tocarMusica() {
  const musica = document.getElementById('musica-fundo'); // Seleciona o áudio de fundo
  if (musica) {
    musica.play().catch(() => {
      console.log("Não foi possível iniciar o áudio automaticamente."); // Trata erro de autoplay
    });
  }
  window.removeEventListener('click', tocarMusica); // Remove o ouvinte após primeira execução
});

/* Alerta o usuário ao tentar sair do site */
window.addEventListener('beforeunload', function (e) {
  e.preventDefault(); // Previne o comportamento padrão
  e.returnValue = ''; // Mensagem padrão para navegadores modernos
});

/* Executa ao carregar a página */
preencherSelect(); // Preenche a lista de seleção de produtos
renderizarCarrinho(); // Mostra os produtos no carrinho
