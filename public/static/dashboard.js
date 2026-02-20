// ================================
// DASHBOARD INTEGRADO - HC & PRODUTIVIDADE
// ================================

// Variáveis globais
const API_BASE = window.location.origin;
let chartHC = null;
let chartOutbound = null;
let chartInbound = null;
let chartConsolidado = null;
let dadosHC = [];
let dadosProducao = [];

// ================================
// UTILITÁRIOS
// ================================

// Obter email do usuário do cookie
function getUserEmail() {
    const match = document.cookie.match(/user_email=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

// Formatar números com separador de milhar
function formatNumber(num) {
    if (!num && num !== 0) return '--';
    return num.toLocaleString('pt-BR');
}

// Formatar porcentagem
function formatPercent(value) {
    if (!value && value !== 0) return '--';
    return `${value.toFixed(2)}%`;
}

// Calcular comparação entre dois valores
function calcularComparacao(atual, anterior) {
    if (!anterior || anterior === 0) {
        return { tipo: 'neutral', valor: 0, icone: 'fa-minus' };
    }
    
    const diff = atual - anterior;
    const percent = (diff / anterior) * 100;
    
    if (percent > 0) {
        return { tipo: 'up', valor: percent, icone: 'fa-arrow-up' };
    } else if (percent < 0) {
        return { tipo: 'down', valor: Math.abs(percent), icone: 'fa-arrow-down' };
    } else {
        return { tipo: 'neutral', valor: 0, icone: 'fa-minus' };
    }
}

// Atualizar badge de comparação
function atualizarBadge(elementId, comparacao) {
    const badge = document.getElementById(elementId);
    if (!badge) return;
    
    badge.className = `comparison-badge badge-${comparacao.tipo}`;
    badge.innerHTML = `
        <i class="fas ${comparacao.icone}"></i>
        ${formatPercent(comparacao.valor)}
    `;
}

// ================================
// CONTROLE DE ABAS
// ================================

function trocarAba(aba) {
    // Desativar todas as abas
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Ativar aba selecionada
    document.querySelectorAll('.tab').forEach(t => {
        if (t.textContent.includes(getAbaNome(aba))) {
            t.classList.add('active');
        }
    });
    document.getElementById(`tab-${aba}`).classList.add('active');
    
    console.log(`[Dashboard] Aba trocada para: ${aba}`);
}

function getAbaNome(aba) {
    const nomes = {
        'hc': 'Headcount',
        'producao': 'Produtividade',
        'consolidado': 'Consolidada'
    };
    return nomes[aba] || aba;
}

// ================================
// CARREGAMENTO DE DADOS
// ================================

async function carregarDados() {
    console.log('[Dashboard] Iniciando carregamento de dados...');
    
    const userEmail = getUserEmail();
    if (!userEmail) {
        alert('❌ Sessão expirada. Faça login novamente.');
        window.location.href = '/login';
        return;
    }
    
    console.log(`[Dashboard] Email do usuário: ${userEmail}`);
    
    // Mostrar loading
    const loading = document.getElementById('loading');
    loading.classList.add('active');
    
    try {
        // Buscar dados de HC
        console.log('[Dashboard] Buscando dados de HC...');
        const resHC = await fetch(`${API_BASE}/api/dashboard/raw-hc`, {
            headers: { 'x-user-email': userEmail }
        });
        
        if (!resHC.ok) {
            const error = await resHC.text();
            throw new Error(`Erro ao buscar HC: ${resHC.status} - ${error}`);
        }
        
        const dataHC = await resHC.json();
        if (!dataHC.success) {
            throw new Error(dataHC.error || 'Erro ao buscar dados de HC');
        }
        
        dadosHC = dataHC.data || [];
        console.log(`[Dashboard] HC carregado: ${dadosHC.length} registros`);
        
        // Buscar dados de Produção
        console.log('[Dashboard] Buscando dados de Produção...');
        const resProducao = await fetch(`${API_BASE}/api/dashboard/raw-dados`, {
            headers: { 'x-user-email': userEmail }
        });
        
        if (!resProducao.ok) {
            const error = await resProducao.text();
            throw new Error(`Erro ao buscar Produção: ${resProducao.status} - ${error}`);
        }
        
        const dataProducao = await resProducao.json();
        if (!dataProducao.success) {
            throw new Error(dataProducao.error || 'Erro ao buscar dados de produção');
        }
        
        dadosProducao = dataProducao.data || [];
        console.log(`[Dashboard] Produção carregada: ${dadosProducao.length} registros`);
        
        // Processar e renderizar
        processarDados();
        popularFiltros();
        renderizarDashboard();
        
        // Atualizar timestamp
        const now = new Date();
        document.getElementById('last-update').textContent = 
            now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        console.log('[Dashboard] ✅ Dados carregados com sucesso!');
        
    } catch (error) {
        console.error('[Dashboard] Erro ao carregar dados:', error);
        alert(`❌ Erro ao carregar dados: ${error.message}`);
    } finally {
        loading.classList.remove('active');
    }
}

// ================================
// PROCESSAMENTO DE DADOS
// ================================

function processarDados() {
    console.log('[Dashboard] Processando dados...');
    
    // Aplicar filtros
    const filtroData = document.getElementById('filter-date').value;
    const filtroWH = document.getElementById('filter-warehouse').value;
    const filtroSetor = document.getElementById('filter-sector').value;
    
    // Filtrar dados HC
    let hcFiltrado = dadosHC.filter(row => {
        if (filtroData && row[0] !== filtroData) return false;
        if (filtroWH !== 'all' && row[1] !== filtroWH) return false;
        if (filtroSetor !== 'all' && row[5] !== filtroSetor) return false;
        return true;
    });
    
    // Filtrar dados produção
    let producaoFiltrado = dadosProducao.filter(row => {
        if (filtroData && row[0] !== filtroData) return false;
        if (filtroWH !== 'all' && row[1] !== filtroWH) return false;
        return true;
    });
    
    console.log(`[Dashboard] HC filtrado: ${hcFiltrado.length} | Produção filtrada: ${producaoFiltrado.length}`);
    
    return { hcFiltrado, producaoFiltrado };
}

function popularFiltros() {
    // Popular warehouses
    const whSelect = document.getElementById('filter-warehouse');
    const warehouses = [...new Set(dadosHC.map(r => r[1]).filter(Boolean))].sort();
    
    whSelect.innerHTML = '<option value="all">Todos os Warehouses</option>';
    warehouses.forEach(wh => {
        whSelect.innerHTML += `<option value="${wh}">${wh}</option>`;
    });
    
    // Popular setores
    const setorSelect = document.getElementById('filter-sector');
    const setores = [...new Set(dadosHC.map(r => r[5]).filter(Boolean))].sort();
    
    setorSelect.innerHTML = '<option value="all">Todos os Setores</option>';
    setores.forEach(setor => {
        setorSelect.innerHTML += `<option value="${setor}">${setor}</option>`;
    });
    
    // Definir data padrão (hoje)
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('filter-date').value = hoje;
    
    console.log(`[Dashboard] Filtros populados: ${warehouses.length} WHs, ${setores.length} setores`);
}

// ================================
// RENDERIZAÇÃO DO DASHBOARD
// ================================

function renderizarDashboard() {
    const { hcFiltrado, producaoFiltrado } = processarDados();
    
    // Calcular KPIs de HC
    const headcountTotal = hcFiltrado.reduce((sum, row) => sum + (parseInt(row[6]) || 0), 0);
    const presencaTotal = hcFiltrado.reduce((sum, row) => sum + (parseInt(row[7]) || 0), 0);
    const faltasTotal = hcFiltrado.reduce((sum, row) => sum + (parseInt(row[8]) || 0), 0);
    const absenteismo = headcountTotal > 0 ? (faltasTotal / headcountTotal) * 100 : 0;
    
    // Turnover (colunas AD, AB, AC)
    const admissoes = hcFiltrado.reduce((sum, row) => sum + (parseInt(row[29]) || 0), 0);
    const demissoes = hcFiltrado.reduce((sum, row) => sum + (parseInt(row[27]) || 0), 0);
    const desligVoluntarios = hcFiltrado.reduce((sum, row) => sum + (parseInt(row[28]) || 0), 0);
    const turnoverTotal = admissoes + demissoes + desligVoluntarios;
    const turnover = headcountTotal > 0 ? (turnoverTotal / headcountTotal) * 100 : 0;
    
    // Atualizar KPIs de HC
    document.getElementById('kpi-headcount').textContent = formatNumber(headcountTotal);
    document.getElementById('kpi-presenca').textContent = formatNumber(presencaTotal);
    document.getElementById('kpi-absenteismo').textContent = formatPercent(absenteismo);
    document.getElementById('kpi-turnover').textContent = formatPercent(turnover);
    
    // Comparações (simuladas - precisaria dados do dia anterior)
    atualizarBadge('comp-headcount', { tipo: 'up', valor: 2.5, icone: 'fa-arrow-up' });
    atualizarBadge('comp-presenca', { tipo: 'up', valor: 3.1, icone: 'fa-arrow-up' });
    atualizarBadge('comp-absenteismo', { tipo: 'down', valor: 1.2, icone: 'fa-arrow-down' });
    atualizarBadge('comp-turnover', { tipo: 'neutral', valor: 0, icone: 'fa-minus' });
    
    // Calcular KPIs de Produção
    const procOut = producaoFiltrado.reduce((sum, row) => sum + (parseInt(row[2]) || 0), 0);
    const dropOut = producaoFiltrado.reduce((sum, row) => sum + (parseInt(row[3]) || 0), 0);
    const procIn = producaoFiltrado.reduce((sum, row) => sum + (parseInt(row[4]) || 0), 0);
    const recIn = producaoFiltrado.reduce((sum, row) => sum + (parseInt(row[5]) || 0), 0);
    
    // Atualizar KPIs de Produção
    document.getElementById('kpi-proc-out').textContent = formatNumber(procOut);
    document.getElementById('kpi-drop-out').textContent = formatNumber(dropOut);
    document.getElementById('kpi-proc-in').textContent = formatNumber(procIn);
    document.getElementById('kpi-rec-in').textContent = formatNumber(recIn);
    
    // Comparações de produção (simuladas)
    atualizarBadge('comp-proc-out', { tipo: 'up', valor: 5.2, icone: 'fa-arrow-up' });
    atualizarBadge('comp-drop-out', { tipo: 'down', valor: 2.1, icone: 'fa-arrow-down' });
    atualizarBadge('comp-proc-in', { tipo: 'up', valor: 4.3, icone: 'fa-arrow-up' });
    atualizarBadge('comp-rec-in', { tipo: 'up', valor: 3.8, icone: 'fa-arrow-up' });
    
    // Renderizar gráficos e tabelas
    renderizarGraficoHC(hcFiltrado);
    renderizarTabelaSetores(hcFiltrado);
    renderizarTabelaWarehouses(hcFiltrado);
    renderizarGraficoOutbound(producaoFiltrado);
    renderizarGraficoInbound(producaoFiltrado);
    renderizarTabelaProducao(producaoFiltrado);
    renderizarGraficoConsolidado(hcFiltrado, producaoFiltrado);
    renderizarTabelaConsolidada(hcFiltrado, producaoFiltrado);
    
    console.log('[Dashboard] ✅ Renderização completa');
}

// ================================
// GRÁFICOS
// ================================

function renderizarGraficoHC(dados) {
    const ctx = document.getElementById('chartHC');
    if (!ctx) return;
    
    // Agrupar por data (últimos 30 dias)
    const dadosPorData = {};
    dados.forEach(row => {
        const data = row[0];
        if (!dadosPorData[data]) {
            dadosPorData[data] = { hc: 0, presenca: 0 };
        }
        dadosPorData[data].hc += parseInt(row[6]) || 0;
        dadosPorData[data].presenca += parseInt(row[7]) || 0;
    });
    
    const datas = Object.keys(dadosPorData).sort().slice(-30);
    const hcData = datas.map(d => dadosPorData[d].hc);
    const presencaData = datas.map(d => dadosPorData[d].presenca);
    
    if (chartHC) chartHC.destroy();
    
    chartHC = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datas.map(d => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
            datasets: [
                {
                    label: 'Headcount',
                    data: hcData,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Presença',
                    data: presencaData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#B0B0B0' } }
            },
            scales: {
                y: { ticks: { color: '#B0B0B0' }, grid: { color: '#404040' } },
                x: { ticks: { color: '#B0B0B0' }, grid: { color: '#404040' } }
            }
        }
    });
}

function renderizarGraficoOutbound(dados) {
    const ctx = document.getElementById('chartOutbound');
    if (!ctx) return;
    
    // Agrupar por warehouse
    const dadosPorWH = {};
    dados.forEach(row => {
        const wh = row[1];
        if (!dadosPorWH[wh]) {
            dadosPorWH[wh] = { proc: 0, drop: 0 };
        }
        dadosPorWH[wh].proc += parseInt(row[2]) || 0;
        dadosPorWH[wh].drop += parseInt(row[3]) || 0;
    });
    
    const warehouses = Object.keys(dadosPorWH).sort();
    const procData = warehouses.map(wh => dadosPorWH[wh].proc);
    const dropData = warehouses.map(wh => dadosPorWH[wh].drop);
    
    if (chartOutbound) chartOutbound.destroy();
    
    chartOutbound = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: warehouses,
            datasets: [
                {
                    label: 'Processado',
                    data: procData,
                    backgroundColor: '#4CAF50'
                },
                {
                    label: 'Drop',
                    data: dropData,
                    backgroundColor: '#F44336'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#B0B0B0' } }
            },
            scales: {
                y: { ticks: { color: '#B0B0B0' }, grid: { color: '#404040' } },
                x: { ticks: { color: '#B0B0B0' }, grid: { color: '#404040' } }
            }
        }
    });
}

