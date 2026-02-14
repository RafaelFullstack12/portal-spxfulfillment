/**
 * Renderiza o painel admin de gerenciamento de opções/links do portal
 */
export function renderAdminOpcoes(opcoes: any[], cidades: any[], setores: any[], email: string) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gerenciar Links - Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 shadow-lg">
            <div class="max-w-7xl mx-auto">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-4">
                        <i class="fas fa-link text-yellow-300 text-3xl"></i>
                        <div>
                            <h1 class="text-2xl font-bold">Gerenciar Links do Portal</h1>
                            <p class="text-sm opacity-90">Adicionar, editar e deletar opções</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <a href="/admin/users?email=${encodeURIComponent(email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold">
                            <i class="fas fa-users mr-2"></i>
                            Usuários
                        </a>
                        <a href="/admin/config?email=${encodeURIComponent(email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold">
                            <i class="fas fa-cog mr-2"></i>
                            Configurações
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
            <!-- Botão Adicionar -->
            <div class="mb-6">
                <button 
                    onclick="mostrarFormularioNovo()" 
                    class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold inline-flex items-center gap-2"
                >
                    <i class="fas fa-plus"></i>
                    Adicionar Novo Link
                </button>
            </div>
            
            <!-- Formulário Nova Opção -->
            <div id="formNovo" class="hidden bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-green-300">
                <h3 class="text-lg font-bold text-gray-800 mb-4">
                    <i class="fas fa-plus-circle text-green-600 mr-2"></i>
                    Adicionar Novo Link
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">
                            Nome *
                        </label>
                        <input 
                            type="text" 
                            id="novo-nome" 
                            class="w-full border border-gray-300 rounded px-3 py-2" 
                            placeholder="Ex: Relatório Mensal" 
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">
                            Ícone (Font Awesome) *
                        </label>
                        <input 
                            type="text" 
                            id="novo-icone" 
                            class="w-full border border-gray-300 rounded px-3 py-2" 
                            placeholder="Ex: fa-file-invoice" 
                        />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">
                            Descrição
                        </label>
                        <input 
                            type="text" 
                            id="novo-descricao" 
                            class="w-full border border-gray-300 rounded px-3 py-2" 
                            placeholder="Ex: Relatório mensal de vendas" 
                        />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">
                            URL do Link *
                        </label>
                        <input 
                            type="text" 
                            id="novo-link" 
                            class="w-full border border-gray-300 rounded px-3 py-2" 
                            placeholder="Ex: https://example.com/relatorio" 
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">
                            Nível Mínimo *
                        </label>
                        <select id="novo-nivel" class="w-full border border-gray-300 rounded px-3 py-2">
                            <option value="0">Nível 0 - Básico</option>
                            <option value="1">Nível 1 - Analista</option>
                            <option value="5">Nível 5 - Supervisor</option>
                            <option value="10">Nível 10 - Admin</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">
                            Cidade *
                        </label>
                        <select id="novo-cidade" class="w-full border border-gray-300 rounded px-3 py-2">
                            <option value="Todas">Todas as cidades</option>
                            ${cidades.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">
                            Setor *
                        </label>
                        <select id="novo-setor" class="w-full border border-gray-300 rounded px-3 py-2">
                            ${setores.map(s => `<option value="${s.nome}">${s.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="mt-4 flex gap-3">
                    <button 
                        onclick="salvarNovaOpcao()" 
                        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold"
                    >
                        <i class="fas fa-save mr-1"></i>
                        Salvar Link
                    </button>
                    <button 
                        onclick="cancelarFormulario()" 
                        class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
            
            <!-- Lista de Opções -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-list text-blue-600 mr-2"></i>
                    Links Cadastrados (${opcoes.length})
                </h2>
                
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Link</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cidade</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Setor</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nível</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${opcoes.map(opc => `
                            <tr class="hover:bg-gray-50" id="opcao-${opc.id}">
                                <td class="px-4 py-4 text-sm text-gray-600">${opc.id}</td>
                                <td class="px-4 py-4">
                                    <div class="flex items-center gap-2">
                                        <i class="fas ${opc.icone} text-blue-600"></i>
                                        <span class="font-semibold text-gray-800">${opc.nome}</span>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-1">${opc.descricao}</p>
                                </td>
                                <td class="px-4 py-4 text-sm">
                                    <a href="${opc.link}" target="_blank" class="text-blue-600 hover:underline">
                                        ${opc.link.substring(0, 40)}...
                                    </a>
                                </td>
                                <td class="px-4 py-4 text-sm">
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${opc.cidade === 'Todas' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}">
                                        <i class="fas fa-map-marker-alt mr-1"></i>
                                        ${opc.cidade}
                                    </span>
                                </td>
                                <td class="px-4 py-4 text-sm">
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                        <i class="fas fa-briefcase mr-1"></i>
                                        ${opc.setor || 'GERAL'}
                                    </span>
                                </td>
                                <td class="px-4 py-4 text-sm text-gray-600">Nível ${opc.nivel_minimo}+</td>
                                <td class="px-4 py-4">
                                    <span class="px-2 py-1 rounded text-xs font-semibold ${opc.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                        ${opc.status}
                                    </span>
                                </td>
                                <td class="px-4 py-4">
                                    <div class="flex gap-2">
                                        ${opc.status === 'ATIVO' ? `
                                        <button 
                                            onclick="desativarOpcao('${opc.id}')" 
                                            class="text-orange-600 hover:text-orange-800 text-sm font-semibold"
                                        >
                                            <i class="fas fa-pause mr-1"></i>Desativar
                                        </button>
                                        ` : `
                                        <button 
                                            onclick="ativarOpcao('${opc.id}')" 
                                            class="text-green-600 hover:text-green-800 text-sm font-semibold"
                                        >
                                            <i class="fas fa-play mr-1"></i>Ativar
                                        </button>
                                        `}
                                        <button 
                                            onclick="deletarOpcao('${opc.id}', '${opc.nome}')" 
                                            class="text-red-600 hover:text-red-800 text-sm font-semibold ml-2"
                                        >
                                            <i class="fas fa-trash mr-1"></i>Deletar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <script>
            function mostrarFormularioNovo() {
                document.getElementById('formNovo').classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            function cancelarFormulario() {
                document.getElementById('formNovo').classList.add('hidden');
                document.getElementById('novo-nome').value = '';
                document.getElementById('novo-descricao').value = '';
                document.getElementById('novo-link').value = '';
                document.getElementById('novo-icone').value = '';
            }
            
            async function salvarNovaOpcao() {
                const nome = document.getElementById('novo-nome').value.trim();
                const descricao = document.getElementById('novo-descricao').value.trim();
                const link = document.getElementById('novo-link').value.trim();
                const icone = document.getElementById('novo-icone').value.trim() || 'fa-file';
                const nivel_minimo = parseInt(document.getElementById('novo-nivel').value);
                const cidade = document.getElementById('novo-cidade').value;
                const setor = document.getElementById('novo-setor').value;
                
                if (!nome || !link) {
                    alert('Nome e Link são obrigatórios');
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/opcoes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nome, descricao, link, icone, nivel_minimo, cidade, setor })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Link adicionado com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao criar link');
                    console.error(error);
                }
            }
            
            async function desativarOpcao(id) {
                if (!confirm('Desativar este link?')) return;
                
                try {
                    const response = await fetch('/api/admin/opcoes/' + id, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'INATIVO' })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao desativar link');
                }
            }
            
            async function ativarOpcao(id) {
                try {
                    const response = await fetch('/api/admin/opcoes/' + id, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'ATIVO' })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao ativar link');
                }
            }
            
            async function deletarOpcao(id, nome) {
                if (!confirm('ATENÇÃO: Deletar o link "' + nome + '"? Esta ação não pode ser desfeita!')) {
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/opcoes/' + id, {
                        method: 'DELETE'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Link deletado com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao deletar link');
                    console.error(error);
                }
            }
        </script>
    </body>
    </html>
  `
}
