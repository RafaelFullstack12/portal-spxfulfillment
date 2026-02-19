// ========================================
// ✅ CONFIGURAÇÃO COM SUA API KEY
// ========================================
const SHEET_ID = '1fD7pvbKwGwMHsww0IMQjkEqE4ohuBKv81MNoyV8tgbc';
const API_KEY = 'AIzaSyCaEdXbkqRYHaSeo-O6bzpPSqADUufOcOg';

let dadosHC = [];
let dadosProducao = [];
let charts = {};

// ========================================
// CARREGAR DADOS COM TRATAMENTO ROBUSTO
// ========================================
async function carregarDados() {
    mostrarLoading(true);
    
    try {
        console.log('🔄 Iniciando carregamento de dados...');
        
        // Carregar raw_hc
        const urlHC = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/raw_hc?key=${API_KEY}`;
        const responseHC = await fetch(urlHC);
        
        if (!responseHC.ok) {
            const errorData = await responseHC.json();
            throw new Error(interpretarErroAPI(errorData, 'raw_hc'));
        }
        
        const dataHC = await responseHC.json();
        if (!dataHC.values || dataHC.values.length === 0) {
            throw new Error('Aba "raw_hc" não encontrada ou está vazia');
        }
        
        dadosHC = processarHC(dataHC.values);
        console.log('✅ HC carregado:', dadosHC.length, 'registros');
        
        // Carregar raw_dados
        const urlDados = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/raw_dados?key=${API_KEY}`;
        const responseDados = await fetch(urlDados);
        
        if (!responseDados.ok) {
            const errorData = await responseDados.json();
            throw new Error(interpretarErroAPI(errorData, 'raw_dados'));
        }
        
        const dataDados = await responseDados.json();
        if (!dataDados.values || dataDados.values.length === 0) {
            throw new Error('Aba "raw_dados" não encontrada ou está vazia');
        }
        
        dadosProducao = processarProducao(dataDados.values);
        console.log('✅ Produção carregada:', dadosProducao.length, 'registros');
        
        // Preencher filtros e atualizar
        preencherFiltros();
        atualizarTodosOsDados();
        atualizarTimestamp();
        
        mostrarLoading(false);
        console.log('🎉 Dashboard carregado com sucesso!');
        
    } catch (error) {
        mostrarLoading(false);
        console.error('❌ Erro detalhado:', error);
        alert('❌ Erro ao carregar dados:\n\n' + error.message + '\n\nAbra o console (F12) para mais detalhes.');
    }
}

function interpretarErroAPI(errorData, aba) {
    const message = errorData.error?.message || '';
    
    if (message.includes('API_KEY_INVALID') || message.includes('API key not valid')) {
        return 'API Key inválida! Verifique se a Google Sheets API está ativada no Google Cloud Console.';
    }
    if (message.includes('PERMISSION_DENIED')) {
        return 'Permissão negada! Verifique se a planilha está compartilhada como "Qualquer pessoa com o link pode visualizar".';
    }
    if (message.includes('Unable to parse range')) {
        return `Aba "${aba}" não encontrada. Verifique se o nome está correto na planilha.`;
    }
    return `Erro ao acessar aba "${aba}": ${message}`;
}

function processarHC(rows) {
    const dados = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0] || row.length < 30) continue;
        
        dados.push({
            data: row[0],
            wh: row[1] || '',
            setor: row[5] || '',
            headcount: parseInt(row[6]) || 0,
            presenca: parseInt(row[7]) || 0,
            faltas: parseInt(row[8]) || 0,
            folgas: parseInt(row[9]) || 0,
            turnover: (parseInt(row[27]) || 0) + (parseInt(row[28]) || 0) + (parseInt(row[29]) || 0)
        });
    }
    return dados.filter(d => d.headcount > 0);
}

function processarProducao(rows) {
    const dados = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0] || row.length < 6) continue;
        
        const wh = row[1] || '';
        
        dados.push({
            data: row[0],
            wh: wh,
            procOut: parseInt(row[2]) || 0,
            dropOut: parseInt(row[3]) || 0,
            procIn: parseInt(row[4]) || 0,
            recIn: wh === 'BRFSP2' ? (parseInt(row[4]) || 0) : (parseInt(row[5]) || 0)
        });
    }
    return dados;
}

