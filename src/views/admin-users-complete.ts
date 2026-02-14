/**
 * Renderiza o painel admin COMPLETO de gerenciamento de usuários
 */
export function renderAdminUsersComplete(allUsers: any[], cidades: any[], cargos: any[], email: string) {
  // Separar usuários por status
  const pendentes = allUsers.filter(u => u.status === 'PENDENTE')
  const aprovados = allUsers.filter(u => u.status === 'APROVADO')
  const rejeitados = allUsers.filter(u => u.status === 'REJEITADO')

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gerenciar Usuários - Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                animation: fadeIn 0.3s;
            }
            .modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.3s;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .tab-button {
                transition: all 0.3s;
            }
            .tab-button.active {
                background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
                color: white;
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 shadow-lg">
            <div class="max-w-7xl mx-auto">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-4">
                        <i class="fas fa-users-cog text-yellow-300 text-3xl"></i>
                        <div>
                            <h1 class="text-2xl font-bold">Gerenciar Usuários</h1>
                            <p class="text-sm opacity-90">Controle completo de usuários do sistema</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <a href="/admin/config?email=${encodeURIComponent(email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold">
                            <i class="fas fa-cog mr-2"></i>
                            Configurações
                        </a>
                        <a href="/admin/opcoes?email=${encodeURIComponent(email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold">
                            <i class="fas fa-link mr-2"></i>
                            Gerenciar Links
                        </a>
                    </div>
                </div>
                <a href="/portal?email=${encodeURIComponent(email)}" class="text-sm underline hover:text-purple-200">
                    <i class="fas fa-arrow-left mr-1"></i>
                    Voltar ao Portal
                </a>
            </div>
        </div>
        
        <!-- Conteúdo -->
        <div class="max-w-7xl mx-auto p-6">
            <!-- Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Total de Usuários</p>
                            <p class="text-2xl font-bold text-gray-800">${allUsers.length}</p>
                        </div>
                        <i class="fas fa-users text-blue-500 text-3xl"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Pendentes</p>
                            <p class="text-2xl font-bold text-gray-800">${pendentes.length}</p>
                        </div>
                        <i class="fas fa-clock text-yellow-500 text-3xl"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Aprovados</p>
                            <p class="text-2xl font-bold text-gray-800">${aprovados.length}</p>
                        </div>
                        <i class="fas fa-check-circle text-green-500 text-3xl"></i>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Rejeitados</p>
                            <p class="text-2xl font-bold text-gray-800">${rejeitados.length}</p>
                        </div>
                        <i class="fas fa-times-circle text-red-500 text-3xl"></i>
                    </div>
                </div>
            </div>

            <!-- Abas -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="flex border-b">
                    <button onclick="changeTab('pendentes')" id="tab-pendentes" class="tab-button active flex-1 px-6 py-4 font-semibold text-gray-700">
                        <i class="fas fa-clock mr-2"></i>
                        Pendentes (${pendentes.length})
                    </button>
                    <button onclick="changeTab('aprovados')" id="tab-aprovados" class="tab-button flex-1 px-6 py-4 font-semibold text-gray-700">
                        <i class="fas fa-check-circle mr-2"></i>
                        Aprovados (${aprovados.length})
                    </button>
                    <button onclick="changeTab('rejeitados')" id="tab-rejeitados" class="tab-button flex-1 px-6 py-4 font-semibold text-gray-700">
                        <i class="fas fa-times-circle mr-2"></i>
                        Rejeitados (${rejeitados.length})
                    </button>
                    <button onclick="changeTab('todos')" id="tab-todos" class="tab-button flex-1 px-6 py-4 font-semibold text-gray-700">
                        <i class="fas fa-users mr-2"></i>
                        Todos (${allUsers.length})
                    </button>
                </div>

                <!-- Conteúdo das Abas -->
                <div class="p-6">
                    ${renderUserTable('pendentes', pendentes, cidades, cargos)}
                    ${renderUserTable('aprovados', aprovados, cidades, cargos)}
                    ${renderUserTable('rejeitados', rejeitados, cidades, cargos)}
                    ${renderUserTable('todos', allUsers, cidades, cargos)}
                </div>
            </div>
        </div>

        <!-- Modal de Edição -->
        <div id="editModal" class="modal">
            <div class="modal-content">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-user-edit text-purple-600 mr-2"></i>
                        Editar Usuário
                    </h2>
                    <button onclick="closeEditModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <form id="editForm" onsubmit="event.preventDefault(); saveUser();">
                    <input type="hidden" id="edit-email" />
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                            <input type="text" id="edit-nome" class="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-purple-500 focus:outline-none" required />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
                            <select id="edit-cargo" class="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-purple-500 focus:outline-none">
                                ${cargos.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Cidade</label>
                            <select id="edit-cidade" class="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-purple-500 focus:outline-none">
                                <option value="Todas">Todas</option>
                                ${cidades.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Nível de Acesso</label>
                            <select id="edit-nivel" class="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-purple-500 focus:outline-none">
                                <option value="0">Nível 0 - Básico</option>
                                <option value="1">Nível 1 - Analista</option>
                                <option value="5">Nível 5 - Supervisor</option>
                                <option value="10">Nível 10 - Administrador</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select id="edit-status" class="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-purple-500 focus:outline-none">
                                <option value="PENDENTE">Pendente</option>
                                <option value="APROVADO">Aprovado</option>
                                <option value="REJEITADO">Rejeitado</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button type="button" onclick="closeEditModal()" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" class="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold">
                            <i class="fas fa-save mr-2"></i>
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <script>
            // Dados das cidades e cargos
            const cidadesData = ${JSON.stringify(cidades)};
            const cargosData = ${JSON.stringify(cargos)};

            // Controle de abas
            function changeTab(tab) {
                // Esconde todas as tabelas
                document.querySelectorAll('.user-table').forEach(t => t.classList.add('hidden'));
                // Remove active de todos os botões
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                
                // Mostra tabela selecionada
                document.getElementById('table-' + tab).classList.remove('hidden');
                // Adiciona active no botão
                document.getElementById('tab-' + tab).classList.add('active');
            }

            // Modal de edição
            function openEditModal(email, nome, cargo, cidade, nivel, status) {
                document.getElementById('edit-email').value = email;
                document.getElementById('edit-nome').value = nome;
                document.getElementById('edit-cargo').value = cargo;
                document.getElementById('edit-cidade').value = cidade;
                document.getElementById('edit-nivel').value = nivel;
                document.getElementById('edit-status').value = status;
                document.getElementById('editModal').classList.add('active');
            }

            function closeEditModal() {
                document.getElementById('editModal').classList.remove('active');
            }

            // Salvar edição
            async function saveUser() {
                const email = document.getElementById('edit-email').value;
                const updates = {
                    nome: document.getElementById('edit-nome').value,
                    cargo: document.getElementById('edit-cargo').value,
                    cidade: document.getElementById('edit-cidade').value,
                    nivel: parseInt(document.getElementById('edit-nivel').value),
                    status: document.getElementById('edit-status').value
                };

                try {
                    const response = await fetch('/api/admin/users/' + encodeURIComponent(email), {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Usuário atualizado com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao atualizar usuário');
                    console.error(error);
                }
            }

            // Aprovar usuário
            async function aprovarUsuario(email, nivel) {
                if (!confirm('Aprovar usuário ' + email + ' com nível ' + nivel + '?')) {
                    return;
                }

                try {
                    const response = await fetch('/api/admin/users/approve', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, nivel: parseInt(nivel) })
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Usuário aprovado!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao aprovar usuário');
                    console.error(error);
                }
            }

            // Rejeitar usuário
            async function rejeitarUsuario(email) {
                if (!confirm('Rejeitar usuário ' + email + '?')) {
                    return;
                }

                try {
                    const response = await fetch('/api/admin/users/reject', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Usuário rejeitado');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao rejeitar usuário');
                    console.error(error);
                }
            }

            // Deletar usuário
            async function deletarUsuario(email) {
                if (!confirm('ATENÇÃO: Deletar usuário ' + email + '? Esta ação NÃO pode ser desfeita!')) {
                    return;
                }

                try {
                    const response = await fetch('/api/admin/users/' + encodeURIComponent(email), {
                        method: 'DELETE'
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Usuário deletado com sucesso');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao deletar usuário');
                    console.error(error);
                }
            }
        </script>
    </body>
    </html>
  `
}

function renderUserTable(tabId: string, users: any[], cidades: any[], cargos: any[]) {
  const isVisible = tabId === 'pendentes' ? '' : 'hidden'
  
  if (users.length === 0) {
    return `
      <div id="table-${tabId}" class="user-table ${isVisible} text-center py-12">
          <i class="fas fa-inbox text-gray-300 text-6xl mb-4"></i>
          <p class="text-gray-600 text-lg">Nenhum usuário nesta categoria</p>
      </div>
    `
  }

  return `
    <div id="table-${tabId}" class="user-table ${isVisible}">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Usuário</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cargo</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cidade</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nível</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ações</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${users.map(u => `
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-4">
                            <div class="flex items-center gap-3">
                                ${u.avatar_url ? `<img src="${u.avatar_url}" class="w-10 h-10 rounded-full" />` : '<div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"><i class="fas fa-user text-gray-600"></i></div>'}
                                <div>
                                    <p class="font-semibold text-gray-800">${u.nome}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-4 text-sm text-gray-600">${u.email}</td>
                        <td class="px-4 py-4 text-sm text-gray-600">${u.cargo_solicitado}</td>
                        <td class="px-4 py-4">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                ${u.cidade}
                            </span>
                        </td>
                        <td class="px-4 py-4">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                ${u.nivel}
                            </span>
                        </td>
                        <td class="px-4 py-4">
                            ${getStatusBadge(u.status)}
                        </td>
                        <td class="px-4 py-4 text-sm text-gray-600">${new Date(u.data_cadastro).toLocaleDateString('pt-BR')}</td>
                        <td class="px-4 py-4">
                            <div class="flex gap-2">
                                ${u.status === 'PENDENTE' ? `
                                <button 
                                    onclick="aprovarUsuario('${u.email}', 1)" 
                                    class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                                    title="Aprovar"
                                >
                                    <i class="fas fa-check"></i>
                                </button>
                                <button 
                                    onclick="rejeitarUsuario('${u.email}')" 
                                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                                    title="Rejeitar"
                                >
                                    <i class="fas fa-times"></i>
                                </button>
                                ` : ''}
                                <button 
                                    onclick="openEditModal('${u.email}', '${u.nome.replace(/'/g, "\\'")}', '${u.cargo_solicitado}', '${u.cidade}', '${u.nivel}', '${u.status}')" 
                                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                                    title="Editar"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button 
                                    onclick="deletarUsuario('${u.email}')" 
                                    class="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 text-xs"
                                    title="Deletar"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
  `
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'APROVADO':
      return '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><i class="fas fa-check-circle mr-1"></i>Aprovado</span>'
    case 'REJEITADO':
      return '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><i class="fas fa-times-circle mr-1"></i>Rejeitado</span>'
    case 'PENDENTE':
      return '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><i class="fas fa-clock mr-1"></i>Pendente</span>'
    default:
      return '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">-</span>'
  }
}