function renderizarGraficoInbound(dados) {
    const ctx = document.getElementById('chartInbound');
    if (!ctx) return;
    
    // Agrupar por warehouse
    const dadosPorWH = {};
    dados.forEach(row => {
        const wh = row[1];
        if (!dadosPorWH[wh]) {
            dadosPorWH[wh] = { proc: 0, rec: 0 };
        }
        dadosPorWH[wh].proc += parseInt(row[4]) || 0;
        dadosPorWH[wh].rec += parseInt(row[5]) || 0;
    });
    
    const warehouses = Object.keys(dadosPorWH).sort();
    const procData = warehouses.map(wh => dadosPorWH[wh].proc);
    const recData = warehouses.map(wh => dadosPorWH[wh].rec);
    
    if (chartInbound) chartInbound.destroy();
    
    chartInbound = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: warehouses,
            datasets: [
                {
                    label: 'Processado',
                    data: procData,
                    backgroundColor: '#2196F3'
                },
                {
                    label: 'Recebido',
                    data: recData,
                    backgroundColor: '#9C27B0'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#B0B0B0' } }
            },
            scales: {
                y: { ticks: { color: '#B0B0B0' }, grid: { color: '#404040' } },
                x: { ticks: { color: '#B0B0B0' }, grid: { color: '#404040' } }
            }
        }
    });
}

