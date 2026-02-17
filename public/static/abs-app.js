// ========================================
// CONFIGURAÇÃO
// ========================================
const WAREHOUSE = 'SP'; // Pode ser PE, SP (FRANCO), GO
const API_BASE = '';

// Opções de marcação de presença
const OPCOES_PRESENCA = {
    '': { nome: '-- Selecione --', cor: '#666666' },
    'P': { nome: 'Presente', cor: '#4CAF50' },
    'F': { nome: 'Falta', cor: '#F44336' },
    'FJ': { nome: 'Falta Justificada', cor: '#FFC107' },
    'DV': { nome: 'Desligamento Voluntário', cor: '#FFC107' },
    'DF': { nome: 'Desligamento Involuntário', cor: '#FFC107' },
    'FE': { nome: 'Férias', cor: '#4CAF50' },
    'FO': { nome: 'Folga', cor: '#8BC34A' },
    'DSR': { nome: 'Descanso Semanal', cor: '#009688' },
    'AL': { nome: 'Atestado', cor: '#FF5722' },
    'AF': { nome: 'Afastamento', cor: '#9C27B0' },
    'TR': { nome: 'Treinamento', cor: '#3F51B5' },
    'PR': { nome: 'Presente Remoto', cor: '#2196F3' },
    'BH': { nome: 'Bank Holiday', cor: '#00BCD4' },
    'AM': { nome: 'Advertência/Atraso', cor: '#FF9800' },
    'NC': { nome: 'Não Compareceu', cor: '#E91E63' },
    'S1': { nome: 'Saída 1', cor: '#FF9800' },
    'S2': { nome: 'Saída 2', cor: '#FF5722' },
    'SU': { nome: 'Suspensão', cor: '#9E9E9E' }
};

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// ========================================
// ESTADO GLOBAL
// ========================================
let estado = {
    warehouse: WAREHOUSE,
    mes: null,
    ano: null,
    supervisor: null,
    dia: null,
    colaboradores: [],
    todosColaboradores: [],
    todosSupervisores: [],
    marcacoesModificadas: {}
};

// ========================================
// FUNÇÕES DE NAVEGAÇÃO
// ========================================
function mostrarTela(nomeTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('active'));
    document.getElementById(`tela-${nomeTela}`).classList.add('active');
}

function mostrarLoading(texto = 'Carregando...') {
    document.getElementById('loading-text').textContent = texto;
    document.getElementById('loading').classList.add('active');
}

function esconderLoading() {
    document.getElementById('loading').classList.remove('active');
}

// ========================================
// TELA 1: SELEÇÃO DE MÊS
// ========================================
function carregarMeses() {
    const ano = new Date().getFullYear();
    const mesAtual = new Date().getMonth(); // 0-11
    
    const grid = document.getElementById('meses-grid');
    grid.innerHTML = '';
    
    document.getElementById('info-warehouse').textContent = `Warehouse: ${estado.warehouse}`;
    
    // Mostrar apenas o mês atual (conforme requisito)
    const mes = MESES[mesAtual];
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => selecionarMes(mes, ano);
    card.innerHTML = `
        <div class="card-icon">📅</div>
        <div class="card-title">${mes}</div>
        <div class="card-subtitle">${ano}</div>
    `;
    grid.appendChild(card);
}