function preencherFiltros() {
    const warehouses = [...new Set([...dadosHC.map(d => d.wh), ...dadosProducao.map(d => d.wh)])].filter(Boolean).sort();
    const setores = [...new Set(dadosHC.map(d => d.setor))].filter(Boolean).sort();
    const datas = [...new Set([...dadosHC.map(d => d.data), ...dadosProducao.map(d => d.data)])].filter(Boolean).sort();
    
    const whSelect = document.getElementById('filter-warehouse');
    whSelect.innerHTML = '<option value="all">Todos os Warehouses</option>';
    warehouses.forEach(wh => {
        whSelect.innerHTML += `<option value="${wh}">${wh}</option>`;
    });
    
    const setorSelect = document.getElementById('filter-sector');
    setorSelect.innerHTML = '<option value="all">Todos os Setores</option>';
    setores.forEach(setor => {
        setorSelect.innerHTML += `<option value="${setor}">${setor}</option>`;
    });
    
    if (datas.length > 0) {
        document.getElementById('filter-date').value = datas[datas.length - 1];
    }
}

function atualizarTodosOsDados() {
    const dataFiltro = document.getElementById('filter-date').value;
    const whFiltro = document.getElementById('filter-warehouse').value;
    const setorFiltro = document.getElementById('filter-sector').value;
    
    if (!dataFiltro) return;
    
    atualizarDadosHC(dataFiltro, whFiltro, setorFiltro);
    atualizarDadosProducao(dataFiltro, whFiltro);
    atualizarDadosConsolidado(dataFiltro, whFiltro);
}

function atualizarDadosHC(dataFiltro, whFiltro, setorFiltro) {
    const dadosDia = filtrarDados(dadosHC, dataFiltro, whFiltro, setorFiltro);
    const dataAnterior = obterDataAnterior(dataFiltro);
    const dadosDiaAnterior = filtrarDados(dadosHC, dataAnterior, whFiltro, setorFiltro);
    
    const metricas = agregarHC(dadosDia);
    const metricasAnteriores = agregarHC(dadosDiaAnterior);
    
    atualizarKPIsHC(metricas, metricasAnteriores);
    atualizarTabelaSetores(dadosDia);
    atualizarTabelaWarehouses(dadosDia);
    atualizarGraficoHC(dataFiltro, whFiltro, setorFiltro);
}

function atualizarDadosProducao(dataFiltro, whFiltro) {
    const dadosDia = filtrarDadosProducao(dadosProducao, dataFiltro, whFiltro);
    const dataAnterior = obterDataAnterior(dataFiltro);
    const dadosDiaAnterior = filtrarDadosProducao(dadosProducao, dataAnterior, whFiltro);
    
    const metricas = agregarProducao(dadosDia);
    const metricasAnteriores = agregarProducao(dadosDiaAnterior);
    
    atualizarKPIsProducao(metricas, metricasAnteriores);
    atualizarTabelaProducao(dadosDia);
    atualizarGraficosProducao(dataFiltro, whFiltro);
}

function atualizarDadosConsolidado(dataFiltro, whFiltro) {
    const dadosHCDia = filtrarDados(dadosHC, dataFiltro, whFiltro, 'all');
    const dadosProdDia = filtrarDadosProducao(dadosProducao, dataFiltro, whFiltro);
    
    atualizarTabelaConsolidado(dadosHCDia, dadosProdDia);
    atualizarGraficoConsolidado(dadosHCDia, dadosProdDia);
}

function filtrarDados(dados, data, wh, setor) {
    return dados.filter(d => {
        let match = d.data === data;
        if (wh !== 'all') match = match && d.wh === wh;
        if (setor !== 'all') match = match && d.setor === setor;
        return match;
    });
}

function filtrarDadosProducao(dados, data, wh) {
    return dados.filter(d => {
        let match = d.data === data;
        if (wh !== 'all') match = match && d.wh === wh;
        return match;
    });
}