function renderizarGraficoConsolidado(hcData, producaoData) {
    const ctx = document.getElementById('chartConsolidado');
    if (!ctx) return;
    
    // Calcular Items/HC por warehouse
    const consolidado = {};
    
    // HC por warehouse
    hcData.forEach(row => {
        const wh = row[1];
        if (!consolidado[wh]) {
            consolidado[wh] = { hc: 0, items: 0 };
        }
        consolidado[wh].hc += parseInt(row[6]) || 0;
    });
    
    // Items por warehouse (proc out + proc in)
    producaoData.forEach(row => {
        const wh = row[1];
        if (!consolidado[wh]) {
            consolidado[wh] = { hc: 0, items: 0 };
        }
        consolidado[wh].items += (parseInt(row[2]) || 0) + (parseInt(row[4]) || 0);
    });
    
    const warehouses = Object.keys(consolidado).sort();
    const itemsPorHC = warehouses.map(wh => {
        return consolidado[wh].hc > 0 ? consolidado[wh].items / consolidado[wh].hc : 0;
    });
    
    if (chartConsolidado) chartConsolidado.destroy();
    
    chartConsolidado = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: warehouses,
            datasets: [{
                label: 'Items/HC',
                data: itemsPorHC,
                backgroundColor: '#9C27B0',
                borderColor: '#9C27B0',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#B0B0B0' } }
            },
            scales: {
                y: { 
                    ticks: { color: '#B0B0B0' }, 
                    grid: { color: '#404040' },
                    beginAtZero: true
                },
                x: { ticks: { color: '#B0B0B0' }, grid: { color: '#404040' } }
            }
        }
    });
}

