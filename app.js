const PROFISSIONAIS = [
  {
    id: 1,
    nome: "Carlos Eduardo",
    categoria: "Elétrica",
    bairro: "Centro e Região",
    resumo: "Instalação de chuveiros, tomadas, disjuntores e reparos elétricos residenciais.",
    valorBase: "A partir de R$ 70",
    disponibilidade: "Seg a Sáb • 08h às 18h",
    servicos: [
      "Troca de resistência e chuveiro",
      "Instalação de tomadas e luminárias",
      "Revisão de quadro de disjuntores"
    ],
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
    servicos: [
      "Limpeza residencial completa",
      "Limpeza de apartamentos pequenos",
      "Organização de cozinha e guarda-roupas"
    ],
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
    servicos: [
      "Reparo de vazamentos em pias e canos",
      "Troca de registros e torneiras",
      "Limpeza de caixa d'água"
    ],
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
    servicos: [
      "Transporte de geladeira, fogão e sofá",
      "Pequenas mudanças residenciais",
      "Retirada de compras em lojas"
    ],
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
    servicos: [
      "Montagem e desmontagem de móveis",
      "Instalação de suporte de TV e prateleiras",
      "Troca de fechaduras simples"
    ],
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
    servicos: [
      "Instalação de ventilador de teto",
      "Identificação de curto-circuito",
      "Passagem de cabos e pontos extras"
    ],
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

const usuarioSalvo = sessionStorage.getItem("conectabico_user");

const state = {
  usuario: usuarioSalvo || null,
  tela: usuarioSalvo ? "home" : "login", // 'login' | 'home' | 'lista' | 'perfil'
  categoriaSelecionada: "Todas",
  busca: "",
  profissionalSelecionado: null
};

const app = document.getElementById("app");
const btnLogout = document.getElementById("btn-logout");

btnLogout.addEventListener("click", () => {
  sessionStorage.removeItem("conectabico_user");
  state.usuario = null;
  state.busca = "";
  state.categoriaSelecionada = "Todas";
  state.profissionalSelecionado = null;
  state.tela = "login";
  render();
});

function iniciais(nome) {
  return nome.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function entrarNoApp(nomeUsuario) {
  const nomeLimpo = nomeUsuario.trim();
  state.usuario = nomeLimpo;
  sessionStorage.setItem("conectabico_user", nomeLimpo);
  state.tela = "home";
  render();
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

function mostrarToast(texto) {
  const toast = document.getElementById("wa-toast");
  if (!toast) return;
  toast.style.display = "block";
  toast.textContent = texto;
}

function abrirWhatsApp(pro) {
  const mensagem = encodeURIComponent(
    `Olá ${pro.nome}! Encontrei seu perfil no ConectaBico na categoria ${pro.categoria} e gostaria de pedir um orçamento.`
  );
  const url = `https://wa.me/${pro.whatsapp}?text=${mensagem}`;
  mostrarToast(`Redirecionando para o WhatsApp de ${pro.nome}...`);
  window.open(url, "_blank");
}

function copiarTelefone(pro) {
  const formatado = pro.whatsapp.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  if (navigator.clipboard) {
    navigator.clipboard.writeText(formatado);
  }
  mostrarToast(`Número ${formatado} copiado para a área de transferência!`);
}

function renderLogin() {
  btnLogout.style.display = "none";

  app.innerHTML = `
    <div class="glass-card login-box">
      <div class="login-header">
        <div class="login-logo">🤝</div>
        <h2 style="font-size: 1.3rem; margin-bottom: 6px;">Bem-vindo ao ConectaBico</h2>
        <p class="subtitle" style="margin-bottom: 0;">Acesso simples para conectar você a autônomos da sua região.</p>
      </div>

      <form id="login-form" novalidate>
        <div class="field-group">
          <label class="field-label" for="login-nome">Seu nome ou e-mail</label>
          <input
            type="text"
            id="login-nome"
            class="glass-input"
            placeholder="Ex: João Silva ou joao@email.com"
            autocomplete="off"
          />
        </div>

        <div class="field-group">
          <label class="field-label" for="login-senha">Senha</label>
          <div class="pass-wrapper">
            <input
              type="password"
              id="login-senha"
              class="glass-input"
              placeholder="Digite sua senha"
            />
            <button type="button" class="btn-toggle-pass" id="toggle-pass" title="Mostrar ou ocultar senha">👁️</button>
          </div>
        </div>

        <div class="error-msg" id="login-error"></div>

        <button type="submit" class="btn-primary">Entrar no catálogo</button>
      </form>

      <button type="button" class="btn-secondary" id="btn-demo-login">
        Entrar rápido (Modo Teste MVP)
      </button>
    </div>
  `;

  const inputNome = document.getElementById("login-nome");
  const inputSenha = document.getElementById("login-senha");
  const errorBox = document.getElementById("login-error");
  const togglePass = document.getElementById("toggle-pass");

  togglePass.addEventListener("click", () => {
    const isPassword = inputSenha.type === "password";
    inputSenha.type = isPassword ? "text" : "password";
    togglePass.textContent = isPassword ? "🙈" : "👁️";
  });

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const valorNome = inputNome.value.trim();
    const valorSenha = inputSenha.value.trim();

    if (!valorNome || !valorSenha) {
      errorBox.style.display = "block";
      errorBox.textContent = "Preencha nome/e-mail e senha para entrar ou use o acesso rápido abaixo.";
      return;
    }

    const primeiroNome = valorNome.includes("@") ? valorNome.split("@")[0] : valorNome.split(" ")[0];
    entrarNoApp(primeiroNome);
  });

  document.getElementById("btn-demo-login").addEventListener("click", () => {
    entrarNoApp("Visitante");
  });
}

function renderHome() {
  btnLogout.style.display = "inline-block";

  app.innerHTML = `
    <div class="greeting">Olá, ${state.usuario}!</div>
    <p class="subtitle">Encontre trabalhadores autônomos da sua região e fale direto pelo WhatsApp, sem intermediários.</p>

    <div class="search-wrapper">
      <input
        type="text"
        class="glass-input"
        id="home-search"
        placeholder="Ex: eletricista, frete, limpeza..."
      />
      <button class="btn-icon" id="btn-home-search" title="Buscar">🔍</button>
    </div>

    <div class="section-title">Categorias de serviço</div>
    <div class="category-grid">
      ${CATEGORIAS.map(cat => `
        <button class="cat-card" data-cat="${cat.nome}">
          <span class="cat-icon">${cat.icone}</span>
          <span class="cat-name">${cat.nome}</span>
        </button>
      `).join("")}
    </div>

    <button class="btn-primary" id="btn-ver-todos">Ver todos os profissionais</button>
  `;

  const searchInput = document.getElementById("home-search");
  const execSearch = () => irParaLista("Todas", searchInput.value);

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") execSearch();
  });

  document.getElementById("btn-home-search").addEventListener("click", execSearch);

  document.querySelectorAll(".cat-card").forEach(btn => {
    btn.addEventListener("click", () => irParaLista(btn.dataset.cat));
  });

  document.getElementById("btn-ver-todos").addEventListener("click", () => irParaLista("Todas"));
}

