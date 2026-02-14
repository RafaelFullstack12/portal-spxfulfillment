/**
 * Renderiza o painel admin de configurações do sistema
 */
export function renderAdminConfig(cidades: any[], cargos: any[], setores: any[], niveis: any[], email: string) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Configurações do Sistema - Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 shadow-lg">
            <div class="max-w-7xl mx-auto">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-4">
                        <i class="fas fa-cog text-yellow-300 text-3xl"></i>
                        <div>
                            <h1 class="text-2xl font-bold">Configurações do Sistema</h1>
                            <p class="text-sm opacity-90">Gerenciar cidades, cargos e níveis de acesso</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <a href="/admin/users?email=${encodeURIComponent(email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold">
                            <i class="fas fa-users mr-2"></i>
                            Usuários
                        </a>
                        <a href="/admin/opcoes?email=${encodeURIComponent(email)}" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-semibold">
                            <i class="fas fa-link mr-2"></i>
                            Links
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
            <!-- CIDADES -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-800">
                        <i class="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                        Cidades (${cidades.length})
                    </h2>
                    <button 
                        onclick="mostrarFormCidade()" 
                        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
                    >
                        <i class="fas fa-plus mr-1"></i>
                        Adicionar Cidade
                    </button>
                </div>
                
                <!-- Form Nova Cidade -->
                <div id="formCidade" class="hidden bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                    <h3 class="font-bold text-gray-800 mb-3">Nova Cidade</h3>
                    <div class="flex gap-3">
                        <input 
                            type="text" 
                            id="novaCidade" 
                            placeholder="Nome da cidade (ex: Bahia)" 
                            class="flex-1 border border-gray-300 rounded px-3 py-2"
                        />
                        <button 
                            onclick="salvarCidade()" 
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold"
                        >
                            <i class="fas fa-save mr-1"></i>
                            Salvar
                        </button>
                        <button 
                            onclick="cancelarCidade()" 
                            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
                
                <!-- Lista de Cidades -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${cidades.map(c => `
                    <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-map-marker-alt text-blue-600"></i>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800">${c.nome}</p>
                                <p class="text-xs text-gray-500">ID: ${c.id}</p>
                            </div>
                        </div>
                        <button 
                            onclick="deletarCidade('${c.id}', '${c.nome}')" 
                            class="text-red-500 hover:text-red-700 px-2 py-1"
                            title="Deletar cidade"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- CARGOS -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-800">
                        <i class="fas fa-briefcase text-green-500 mr-2"></i>
                        Cargos (${cargos.length})
                    </h2>
                    <button 
                        onclick="mostrarFormCargo()" 
                        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold"
                    >
                        <i class="fas fa-plus mr-1"></i>
                        Adicionar Cargo
                    </button>
                </div>
                
                <!-- Form Novo Cargo -->
                <div id="formCargo" class="hidden bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                    <h3 class="font-bold text-gray-800 mb-3">Novo Cargo</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <input 
                            type="text" 
                            id="novoCargo" 
                            placeholder="Nome (ex: Coordenador)" 
                            class="border border-gray-300 rounded px-3 py-2"
                        />
                        <input 
                            type="text" 
                            id="novoCargoIcone" 
                            placeholder="Ícone (ex: fa-user-tie)" 
                            class="border border-gray-300 rounded px-3 py-2"
                        />
                        <input 
                            type="text" 
                            id="novoCargoDesc" 
                            placeholder="Descrição" 
                            class="border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div class="flex gap-3">
                        <button 
                            onclick="salvarCargo()" 
                            class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-semibold"
                        >
                            <i class="fas fa-save mr-1"></i>
                            Salvar
                        </button>
                        <button 
                            onclick="cancelarCargo()" 
                            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
                
                <!-- Lista de Cargos -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${cargos.map(c => `
                    <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="fas ${c.icone} text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800">${c.nome}</p>
                                <p class="text-xs text-gray-500">${c.descricao}</p>
                            </div>
                        </div>
                        <button 
                            onclick="deletarCargo('${c.id}', '${c.nome}')" 
                            class="text-red-500 hover:text-red-700 px-2 py-1"
                            title="Deletar cargo"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- NÍVEIS DE ACESSO -->
            <div class="bg-white rounded-lg shadow-md p-6 mt-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-800">
                        <i class="fas fa-layer-group text-purple-500 mr-2"></i>
                        Níveis de Acesso (${niveis.length})
                    </h2>
                    <button 
                        onclick="mostrarFormNivel()" 
                        class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 font-semibold"
                    >
                        <i class="fas fa-plus mr-1"></i>
                        Adicionar Nível
                    </button>
                </div>
                
                <!-- Form Novo Nível -->
                <div id="formNivel" class="hidden bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                    <h3 class="font-bold text-gray-800 mb-3">Novo Nível de Acesso</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input 
                            type="number" 
                            id="novoNivel" 
                            placeholder="Número do nível (ex: 3)" 
                            class="border border-gray-300 rounded px-3 py-2"
                            min="0"
                            max="100"
                        />
                        <input 
                            type="text" 
                            id="novoNivelDesc" 
                            placeholder="Descrição (ex: Coordenador)" 
                            class="border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div class="flex gap-3">
                        <button 
                            onclick="salvarNivel()" 
                            class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-semibold"
                        >
                            <i class="fas fa-save mr-1"></i>
                            Salvar
                        </button>
                        <button 
                            onclick="cancelarNivel()" 
                            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
                
                <!-- Lista de Níveis -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${niveis.sort((a, b) => a.nivel - b.nivel).map(n => `
                    <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 ${n.nivel >= 10 ? 'bg-purple-100' : n.nivel >= 5 ? 'bg-orange-100' : n.nivel >= 1 ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center">
                                <span class="font-bold text-xl ${n.nivel >= 10 ? 'text-purple-600' : n.nivel >= 5 ? 'text-orange-600' : n.nivel >= 1 ? 'text-blue-600' : 'text-gray-600'}">
                                    ${n.nivel}
                                </span>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800">${n.descricao}</p>
                                <p class="text-xs text-gray-500">Nível ${n.nivel} - ID: ${n.id}</p>
                            </div>
                        </div>
                        <button 
                            onclick="deletarNivel('${n.id}', '${n.nivel}', '${n.descricao}')" 
                            class="text-red-500 hover:text-red-700 px-2 py-1"
                            title="Deletar nível"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <script>
            // CIDADES
            function mostrarFormCidade() {
                document.getElementById('formCidade').classList.remove('hidden');
            }
            
            function cancelarCidade() {
                document.getElementById('formCidade').classList.add('hidden');
                document.getElementById('novaCidade').value = '';
            }
            
            async function salvarCidade() {
                const nome = document.getElementById('novaCidade').value.trim();
                
                if (!nome) {
                    alert('Digite o nome da cidade');
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/config/cidades', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nome })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Cidade adicionada com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao adicionar cidade');
                    console.error(error);
                }
            }
            
            // CARGOS
            function mostrarFormCargo() {
                document.getElementById('formCargo').classList.remove('hidden');
            }
            
            function cancelarCargo() {
                document.getElementById('formCargo').classList.add('hidden');
                document.getElementById('novoCargo').value = '';
                document.getElementById('novoCargoIcone').value = '';
                document.getElementById('novoCargoDesc').value = '';
            }
            
            async function salvarCargo() {
                const nome = document.getElementById('novoCargo').value.trim();
                const icone = document.getElementById('novoCargoIcone').value.trim() || 'fa-user';
                const descricao = document.getElementById('novoCargoDesc').value.trim();
                
                if (!nome) {
                    alert('Digite o nome do cargo');
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/config/cargos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nome, icone, descricao })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Cargo adicionado com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao adicionar cargo');
                    console.error(error);
                }
            }
            
            async function deletarCidade(id, nome) {
                if (!confirm('Deletar a cidade "' + nome + '"? Esta ação não pode ser desfeita!')) {
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/config/cidades/' + id, {
                        method: 'DELETE'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Cidade deletada com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao deletar cidade');
                    console.error(error);
                }
            }
            
            async function deletarCargo(id, nome) {
                if (!confirm('Deletar o cargo "' + nome + '"? Esta ação não pode ser desfeita!')) {
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/config/cargos/' + id, {
                        method: 'DELETE'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Cargo deletado com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao deletar cargo');
                    console.error(error);
                }
            }
            
            // NÍVEIS DE ACESSO
            function mostrarFormNivel() {
                document.getElementById('formNivel').classList.remove('hidden');
            }
            
            function cancelarNivel() {
                document.getElementById('formNivel').classList.add('hidden');
                document.getElementById('novoNivel').value = '';
                document.getElementById('novoNivelDesc').value = '';
            }
            
            async function salvarNivel() {
                const nivel = document.getElementById('novoNivel').value.trim();
                const descricao = document.getElementById('novoNivelDesc').value.trim();
                
                if (!nivel || !descricao) {
                    alert('Preencha o número do nível e a descrição');
                    return;
                }
                
                const nivelNum = parseInt(nivel);
                if (isNaN(nivelNum) || nivelNum < 0 || nivelNum > 100) {
                    alert('Nível deve ser um número entre 0 e 100');
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/config/niveis', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nivel: nivelNum, descricao })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Nível adicionado com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao adicionar nível');
                    console.error(error);
                }
            }
            
            async function deletarNivel(id, nivel, descricao) {
                if (!confirm('Deletar o nível ' + nivel + ' - ' + descricao + '? Esta ação não pode ser desfeita!')) {
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/config/niveis/' + id, {
                        method: 'DELETE'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Nível deletado com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro: ' + data.error);
                    }
                } catch (error) {
                    alert('Erro ao deletar nível');
                    console.error(error);
                }
            }
        </script>
    </body>
    </html>
  `
}