function agregarHC(dados) {
    if (dados.length === 0) {
        return { headcount: 0, presenca: 0, faltas: 0, folgas: 0, turnover: 0, taxaAbsenteismo: 0, taxaTurnover: 0 };
    }
    
    const agregado = dados.reduce((acc, d) => {
        acc.headcount += d.headcount;
        acc.presenca += d.presenca;
        acc.faltas += d.faltas;
        acc.folgas += d.folgas;
        acc.turnover += d.turnover;
        return acc;
    }, { headcount: 0, presenca: 0, faltas: 0, folgas: 0, turnover: 0 });
    
    const total = agregado.presenca + agregado.faltas;
    agregado.taxaAbsenteismo = total > 0 ? (agregado.faltas / total) * 100 : 0;
    
    const denominadorTurn = agregado.presenca + agregado.faltas + agregado.folgas + agregado.turnover;
    agregado.taxaTurnover = denominadorTurn > 0 ? (agregado.turnover / denominadorTurn) * 100 : 0;
    
    return agregado;
}

function agregarProducao(dados) {
    if (dados.length === 0) {
        return { procOut: 0, dropOut: 0, procIn: 0, recIn: 0 };
    }
    
    return dados.reduce((acc, d) => {
        acc.procOut += d.procOut;
        acc.dropOut += d.dropOut;
        acc.procIn += d.procIn;
        acc.recIn += d.recIn;
        return acc;
    }, { procOut: 0, dropOut: 0, procIn: 0, recIn: 0 });
}

function atualizarKPIsHC(atual, anterior) {
    document.getElementById('kpi-headcount').textContent = atual.headcount.toLocaleString('pt-BR');
    atualizarComparacao('comp-headcount', atual.headcount, anterior.headcount, false);
    
    document.getElementById('kpi-presenca').textContent = atual.presenca.toLocaleString('pt-BR');
    atualizarComparacao('comp-presenca', atual.presenca, anterior.presenca, false);
    
    document.getElementById('kpi-absenteismo').textContent = atual.taxaAbsenteismo.toFixed(1) + '%';
    atualizarComparacao('comp-absenteismo', atual.taxaAbsenteismo, anterior.taxaAbsenteismo, true, '%');
    
    document.getElementById('kpi-turnover').textContent = atual.taxaTurnover.toFixed(1) + '%';
    atualizarComparacao('comp-turnover', atual.taxaTurnover, anterior.taxaTurnover, true, '%');
}

function atualizarKPIsProducao(atual, anterior) {
    document.getElementById('kpi-proc-out').textContent = atual.procOut.toLocaleString('pt-BR');
    atualizarComparacao('comp-proc-out', atual.procOut, anterior.procOut, false);
    
    document.getElementById('kpi-drop-out').textContent = atual.dropOut.toLocaleString('pt-BR');
    atualizarComparacao('comp-drop-out', atual.dropOut, anterior.dropOut, true);
    
    document.getElementById('kpi-proc-in').textContent = atual.procIn.toLocaleString('pt-BR');
    atualizarComparacao('comp-proc-in', atual.procIn, anterior.procIn, false);
    
    document.getElementById('kpi-rec-in').textContent = atual.recIn.toLocaleString('pt-BR');
    atualizarComparacao('comp-rec-in', atual.recIn, anterior.recIn, false);
}

function atualizarComparacao(elementId, valorAtual, valorAnterior, menorEhMelhor = false, sufixo = '') {
    const elemento = document.getElementById(elementId);
    const diferenca = valorAtual - valorAnterior;
    const diferencaAbs = Math.abs(diferenca);
    
    let classe = 'badge-neutral';
    let icone = 'fa-minus';
    let texto = 'Sem dados';
    
    if (diferenca !== 0 && valorAnterior !== 0) {
        if (diferenca > 0) {
            icone = 'fa-arrow-up';
            classe = menorEhMelhor ? 'badge-down' : 'badge-up';
            texto = menorEhMelhor ? 'Piorou' : 'Melhorou';
        } else {
            icone = 'fa-arrow-down';
            classe = menorEhMelhor ? 'badge-up' : 'badge-down';
            texto = menorEhMelhor ? 'Melhorou' : 'Piorou';
        }
        texto += ` ${diferencaAbs.toFixed(0)}${sufixo}`;
    }
    
    elemento.className = `comparison-badge ${classe}`;
    elemento.innerHTML = `<i class="fas ${icone}"></i> ${texto}`;
}