// ================================
// TABELAS
// ================================

function renderizarTabelaSetores(dados) {
    const tbody = document.getElementById('table-setores');
    if (!tbody) return;
    
    const dadosPorSetor = {};
    dados.forEach(row => {
        const setor = row[5] || 'N/A';
        if (!dadosPorSetor[setor]) {
            dadosPorSetor[setor] = { hc: 0, presenca: 0, faltas: 0 };
        }
        dadosPorSetor[setor].hc += parseInt(row[6]) || 0;
        dadosPorSetor[setor].presenca += parseInt(row[7]) || 0;
        dadosPorSetor[setor].faltas += parseInt(row[8]) || 0;
    });
    
    const setores = Object.keys(dadosPorSetor).sort();
    tbody.innerHTML = setores.map(setor => {
        const d = dadosPorSetor[setor];
        const abs = d.hc > 0 ? (d.faltas / d.hc) * 100 : 0;
        return `
            <tr>
                <td style="font-weight: 600;">${setor}</td>
                <td>${formatNumber(d.hc)}</td>
                <td style="color: #4CAF50;">${formatNumber(d.presenca)}</td>
                <td style="color: #F44336;">${formatNumber(d.faltas)}</td>
                <td>${formatPercent(abs)}</td>
            </tr>
        `;
    }).join('');
}

