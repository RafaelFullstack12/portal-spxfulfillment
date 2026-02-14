/**
 * Renderiza o painel admin de gerenciamento de usuários
 */
export function renderAdminUsers(pendingUsers: any[], cidades: any[], email: string) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gerenciar Usuários - Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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
                            <p class="text-sm opacity-90">Aprovar, rejeitar e editar usuários</p>
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
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-user-clock text-yellow-500 mr-2"></i>
                    Usuários Pendentes de Aprovação (${pendingUsers.length})
                </h2>
                
                ${pendingUsers.length === 0 ? `
                <div class="text-center py-12">
                    <i class="fas fa-check-circle text-green-500 text-6xl mb-4"></i>
                    <p class="text-gray-600 text-lg">Nenhum usuário pendente!</p>
                    <p class="text-gray-400 text-sm">Todos os cadastros foram processados</p>
                </div>
                ` : `
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Usuário</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cargo</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cidade</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${pendingUsers.map(u => `
                            <tr class="hover:bg-gray-50" id="user-${u.email}">
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
                                <td class="px-4 py-4 text-sm text-gray-600">
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                        <i class="fas fa-map-marker-alt mr-1"></i>
                                        ${u.cidade || 'Não informado'}
                                    </span>
                                </td>
                                <td class="px-4 py-4 text-sm text-gray-600">${new Date(u.data_cadastro).toLocaleDateString('pt-BR')}</td>
                                <td class="px-4 py-4">
                                    <div class="flex flex-col gap-2">
                                        <div class="flex gap-2">
                                            <select id="nivel-${u.email}" class="border border-gray-300 rounded px-2 py-1 text-sm">
                                                <option value="0">Nível 0</option>
                                                <option value="1" selected>Nível 1</option>
                                                <option value="5">Nível 5</option>
                                                <option value="10">Nível 10</option>
                                            </select>
                                        </div>
                                        <div class="flex gap-2">
                                            <button 
                                                onclick="aprovarUsuario('${u.email}')" 
                                                class="flex-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm font-semibold"
                                            >
                                                <i class="fas fa-check mr-1"></i>
                                                Aprovar
                                            </button>
                                            <button 
                                                onclick="rejeitarUsuario('${u.email}')" 
                                                class="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-semibold"
                                            >
                                                <i class="fas fa-times mr-1"></i>
                                                Rejeitar
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                `}
            </div>
        </div>
        
        <script>
            async function aprovarUsuario(email) {
                const nivel = document.getElementById('nivel-' + email).value;
                
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
                        alert('Usuário aprovado com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao aprovar usuário');
                    console.error(error);
                }
            }
            
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
        </script>
    </body>
    </html>
  `
}