function atualizarTabelaSetores(dados) {
    const tbody = document.getElementById('table-setores');
    tbody.innerHTML = '';
    
    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #B0B0B0; padding: 40px;">Nenhum dado encontrado</td></tr>';
        return;
    }
    
    const porSetor = {};
    dados.forEach(d => {
        if (!porSetor[d.setor]) {
            porSetor[d.setor] = { headcount: 0, presenca: 0, faltas: 0 };
        }
        porSetor[d.setor].headcount += d.headcount;
        porSetor[d.setor].presenca += d.presenca;
        porSetor[d.setor].faltas += d.faltas;
    });
    
    Object.keys(porSetor).sort().forEach(setor => {
        const dados = porSetor[setor];
        const total = dados.presenca + dados.faltas;
        const taxaAbs = total > 0 ? (dados.faltas / total) * 100 : 0;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: bold; color: #2196F3;">${setor}</td>
            <td>${dados.headcount}</td>
            <td style="color: #4CAF50;">${dados.presenca}</td>
            <td style="color: #F44336;">${dados.faltas}</td>
            <td style="font-weight: bold;">${taxaAbs.toFixed(1)}%</td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTabelaWarehouses(dados) {
    const tbody = document.getElementById('table-warehouses');
    tbody.innerHTML = '';
    
    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #B0B0B0; padding: 40px;">Nenhum dado encontrado</td></tr>';
        return;
    }
    
    const porWH = {};
    dados.forEach(d => {
        if (!porWH[d.wh]) {
            porWH[d.wh] = { headcount: 0, presenca: 0, faltas: 0, turnover: 0 };
        }
        porWH[d.wh].headcount += d.headcount;
        porWH[d.wh].presenca += d.presenca;
        porWH[d.wh].faltas += d.faltas;
        porWH[d.wh].turnover += d.turnover;
    });
    
    Object.keys(porWH).sort().forEach(wh => {
        const dados = porWH[wh];
        const total = dados.presenca + dados.faltas;
        const taxaAbs = total > 0 ? (dados.faltas / total) * 100 : 0;
        const denominadorTurn = dados.presenca + dados.faltas + dados.turnover;
        const taxaTurn = denominadorTurn > 0 ? (dados.turnover / denominadorTurn) * 100 : 0;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: bold; color: #2196F3;">${wh}</td>
            <td>${dados.headcount}</td>
            <td style="color: #4CAF50;">${dados.presenca}</td>
            <td style="color: #F44336;">${dados.faltas}</td>
            <td style="font-weight: bold;">${taxaAbs.toFixed(1)}%</td>
            <td style="font-weight: bold; color: #FF9800;">${taxaTurn.toFixed(1)}%</td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTabelaProducao(dados) {
    const tbody = document.getElementById('table-producao');
    tbody.innerHTML = '';
    
    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #B0B0B0; padding: 40px;">Nenhum dado encontrado</td></tr>';
        return;
    }
    
    const porWH = {};
    dados.forEach(d => {
        if (!porWH[d.wh]) {
            porWH[d.wh] = { procOut: 0, dropOut: 0, procIn: 0, recIn: 0 };
        }
        porWH[d.wh].procOut += d.procOut;
        porWH[d.wh].dropOut += d.dropOut;
        porWH[d.wh].procIn += d.procIn;
        porWH[d.wh].recIn += d.recIn;
    });
    
    Object.keys(porWH).sort().forEach(wh => {
        const dados = porWH[wh];
        const percDrop = dados.procOut > 0 ? (dados.dropOut / dados.procOut) * 100 : 0;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: bold; color: #2196F3;">${wh}</td>
            <td style="color: #4CAF50;">${dados.procOut.toLocaleString('pt-BR')}</td>
            <td style="color: #F44336;">${dados.dropOut.toLocaleString('pt-BR')}</td>
            <td style="font-weight: bold;">${percDrop.toFixed(1)}%</td>
            <td style="color: #2196F3;">${dados.procIn.toLocaleString('pt-BR')}</td>
            <td style="color: #9C27B0;">${dados.recIn.toLocaleString('pt-BR')}</td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTabelaConsolidado(dadosHCDia, dadosProdDia) {
    const tbody = document.getElementById('table-consolidado');
    tbody.innerHTML = '';
    
    if (dadosHCDia.length === 0 || dadosProdDia.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #B0B0B0; padding: 40px;">Nenhum dado encontrado</td></tr>';
        return;
    }
    
    const porWH = {};
    
    dadosHCDia.forEach(d => {
        if (!porWH[d.wh]) {
            porWH[d.wh] = { headcount: 0, presenca: 0, faltas: 0, procOut: 0, procIn: 0 };
        }
        porWH[d.wh].headcount += d.headcount;
        porWH[d.wh].presenca += d.presenca;
        porWH[d.wh].faltas += d.faltas;
    });
    
    dadosProdDia.forEach(d => {
        if (!porWH[d.wh]) {
            porWH[d.wh] = { headcount: 0, presenca: 0, faltas: 0, procOut: 0, procIn: 0 };
        }
        porWH[d.wh].procOut += d.procOut;
        porWH[d.wh].procIn += d.procIn;
    });
    
    Object.keys(porWH).sort().forEach(wh => {
        const dados = porWH[wh];
        const total = dados.presenca + dados.faltas;
        const taxaAbs = total > 0 ? (dados.faltas / total) * 100 : 0;
        const totalItems = dados.procOut + dados.procIn;
        const itemsPorHC = dados.headcount > 0 ? totalItems / dados.headcount : 0;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: bold; color: #2196F3;">${wh}</td>
            <td>${dados.headcount}</td>
            <td style="color: #4CAF50;">${dados.presenca}</td>
            <td style="font-weight: bold;">${taxaAbs.toFixed(1)}%</td>
            <td style="color: #4CAF50;">${dados.procOut.toLocaleString('pt-BR')}</td>
            <td style="color: #2196F3;">${dados.procIn.toLocaleString('pt-BR')}</td>
            <td style="font-weight: bold; color: #9C27B0;">${itemsPorHC.toFixed(0)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarGraficoHC(dataFiltro, whFiltro, setorFiltro) {
    const dataFim = new Date(dataFiltro);
    const dataInicio = new Date(dataFim);
    dataInicio.setDate(dataInicio.getDate() - 29);
    
    const dadosPorData = {};
    dadosHC.forEach(d => {
        const dataRegistro = new Date(d.data);
        if (dataRegistro < dataInicio || dataRegistro > dataFim) return;
        
        if (whFiltro !== 'all' && d.wh !== whFiltro) return;
        if (setorFiltro !== 'all' && d.setor !== setorFiltro) return;
        
        if (!dadosPorData[d.data]) {
            dadosPorData[d.data] = { headcount: 0, presenca: 0, faltas: 0 };
        }
        
        dadosPorData[d.data].headcount += d.headcount;
        dadosPorData[d.data].presenca += d.presenca;
        dadosPorData[d.data].faltas += d.faltas;
    });
    
    const labels = [];
    const dataHC = [];
    const dataAbs = [];
    
    Object.keys(dadosPorData).sort().forEach(data => {
        const dados = dadosPorData[data];
        const total = dados.presenca + dados.faltas;
        const taxaAbs = total > 0 ? (dados.faltas / total) * 100 : 0;
        
        labels.push(new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        dataHC.push(dados.headcount);
        dataAbs.push(taxaAbs);
    });
    
    renderizarGrafico('chartHC', labels, [
        { label: 'Headcount', data: dataHC, borderColor: '#2196F3', yAxisID: 'y' },
        { label: 'Absenteísmo (%)', data: dataAbs, borderColor: '#F44336', yAxisID: 'y1' }
    ], true);
}

function atualizarGraficosProducao(dataFiltro, whFiltro) {
    const dataFim = new Date(dataFiltro);
    const dataInicio = new Date(dataFim);
    dataInicio.setDate(dataInicio.getDate() - 29);
    
    const dadosPorData = {};
    dadosProducao.forEach(d => {
        const dataRegistro = new Date(d.data);
        if (dataRegistro < dataInicio || dataRegistro > dataFim) return;
        
        if (whFiltro !== 'all' && d.wh !== whFiltro) return;
        
        if (!dadosPorData[d.data]) {
            dadosPorData[d.data] = { procOut: 0, dropOut: 0, procIn: 0, recIn: 0 };
        }
        
        dadosPorData[d.data].procOut += d.procOut;
        dadosPorData[d.data].dropOut += d.dropOut;
        dadosPorData[d.data].procIn += d.procIn;
        dadosPorData[d.data].recIn += d.recIn;
    });
    
    const labels = [];
    const dataProcOut = [];
    const dataDropOut = [];
    const dataProcIn = [];
    const dataRecIn = [];
    
    Object.keys(dadosPorData).sort().forEach(data => {
        const dados = dadosPorData[data];
        
        labels.push(new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        dataProcOut.push(dados.procOut);
        dataDropOut.push(dados.dropOut);
        dataProcIn.push(dados.procIn);
        dataRecIn.push(dados.recIn);
    });
    
    renderizarGrafico('chartOutbound', labels, [
        { label: 'Processado', data: dataProcOut, borderColor: '#4CAF50' },
        { label: 'Drop', data: dataDropOut, borderColor: '#F44336' }
    ], false);
    
    renderizarGrafico('chartInbound', labels, [
        { label: 'Processado', data: dataProcIn, borderColor: '#2196F3' },
        { label: 'Recebido', data: dataRecIn, borderColor: '#9C27B0' }
    ], false);
}

function atualizarGraficoConsolidado(dadosHCDia, dadosProdDia) {
    const porWH = {};
    
    dadosHCDia.forEach(d => {
        if (!porWH[d.wh]) {
            porWH[d.wh] = { headcount: 0, procOut: 0, procIn: 0 };
        }
        porWH[d.wh].headcount += d.headcount;
    });
    
    dadosProdDia.forEach(d => {
        if (!porWH[d.wh]) {
            porWH[d.wh] = { headcount: 0, procOut: 0, procIn: 0 };
        }
        porWH[d.wh].procOut += d.procOut;
        porWH[d.wh].procIn += d.procIn;
    });
    
    const labels = [];
    const dataItemsHC = [];
    
    Object.keys(porWH).sort().forEach(wh => {
        const dados = porWH[wh];
        const totalItems = dados.procOut + dados.procIn;
        const itemsPorHC = dados.headcount > 0 ? totalItems / dados.headcount : 0;
        
        labels.push(wh);
        dataItemsHC.push(itemsPorHC);
    });
    
    renderizarGraficoBarras('chartConsolidado', labels, dataItemsHC);
}

function renderizarGrafico(canvasId, labels, datasets, doisEixos = false) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    Chart.defaults.color = '#B0B0B0';
    Chart.defaults.borderColor = '#404040';
    
    const datasetsFormatados = datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.borderColor,
        backgroundColor: ds.borderColor + '20',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        yAxisID: ds.yAxisID || 'y'
    }));
    
    const scales = {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: '#404040' },
            ticks: { color: '#B0B0B0' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#B0B0B0' }
        }
    };
    
    if (doisEixos) {
        scales.y1 = {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { display: false },
            ticks: { color: '#B0B0B0' }
        };
    }
    
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: datasetsFormatados },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top', labels: { color: '#B0B0B0' } }
            },
            scales
        }
    });
}

function renderizarGraficoBarras(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    Chart.defaults.color = '#B0B0B0';
    Chart.defaults.borderColor = '#404040';
    
    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Items/HC',
                data,
                backgroundColor: '#9C27B0',
                borderColor: '#7B1FA2',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: '#404040' },
                    ticks: { color: '#B0B0B0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#B0B0B0' }
                }
            }
        }
    });
}

function trocarAba(aba) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('tab-' + aba).classList.add('active');
}

function obterDataAnterior(dataStr) {
    const data = new Date(dataStr);
    data.setDate(data.getDate() - 1);
    return data.toISOString().split('T')[0];
}

function atualizarTimestamp() {
    const agora = new Date();
    document.getElementById('last-update').textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function mostrarLoading(show) {
    document.getElementById('loading').classList.toggle('active', show);
}

// Event listeners
document.getElementById('filter-date').addEventListener('change', atualizarTodosOsDados);
document.getElementById('filter-warehouse').addEventListener('change', atualizarTodosOsDados);
document.getElementById('filter-sector').addEventListener('change', atualizarTodosOsDados);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('filter-date').value = hoje;
    console.log('✅ Dashboard inicializado com API Key válida. Clique em "Atualizar Dados" para começar.');
});
