const PROFISSIONAIS = [
  {
    id: 1,
    nome: "Carlos Eduardo",
    categoria: "Elétrica",
    bairro: "Centro e Região",
    resumo: "Instalação de chuveiros, tomadas, disjuntores e reparos elétricos residenciais.",
    valorBase: "A partir de R$ 70",
    disponibilidade: "Seg a Sáb • 08h às 18h",
    servicos: ["Troca de resistência e chuveiro", "Instalação de tomadas e luminárias", "Revisão de quadro de disjuntores"],
    whatsapp: "5585999990001"
  },
  {
    id: 2,
    nome: "Mariana Silva",
    categoria: "Limpeza",
    bairro: "Zona Norte e Centro",
    resumo: "Diarista para limpeza residencial, pós-obra leve e organização de ambientes.",
    valorBase: "Diária R$ 130",
    disponibilidade: "Seg a Sex • 07h às 16h",
    servicos: ["Limpeza residencial completa", "Limpeza de apartamentos pequenos", "Organização de cozinha e guarda-roupas"],
    whatsapp: "5585999990002"
  },
  {
    id: 3,
    nome: "João Batista",
    categoria: "Hidráulica",
    bairro: "Toda a cidade",
    resumo: "Conserto de vazamentos, troca de torneiras, sifões e limpeza de caixa d'água.",
    valorBase: "A partir de R$ 60",
    disponibilidade: "Todos os dias • Urgências",
    servicos: ["Reparo de vazamentos em pias e canos", "Troca de registros e torneiras", "Limpeza de caixa d'água"],
    whatsapp: "5585999990003"
  },
  {
    id: 4,
    nome: "Roberto Alves",
    categoria: "Frete",
    bairro: "Bairros locais e região",
    resumo: "Pequenos fretes, carretos e transporte de móveis ou eletrodomésticos em utilitário.",
    valorBase: "A partir de R$ 80",
    disponibilidade: "Seg a Dom • 07h às 20h",
    servicos: ["Transporte de geladeira, fogão e sofá", "Pequenas mudanças residenciais", "Retirada de compras em lojas"],
    whatsapp: "5585999990004"
  },
  {
    id: 5,
    nome: "Fernanda Costa",
    categoria: "Reparos",
    bairro: "Zona Sul e Centro",
    resumo: "Montagem de móveis, instalação de suportes de TV, cortinas e pequenos ajustes.",
    valorBase: "A partir de R$ 50",
    disponibilidade: "Ter a Sáb • 09h às 18h",
    servicos: ["Montagem e desmontagem de móveis", "Instalação de suporte de TV e prateleiras", "Troca de fechaduras simples"],
    whatsapp: "5585999990005"
  },
  {
    id: 6,
    nome: "Antônio Souza",
    categoria: "Elétrica",
    bairro: "Zona Oeste",
    resumo: "Manutenção elétrica residencial, ventiladores de teto e fiação.",
    valorBase: "A partir de R$ 65",
    disponibilidade: "Seg a Sáb • 08h às 17h",
    servicos: ["Instalação de ventilador de teto", "Identificação de curto-circuito", "Passagem de cabos e pontos extras"],
    whatsapp: "5585999990006"
  }
];

const CATEGORIAS = [
  { nome: "Elétrica", icone: "⚡" },
  { nome: "Hidráulica", icone: "🚰" },
  { nome: "Limpeza", icone: "🧹" },
  { nome: "Frete", icone: "🚚" },
  { nome: "Reparos", icone: "🛠️" },
  { nome: "Todas", icone: "📋" }
];

const state = {
  tela: "home", // 'home' | 'lista' | 'perfil'
  categoriaSelecionada: "Todas",
  busca: "",
  profissionalSelecionado: null
};

const app = document.getElementById("app");

function iniciais(nome) {
  return nome.split(" ").map(p => p[0]).slice(0, 2).join("");
}

function irParaLista(categoria = "Todas", busca = "") {
  state.tela = "lista";
  state.categoriaSelecionada = categoria;
  state.busca = busca;
  render();
}

function irParaPerfil(id) {
  state.profissionalSelecionado = PROFISSIONAIS.find(p => p.id === id);
  state.tela = "perfil";
  render();
}

function voltarHome() {
  state.tela = "home";
  state.busca = "";
  render();
}

function abrirWhatsApp(pro) {
  const mensagem = encodeURIComponent(
    `Olá ${pro.nome}! Encontrei seu perfil no ConectaBico na categoria ${pro.categoria} e gostaria de pedir um orçamento.`
  );
  const url = `https://wa.me/${pro.whatsapp}?text=${mensagem}`;
  
  const toast = document.getElementById("wa-toast");
  if (toast) {
    toast.style.display = "block";
    toast.textContent = `Redirecionando para o WhatsApp de ${pro.nome}...`;
  }
  window.open(url, "_blank");
}