function renderLista() {
  btnLogout.style.display = "inline-block";

  const filtrados = PROFISSIONAIS.filter(p => {
    const matchCat = state.categoriaSelecionada === "Todas" || p.categoria === state.categoriaSelecionada;
    const termo = state.busca.toLowerCase().trim();
    const matchBusca = !termo ||
      p.nome.toLowerCase().includes(termo) ||
      p.categoria.toLowerCase().includes(termo) ||
      p.resumo.toLowerCase().includes(termo) ||
      p.bairro.toLowerCase().includes(termo);
    return matchCat && matchBusca;
  });

  app.innerHTML = `
    <button class="btn-back" id="btn-back-home">← Início</button>

    <div class="search-wrapper">
      <input
        type="text"
        class="glass-input"
        id="list-search"
        placeholder="Filtrar por nome, serviço ou bairro..."
      />
      ${state.busca ? `<button class="btn-icon" id="btn-clear-search" title="Limpar busca">✕</button>` : ""}
    </div>

    <div class="pills">
      ${["Todas", "Elétrica", "Hidráulica", "Limpeza", "Frete", "Reparos"].map(cat => `
        <button
          class="pill ${state.categoriaSelecionada === cat ? "active" : ""}"
          data-pill="${cat}"
        >${cat}</button>
      `).join("")}
    </div>

    <div class="section-title">${filtrados.length} profissional(is) encontrado(s)</div>

    ${filtrados.length === 0
      ? `<div class="glass-card" style="padding: 18px; text-align: center;">
           <p class="subtitle" style="margin-bottom: 12px;">Nenhum profissional encontrado para essa busca.</p>
           <button class="btn-secondary" id="btn-reset-filtros" style="margin-top: 0;">Limpar filtros</button>
         </div>`
      : filtrados.map(p => `
        <div class="pro-card" data-id="${p.id}">
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

  document.getElementById("btn-back-home").addEventListener("click", voltarHome);

  const input = document.getElementById("list-search");
  input.value = state.busca;
  input.addEventListener("input", (e) => {
    state.busca = e.target.value;
    renderLista();
    const newInput = document.getElementById("list-search");
    newInput.focus();
    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
  });

  const btnClear = document.getElementById("btn-clear-search");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      state.busca = "";
      renderLista();
    });
  }

  const btnReset = document.getElementById("btn-reset-filtros");
  if (btnReset) {
    btnReset.addEventListener("click", () => irParaLista("Todas", ""));
  }

  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => irParaLista(pill.dataset.pill, state.busca));
  });

  document.querySelectorAll(".pro-card").forEach(card => {
    card.addEventListener("click", () => irParaPerfil(Number(card.dataset.id)));
  });
}