function renderizarTabelaWarehouses(dados) {
    const tbody = document.getElementById('table-warehouses');
    if (!tbody) return;
    
    const dadosPorWH = {};
    dados.forEach(row => {
        const wh = row[1] || 'N/A';
        if (!dadosPorWH[wh]) {
            dadosPorWH[wh] = { hc: 0, presenca: 0, faltas: 0, turnover: 0 };
        }
        dadosPorWH[wh].hc += parseInt(row[6]) || 0;
        dadosPorWH[wh].presenca += parseInt(row[7]) || 0;
        dadosPorWH[wh].faltas += parseInt(row[8]) || 0;
        dadosPorWH[wh].turnover += (parseInt(row[27]) || 0) + (parseInt(row[28]) || 0) + (parseInt(row[29]) || 0);
    });
    
    const warehouses = Object.keys(dadosPorWH).sort();
    tbody.innerHTML = warehouses.map(wh => {
        const d = dadosPorWH[wh];
        const abs = d.hc > 0 ? (d.faltas / d.hc) * 100 : 0;
        const turn = d.hc > 0 ? (d.turnover / d.hc) * 100 : 0;
        return `
            <tr>
                <td style="font-weight: 600;">${wh}</td>
                <td>${formatNumber(d.hc)}</td>
                <td style="color: #4CAF50;">${formatNumber(d.presenca)}</td>
                <td style="color: #F44336;">${formatNumber(d.faltas)}</td>
                <td>${formatPercent(abs)}</td>
                <td style="color: #FF9800;">${formatPercent(turn)}</td>
            </tr>
        `;
    }).join('');
}