function renderHome() {
  app.innerHTML = `
    <p class="subtitle">Encontre trabalhadores autônomos da sua região e fale direto pelo WhatsApp, sem intermediários.</p>
    <input
      type="text"
      class="search-box"
      id="home-search"
      placeholder="Ex: eletricista, frete, limpeza..."
    />
    <div class="section-title">Categorias de serviço</div>
    <div class="category-grid">
      ${CATEGORIAS.map(cat => `
        <button class="cat-card" onclick="irParaLista('${cat.nome}')">
          <span class="cat-icon">${cat.icone}</span>
          <span class="cat-name">${cat.nome}</span>
        </button>
      `).join("")}
    </div>
    <button class="btn-primary" onclick="irParaLista('Todas')">Ver todos os profissionais</button>
  `;

  document.getElementById("home-search").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      irParaLista("Todas", e.target.value);
    }
  });
}

function renderLista() {
  const filtrados = PROFISSIONAIS.filter(p => {
    const matchCat = state.categoriaSelecionada === "Todas" || p.categoria === state.categoriaSelecionada;
    const termo = state.busca.toLowerCase().trim();
    const matchBusca = !termo ||
      p.nome.toLowerCase().includes(termo) ||
      p.categoria.toLowerCase().includes(termo) ||
      p.resumo.toLowerCase().includes(termo);
    return matchCat && matchBusca;
  });

  app.innerHTML = `
    <button class="btn-back" onclick="voltarHome()">← Início</button>
    <input
      type="text"
      class="search-box"
      id="list-search"
      value="${state.busca}"
      placeholder="Filtrar por nome ou serviço..."
    />
    <div class="pills">
      ${["Todas", "Elétrica", "Hidráulica", "Limpeza", "Frete", "Reparos"].map(cat => `
        <button
          class="pill ${state.categoriaSelecionada === cat ? "active" : ""}"
          onclick="irParaLista('${cat}', document.getElementById('list-search').value)"
        >${cat}</button>
      `).join("")}
    </div>
    <div class="section-title">${filtrados.length} profissional(is) encontrado(s)</div>
    ${filtrados.length === 0
      ? `<p class="subtitle">Nenhum profissional encontrado para essa busca.</p>`
      : filtrados.map(p => `
        <div class="pro-card" onclick="irParaPerfil(${p.id})">
          <div class="avatar">${iniciais(p.nome)}</div>
          <div class="pro-info">
            <div class="pro-name">${p.nome}</div>
            <div class="pro-meta">${p.categoria} • ${p.bairro}</div>
            <div class="pro-desc">${p.resumo}</div>
            <div class="pro-price">${p.valorBase} • Ver perfil →</div>
          </div>
        </div>
      `).join("")
    }
  `;

  const input = document.getElementById("list-search");
  input.addEventListener("input", (e) => {
    state.busca = e.target.value;
    renderLista();
    const newInput = document.getElementById("list-search");
    newInput.focus();
    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
  });
}

function renderPerfil() {
  const p = state.profissionalSelecionado;
  if (!p) return voltarHome();

  app.innerHTML = `
    <button class="btn-back" onclick="irParaLista('${state.categoriaSelecionada}', '${state.busca}')">← Voltar para lista</button>
    <div class="profile-box">
      <span class="tag">${p.categoria}</span>
      <h2 style="font-size:1.3rem; color:#0f172a; margin-bottom:4px;">${p.nome}</h2>
      <p style="font-size:0.85rem; color:#64748b; margin-bottom:14px;">Atende em: ${p.bairro}</p>
      
      <p class="pro-desc" style="margin-bottom:14px;">${p.resumo}</p>

      <div class="section-title" style="font-size:0.85rem;">Serviços realizados:</div>
      <ul class="detail-list">
        ${p.servicos.map(s => `<li>${s}</li>`).join("")}
      </ul>

      <div class="info-row"><strong>Valor de referência:</strong> ${p.valorBase}</div>
      <div class="info-row"><strong>Disponibilidade:</strong> ${p.disponibilidade}</div>

      <button class="btn-whatsapp" id="btn-wa">
        Chamar no WhatsApp
      </button>
      <div class="feedback-toast" id="wa-toast"></div>
    </div>
  `;

  document.getElementById("btn-wa").addEventListener("click", () => abrirWhatsApp(p));
}

function render() {
  if (state.tela === "home") renderHome();
  else if (state.tela === "lista") renderLista();
  else if (state.tela === "perfil") renderPerfil();
}

render();