async function selecionarMes(mes, ano) {
    estado.mes = mes;
    estado.ano = ano;
    
    mostrarLoading('Carregando supervisores...');
    
    try {
        const response = await fetch(`${API_BASE}/api/abs/colaboradores/${estado.warehouse}/${mes}/${ano}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Erro ao carregar dados');
        }
        
        estado.todosColaboradores = data.colaboradores || [];
        
        // Extrair lista única de supervisores
        const supervisoresSet = new Set();
        estado.todosColaboradores.forEach(c => {
            if (c.lider && c.lider.trim()) {
                supervisoresSet.add(c.lider.trim());
            }
        });
        
        estado.todosSupervisores = Array.from(supervisoresSet).sort();
        
        esconderLoading();
        carregarSupervisores();
        mostrarTela('supervisores');
        
    } catch (error) {
        esconderLoading();
        alert(`Erro: ${error.message}`);
        console.error(error);
    }
}

function voltarParaMeses() {
    estado.mes = null;
    estado.ano = null;
    estado.supervisor = null;
    estado.dia = null;
    mostrarTela('meses');
}

// ========================================
// TELA 2: SELEÇÃO DE SUPERVISOR
// ========================================
function carregarSupervisores() {
    const grid = document.getElementById('supervisores-grid');
    grid.innerHTML = '';
    
    document.getElementById('info-mes').textContent = `${estado.mes} ${estado.ano}`;
    
    if (estado.todosSupervisores.length === 0) {
        grid.innerHTML = '<div class="text-center text-gray-400 p-8">Nenhum supervisor encontrado</div>';
        return;
    }
    
    estado.todosSupervisores.forEach(supervisor => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => selecionarSupervisor(supervisor);
        
        // Contar colaboradores deste supervisor
        const qtd = estado.todosColaboradores.filter(c => c.lider === supervisor).length;
        
        card.innerHTML = `
            <div class="card-icon">👤</div>
            <div class="card-title">${supervisor}</div>
            <div class="card-subtitle">${qtd} colaborador${qtd !== 1 ? 'es' : ''}</div>
        `;
        grid.appendChild(card);
    });
}

function filtrarSupervisores() {
    const busca = document.getElementById('busca-supervisor').value.toLowerCase();
    const cards = document.querySelectorAll('#supervisores-grid .card');
    
    cards.forEach(card => {
        const nome = card.querySelector('.card-title').textContent.toLowerCase();
        card.style.display = nome.includes(busca) ? 'block' : 'none';
    });
}

function selecionarSupervisor(supervisor) {
    estado.supervisor = supervisor;
    carregarCalendario();
    mostrarTela('calendario');
}

function voltarParaSupervisores() {
    estado.supervisor = null;
    estado.dia = null;
    mostrarTela('supervisores');
}

// ========================================
// TELA 3: CALENDÁRIO
// ========================================
function carregarCalendario() {
    const grid = document.getElementById('calendario-grid');
    grid.innerHTML = '';
    
    document.getElementById('info-supervisor').textContent = estado.supervisor;
    
    // Filtrar colaboradores do supervisor
    const colaboradoresSupervisor = estado.todosColaboradores.filter(
        c => c.lider === estado.supervisor
    );
    
    // Descobrir quantos dias tem o mês
    const mesIndex = MESES.indexOf(estado.mes);
    const diasNoMes = new Date(estado.ano, mesIndex + 1, 0).getDate();
    
    let completos = 0;
    let pendentes = 0;
    
    // Criar card para cada dia
    for (let dia = 1; dia <= diasNoMes; dia++) {
        // Verificar se todos os colaboradores têm marcação neste dia
        let marcados = 0;
        colaboradoresSupervisor.forEach(colab => {
            if (colab.marcacoes && colab.marcacoes[dia] && colab.marcacoes[dia].sigla) {
                marcados++;
            }
        });
        
        const total = colaboradoresSupervisor.length;
        const isCompleto = marcados === total;
        const isPendente = marcados > 0 && marcados < total;
        
        if (isCompleto) completos++;
        if (isPendente) pendentes++;
        
        const card = document.createElement('div');
        card.className = `day-card ${isCompleto ? 'completo' : (isPendente ? 'pendente' : '')}`;
        card.onclick = () => selecionarDia(dia);
        
        card.innerHTML = `
            <div class="day-number">${dia}</div>
            <div class="day-status">${marcados}/${total}</div>
        `;
        
        grid.appendChild(card);
    }
    
    // Atualizar estatísticas
    document.getElementById('stat-total').textContent = diasNoMes;
    document.getElementById('stat-completos').textContent = completos;
    document.getElementById('stat-pendentes').textContent = pendentes;
}

function selecionarDia(dia) {
    estado.dia = dia;
    carregarMarcacoes();
    mostrarTela('marcacao');
}

function voltarParaCalendario() {
    estado.dia = null;
    estado.marcacoesModificadas = {};
    carregarCalendario();
    mostrarTela('calendario');
}

// ========================================
// TELA 4: MARCAÇÃO DE PRESENÇA
// ========================================
function carregarMarcacoes() {
    const list = document.getElementById('colaboradores-list');
    list.innerHTML = '';
    
    document.getElementById('info-dia').textContent = `Dia ${estado.dia} - ${estado.mes} ${estado.ano}`;
    
    // Filtrar colaboradores do supervisor
    estado.colaboradores = estado.todosColaboradores.filter(
        c => c.lider === estado.supervisor
    );
    
    renderizarColaboradores();
    atualizarEstatisticas();
}

function renderizarColaboradores() {
    const list = document.getElementById('colaboradores-list');
    const busca = document.getElementById('busca-colaborador').value.toLowerCase();
    list.innerHTML = '';
    
    let marcados = 0;
    
    estado.colaboradores.forEach((colab, index) => {
        // Filtro de busca
        if (busca && !colab.nome.toLowerCase().includes(busca)) {
            return;
        }
        
        const marcacaoAtual = estado.marcacoesModificadas[colab.wfmUser] !== undefined
            ? estado.marcacoesModificadas[colab.wfmUser]
            : (colab.marcacoes && colab.marcacoes[estado.dia] ? colab.marcacoes[estado.dia].sigla : '');
        
        if (marcacaoAtual) marcados++;
        
        const item = document.createElement('div');
        item.className = 'colaborador-item';
        
        // Criar select de marcação
        let selectOptions = '';
        for (const [sigla, info] of Object.entries(OPCOES_PRESENCA)) {
            const selected = marcacaoAtual === sigla ? 'selected' : '';
            selectOptions += `<option value="${sigla}" ${selected}>${info.nome}</option>`;
        }
        
        const isPendente = !marcacaoAtual;
        
        item.innerHTML = `
            <div class="colaborador-info">
                <div class="colaborador-nome">
                    ${colab.nome}
                    ${isPendente ? '<span class="badge badge-pendente">PENDENTE</span>' : '<span class="badge badge-completo">MARCADO</span>'}
                </div>
                <div class="colaborador-detalhes">
                    WFM: ${colab.wfmUser} | ${colab.cargo || 'N/A'} | Admissão: ${colab.dataAdmissao || 'N/A'}
                </div>
            </div>
            <select class="marcacao-select" data-wfm="${colab.wfmUser}" onchange="marcarPresenca(this)">
                ${selectOptions}
            </select>
        `;
        
        list.appendChild(item);
    });
    
    // Atualizar estatísticas
    document.getElementById('stat-marcacao-total').textContent = estado.colaboradores.length;
    document.getElementById('stat-marcacao-marcados').textContent = marcados;
    document.getElementById('stat-marcacao-pendentes').textContent = estado.colaboradores.length - marcados;
}

function marcarPresenca(select) {
    const wfmUser = select.dataset.wfm;
    const sigla = select.value;
    estado.marcacoesModificadas[wfmUser] = sigla;
    renderizarColaboradores();
}

function filtrarColaboradores() {
    renderizarColaboradores();
}

function atualizarEstatisticas() {
    renderizarColaboradores();
}

function recarregarMarcacoes() {
    estado.marcacoesModificadas = {};
    carregarMarcacoes();
}

async function salvarMarcacoes() {
    if (Object.keys(estado.marcacoesModificadas).length === 0) {
        alert('Nenhuma marcação foi alterada.');
        return;
    }
    
    mostrarLoading('Salvando marcações...');
    
    try {
        const marcacoes = [];
        
        for (const [wfmUser, sigla] of Object.entries(estado.marcacoesModificadas)) {
            const colab = estado.colaboradores.find(c => c.wfmUser === wfmUser);
            if (colab) {
                marcacoes.push({
                    wfmUser: wfmUser,
                    nome: colab.nome,
                    dia: estado.dia,
                    sigla: sigla
                });
            }
        }
        
        const response = await fetch(`${API_BASE}/api/abs/marcar-presenca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                warehouse: estado.warehouse,
                mes: estado.mes,
                ano: estado.ano,
                dia: estado.dia,
                marcacoes: marcacoes
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Erro ao salvar');
        }
        
        // Atualizar estado local
        marcacoes.forEach(m => {
            const colab = estado.todosColaboradores.find(c => c.wfmUser === m.wfmUser);
            if (colab) {
                if (!colab.marcacoes) colab.marcacoes = {};
                if (!colab.marcacoes[estado.dia]) colab.marcacoes[estado.dia] = {};
                colab.marcacoes[estado.dia].sigla = m.sigla;
                colab.marcacoes[estado.dia].tipo = 'manual';
            }
        });
        
        estado.marcacoesModificadas = {};
        
        esconderLoading();
        alert(`✅ ${marcacoes.length} marcação(ões) salva(s) com sucesso!`);
        
        // Recarregar para mostrar dados atualizados
        carregarMarcacoes();
        
    } catch (error) {
        esconderLoading();
        alert(`Erro ao salvar: ${error.message}`);
        console.error(error);
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    carregarMeses();
});