function renderPerfil() {
  btnLogout.style.display = "inline-block";

  const p = state.profissionalSelecionado;
  if (!p) return voltarHome();

  app.innerHTML = `
    <button class="btn-back" id="btn-back-lista">← Voltar para lista</button>

    <div class="glass-card profile-box">
      <span class="tag">${p.categoria}</span>
      <h2 style="font-size: 1.32rem; margin-bottom: 4px;">${p.nome}</h2>
      <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 14px;">Atende em: ${p.bairro}</p>

      <p class="pro-desc" style="margin-bottom: 14px;">${p.resumo}</p>

      <div class="section-title" style="font-size: 0.85rem;">Serviços realizados:</div>
      <ul class="detail-list">
        ${p.servicos.map(s => `<li>${s}</li>`).join("")}
      </ul>

      <div class="info-row"><strong>Valor de referência:</strong> ${p.valorBase}</div>
      <div class="info-row"><strong>Disponibilidade:</strong> ${p.disponibilidade}</div>

      <button class="btn-whatsapp" id="btn-wa">
        Chamar no WhatsApp
      </button>

      <button class="btn-secondary" id="btn-copy-phone">
        Copiar telefone do profissional
      </button>

      <div class="feedback-toast" id="wa-toast"></div>
    </div>
  `;

  document.getElementById("btn-back-lista").addEventListener("click", () => {
    irParaLista(state.categoriaSelecionada, state.busca);
  });

  document.getElementById("btn-wa").addEventListener("click", () => abrirWhatsApp(p));
  document.getElementById("btn-copy-phone").addEventListener("click", () => copiarTelefone(p));
}

function render() {
  if (state.tela === "login") renderLogin();
  else if (state.tela === "home") renderHome();
  else if (state.tela === "lista") renderLista();
  else if (state.tela === "perfil") renderPerfil();
}

render();