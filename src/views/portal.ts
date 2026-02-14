/**
 * Template do Portal Dinâmico
 */

interface PortalOpcao {
  id: string
  nome: string
  descricao: string
  link: string
  nivel_minimo: number
  nivel_minimo_label: string
  icone: string
  status: string
  setor?: string
}

interface Setor {
  id: number
  nome: string
  status: string
}

interface User {
  id: string
  email: string
  nome: string
  cargo_solicitado: string
  status: string
  data_cadastro: string
  nivel: string
  avatar_url: string
}

export function renderPortal(user: User, opcoes: PortalOpcao[], setores: Setor[], setorAtual: string) {
  const nivelUsuario = parseInt(user.nivel || '0')
  const isAdmin = nivelUsuario >= 10
  
  // Gerar HTML dos cards dinamicamente
  const cardsHTML = opcoes.map(opcao => {
    const cores = getCoresIcone(opcao.nivel_minimo)
    const isAdminCard = opcao.nivel_minimo >= 10
    
    return `
      <a href="${opcao.link}" target="_blank" class="opcao-card block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer ${isAdminCard ? 'border-2 border-purple-300' : ''}" data-nome="${opcao.nome.toLowerCase()}" data-descricao="${opcao.descricao.toLowerCase()}">
          <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 ${cores.bg} rounded-full flex items-center justify-center">
                  <i class="fas ${opcao.icone} ${cores.text} text-xl"></i>
              </div>
              <div>
                  <h3 class="font-bold text-gray-800">${opcao.nome}</h3>
                  <span class="text-xs ${isAdminCard ? 'text-purple-600 font-semibold' : 'text-gray-500'}">
                      ${isAdminCard ? 'Admin' : `Nível ${opcao.nivel_minimo}+`}
                  </span>
              </div>
          </div>
          <p class="text-sm text-gray-600">${opcao.descricao}</p>
      </a>
    `
  }).join('')
  
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portal - ${user.nome}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            .opcao-card {
                transform: translateY(0);
                transition: all 0.3s ease;
            }
            .opcao-card:hover {
                transform: translateY(-5px);
            }
            .hidden-card {
                display: none !important;
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 shadow-lg">
            <div class="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/3840px-Shopee.svg.png" 
                        alt="Shopee Logo" 
                        class="h-10"
                    />
                    <div>
                        <h1 class="text-2xl font-bold">Portal Shopee</h1>
                        <p class="text-sm opacity-90">Sistema de Controle de Acesso</p>
                    </div>
                </div>
                
                <div class="text-right">
                    ${user.avatar_url ? `<img src="${user.avatar_url}" alt="Avatar" class="w-10 h-10 rounded-full inline-block mb-1" />` : ''}
                    <p class="font-semibold">${user.nome}</p>
                    <p class="text-sm opacity-90">${user.cargo_solicitado || 'Usuário'} | Nível ${user.nivel || '0'}</p>
                    <a href="/" class="text-xs underline hover:text-gray-200 mt-1 inline-block">
                        <i class="fas fa-sign-out-alt mr-1"></i>
                        Sair
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Conteúdo Principal -->
        <div class="max-w-7xl mx-auto p-6">
            ${nivelUsuario === 0 ? `
            <!-- Aviso Nível 0 -->
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div class="flex items-center gap-3">
                    <i class="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
                    <div>
                        <p class="font-semibold text-yellow-800">Acesso Básico (Nível 0)</p>
                        <p class="text-sm text-yellow-700">Funcionalidades disponíveis apenas com nível adequado</p>
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${isAdmin ? `
            <!-- Banner Admin -->
            <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg mb-6 shadow-lg">
                <div class="flex items-center gap-4">
                    <i class="fas fa-crown text-yellow-300 text-4xl"></i>
                    <div>
                        <h2 class="text-2xl font-bold">Painel Administrativo</h2>
                        <p class="text-sm opacity-90">Você tem acesso completo ao sistema</p>
                    </div>
                </div>
                <div class="mt-4 flex gap-3">
                    <a href="/admin/users?email=${encodeURIComponent(user.email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold inline-flex items-center gap-2">
                        <i class="fas fa-users"></i>
                        Gerenciar Usuários
                    </a>
                    <a href="/admin/config?email=${encodeURIComponent(user.email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold inline-flex items-center gap-2">
                        <i class="fas fa-cog"></i>
                        Configurações
                    </a>
                    <a href="/admin/opcoes?email=${encodeURIComponent(user.email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold inline-flex items-center gap-2">
                        <i class="fas fa-link"></i>
                        Gerenciar Links
                    </a>
                </div>
            </div>
            ` : ''}
            
            <!-- Título e Barra de Pesquisa + Filtro de Setor -->
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">
                    Bem-vindo(a), ${user.nome}! 👋
                </h2>
                <p class="text-gray-600 mb-4">
                    Aqui estão as opções disponíveis para seu nível de acesso.
                </p>
                
                <!-- Barra de Pesquisa + Dropdown Setor -->
                <div class="flex gap-3">
                    <!-- Barra de Pesquisa -->
                    <div class="relative flex-1">
                        <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            id="searchInput" 
                            placeholder="🔍 Pesquisar opções..." 
                            class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    
                    <!-- Dropdown Filtro de Setor -->
                    <div class="relative" style="min-width: 200px;">
                        <select 
                            id="setorFilter" 
                            onchange="window.location.href='/portal?email=${encodeURIComponent(user.email)}&setor=' + this.value"
                            class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white cursor-pointer font-semibold"
                        >
                            <option value="TODOS" ${setorAtual === 'TODOS' ? 'selected' : ''}>📂 Todos os Setores</option>
                            ${setores.map(setor => `
                            <option value="${encodeURIComponent(setor.nome)}" ${setorAtual === setor.nome ? 'selected' : ''}>
                                ${setor.nome}
                            </option>
                            `).join('')}
                        </select>
                        <i class="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>
                
                <p id="resultCount" class="text-sm text-gray-500 mt-2">
                    Mostrando <span id="countNumber">${opcoes.length}</span> opções disponíveis
                    ${setorAtual !== 'TODOS' ? `<span class="font-semibold text-orange-600"> • Setor: ${setorAtual}</span>` : ''}
                </p>
            </div>
            
            <!-- Grade de Opções -->
            <div id="opcoesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                ${cardsHTML}
            </div>
            
            <!-- Mensagem quando não há resultados -->
            <div id="noResults" class="hidden text-center py-12">
                <i class="fas fa-search text-gray-300 text-6xl mb-4"></i>
                <p class="text-gray-500 text-lg">Nenhuma opção encontrada</p>
                <p class="text-gray-400 text-sm">Tente usar outros termos de pesquisa</p>
            </div>
            
            <!-- Info do Usuário -->
            <div class="bg-white rounded-lg shadow-md p-6 mt-6">
                <div class="flex items-center gap-3 mb-3">
                    <i class="fas fa-info-circle text-blue-500 text-xl"></i>
                    <h3 class="font-bold text-gray-800">Suas Informações</h3>
                </div>
                <ul class="text-sm text-gray-600 space-y-2">
                    <li><strong>Email:</strong> ${user.email}</li>
                    <li><strong>Cargo:</strong> ${user.cargo_solicitado || 'Não informado'}</li>
                    <li><strong>Nível de Acesso:</strong> ${user.nivel || '0'} (${getNivelLabel(nivelUsuario)})</li>
                    <li><strong>Status:</strong> <span class="text-green-600 font-semibold">APROVADO ✓</span></li>
                </ul>
            </div>
        </div>
        
        <!-- JavaScript para Barra de Pesquisa -->
        <script>
            const searchInput = document.getElementById('searchInput');
            const cards = document.querySelectorAll('.opcao-card');
            const noResults = document.getElementById('noResults');
            const countNumber = document.getElementById('countNumber');
            const opcoesGrid = document.getElementById('opcoesGrid');
            
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                let visibleCount = 0;
                
                cards.forEach(card => {
                    const nome = card.dataset.nome;
                    const descricao = card.dataset.descricao;
                    
                    if (nome.includes(searchTerm) || descricao.includes(searchTerm)) {
                        card.classList.remove('hidden-card');
                        visibleCount++;
                    } else {
                        card.classList.add('hidden-card');
                    }
                });
                
                // Atualizar contador
                countNumber.textContent = visibleCount;
                
                // Mostrar/ocultar mensagem de "nenhum resultado"
                if (visibleCount === 0) {
                    opcoesGrid.classList.add('hidden');
                    noResults.classList.remove('hidden');
                } else {
                    opcoesGrid.classList.remove('hidden');
                    noResults.classList.add('hidden');
                }
            });
        </script>
    </body>
    </html>
  `
}

function getCoresIcone(nivel: number) {
  if (nivel >= 10) {
    return { bg: 'bg-purple-600', text: 'text-white' }
  }
  if (nivel >= 5) {
    return { bg: 'bg-purple-100', text: 'text-purple-600' }
  }
  if (nivel >= 1) {
    return { bg: 'bg-green-100', text: 'text-green-600' }
  }
  return { bg: 'bg-blue-100', text: 'text-blue-600' }
}

function getNivelLabel(nivel: number): string {
  if (nivel >= 10) return 'Administrador'
  if (nivel >= 5) return 'Supervisor'
  if (nivel >= 1) return 'Analista'
  return 'Básico'
}