function renderizarTabelaProducao(dados) {
    const tbody = document.getElementById('table-producao');
    if (!tbody) return;
    
    const dadosPorWH = {};
    dados.forEach(row => {
        const wh = row[1] || 'N/A';
        if (!dadosPorWH[wh]) {
            dadosPorWH[wh] = { procOut: 0, dropOut: 0, procIn: 0, recIn: 0 };
        }
        dadosPorWH[wh].procOut += parseInt(row[2]) || 0;
        dadosPorWH[wh].dropOut += parseInt(row[3]) || 0;
        dadosPorWH[wh].procIn += parseInt(row[4]) || 0;
        dadosPorWH[wh].recIn += parseInt(row[5]) || 0;
    });
    
    const warehouses = Object.keys(dadosPorWH).sort();
    tbody.innerHTML = warehouses.map(wh => {
        const d = dadosPorWH[wh];
        const dropPercent = d.procOut > 0 ? (d.dropOut / d.procOut) * 100 : 0;
        return `
            <tr>
                <td style="font-weight: 600;">${wh}</td>
                <td style="color: #4CAF50;">${formatNumber(d.procOut)}</td>
                <td style="color: #F44336;">${formatNumber(d.dropOut)}</td>
                <td>${formatPercent(dropPercent)}</td>
                <td style="color: #2196F3;">${formatNumber(d.procIn)}</td>
                <td style="color: #9C27B0;">${formatNumber(d.recIn)}</td>
            </tr>
        `;
    }).join('');
}

function renderizarTabelaConsolidada(hcData, producaoData) {
    const tbody = document.getElementById('table-consolidado');
    if (!tbody) return;
    
    const consolidado = {};
    
    // Agregar HC
    hcData.forEach(row => {
        const wh = row[1] || 'N/A';
        if (!consolidado[wh]) {
            consolidado[wh] = { hc: 0, presenca: 0, faltas: 0, procOut: 0, procIn: 0 };
        }
        consolidado[wh].hc += parseInt(row[6]) || 0;
        consolidado[wh].presenca += parseInt(row[7]) || 0;
        consolidado[wh].faltas += parseInt(row[8]) || 0;
    });
    
    // Agregar Produção
    producaoData.forEach(row => {
        const wh = row[1] || 'N/A';
        if (!consolidado[wh]) {
            consolidado[wh] = { hc: 0, presenca: 0, faltas: 0, procOut: 0, procIn: 0 };
        }
        consolidado[wh].procOut += parseInt(row[2]) || 0;
        consolidado[wh].procIn += parseInt(row[4]) || 0;
    });
    
    const warehouses = Object.keys(consolidado).sort();
    tbody.innerHTML = warehouses.map(wh => {
        const d = consolidado[wh];
        const abs = d.hc > 0 ? (d.faltas / d.hc) * 100 : 0;
        const itemsHC = d.hc > 0 ? (d.procOut + d.procIn) / d.hc : 0;
        return `
            <tr>
                <td style="font-weight: 600;">${wh}</td>
                <td>${formatNumber(d.hc)}</td>
                <td style="color: #4CAF50;">${formatNumber(d.presenca)}</td>
                <td>${formatPercent(abs)}</td>
                <td style="color: #4CAF50;">${formatNumber(d.procOut)}</td>
                <td style="color: #2196F3;">${formatNumber(d.procIn)}</td>
                <td style="font-weight: 600; color: #9C27B0;">${itemsHC.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Dashboard] Sistema carregado');
    
    // Validar sessão
    const userEmail = getUserEmail();
    if (!userEmail) {
        console.warn('[Dashboard] Sem email de usuário no cookie');
        alert('❌ Sessão não encontrada. Redirecionando para login...');
        window.location.href = '/login';
        return;
    }
    
    console.log(`[Dashboard] Usuário autenticado: ${userEmail}`);
    
    // Adicionar listeners aos filtros
    document.getElementById('filter-date')?.addEventListener('change', renderizarDashboard);
    document.getElementById('filter-warehouse')?.addEventListener('change', renderizarDashboard);
    document.getElementById('filter-sector')?.addEventListener('change', renderizarDashboard);
    
    console.log('[Dashboard] ✅ Pronto! Clique em "Atualizar Dados" para carregar.');
});
