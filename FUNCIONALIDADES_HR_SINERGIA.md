# ✨ Funcionalidades de Hora Extra e Sinergia - Sistema ABS

## 🎯 Novas Funcionalidades Implementadas

### 1️⃣ **Hora Extra (HR)**

Sistema completo para registro de horas extras dos colaboradores.

#### 📋 Características:
- ✅ Botão dedicado na tela de marcação (cor laranja #FF9800)
- ✅ Modal responsivo com seleção de colaborador
- ✅ Opção "Dia Inteiro" ou horário específico (início e fim)
- ✅ Validações automáticas (início deve ser menor que fim)
- ✅ Salvamento direto na planilha do Google Sheets
- ✅ Feedback visual com loading e alertas de sucesso

#### 📊 Dados Salvos:
**Planilha**: `1pm0dtDn6x9k4Ct5u98pyD7FoAzl52GEzRazuFdPgU-w`  
**Aba**: `raw_hr`

| Coluna | Conteúdo | Exemplo |
|--------|----------|---------|
| A | Nome do Colaborador | "TAINA LIMA DA ROCHA" |
| B | WFM User | "S008570" |
| C | Warehouse | "SP" |
| D | Data | "18/Fevereiro/2026" |
| E | Horário | "08:00 às 12:00" ou "DIA INTEIRO" |
| F | Dia Inteiro | "SIM" ou "NÃO" |
| G | Timestamp | "17/02/2026 14:30:45" |

#### 🖥️ Como Usar:
1. Acesse a tela de marcação (Mês → Supervisor → Dia)
2. Clique no botão **"Hora Extra"** (laranja)
3. Selecione o colaborador
4. Escolha:
   - ✅ Marque "Dia Inteiro" OU
   - ✅ Informe horário de início e fim
5. Clique em **"Salvar"**
6. ✅ Confirmação de sucesso!

---

### 2️⃣ **Sinergia**

Sistema para registro de sinergia entre setores (S1 - Parcial ou S2 - Total).

#### 📋 Características:
- ✅ Botão dedicado na tela de marcação (cor roxa #9C27B0)
- ✅ Modal responsivo com seleção de colaborador
- ✅ Tipo de sinergia: **S1** (Parcial) ou **S2** (Total)
- ✅ Setor de origem detectado automaticamente
- ✅ Setor de destino informado manualmente
- ✅ Campo de observações opcional
- ✅ Salvamento direto na planilha do Google Sheets
- ✅ Feedback visual com loading e alertas de sucesso

#### 📊 Dados Salvos:
**Planilha**: `1pm0dtDn6x9k4Ct5u98pyD7FoAzl52GEzRazuFdPgU-w`  
**Aba**: `raw_sinergia`

| Coluna | Conteúdo | Exemplo |
|--------|----------|---------|
| A | Nome do Colaborador | "TAINA LIMA DA ROCHA" |
| B | WFM User | "S008570" |
| C | Warehouse | "SP" |
| D | Data | "18/Fevereiro/2026" |
| E | Setor Origem | "INBOUND" |
| F | Setor Destino | "OUTBOUND" |
| G | Tipo | "S1" ou "S2" |
| H | Descrição do Tipo | "Sinergia Parcial" ou "Sinergia Total" |
| I | Observações | "Apoio temporário" (opcional) |
| J | Timestamp | "17/02/2026 14:30:45" |

#### 🖥️ Como Usar:
1. Acesse a tela de marcação (Mês → Supervisor → Dia)
2. Clique no botão **"Sinergia"** (roxo)
3. Selecione o colaborador
4. Escolha o tipo:
   - **S1** - Sinergia Parcial (parte do dia)
   - **S2** - Sinergia Total (dia inteiro)
5. Informe o setor de destino
6. Adicione observações (opcional)
7. Clique em **"Salvar"**
8. ✅ Confirmação de sucesso!

---

## 🔧 APIs Backend

### POST `/api/abs/hora-extra`

Registra hora extra na planilha.

**Request Body:**
```json
{
  "warehouse": "SP",
  "mes": "Fevereiro",
  "ano": 2026,
  "dia": 18,
  "wfmUser": "S008570",
  "nome": "TAINA LIMA DA ROCHA",
  "diaInteiro": false,
  "horaInicio": "08:00",
  "horaFim": "12:00",
  "timestamp": "2026-02-17T14:30:45.123Z"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Hora extra registrada com sucesso",
  "dados": {
    "nome": "TAINA LIMA DA ROCHA",
    "wfmUser": "S008570",
    "warehouse": "SP",
    "data": "18/Fevereiro/2026",
    "horario": "08:00 às 12:00",
    "diaInteiro": "NÃO",
    "registrado_em": "17/02/2026 14:30:45"
  }
}
```

**Response (Erro - Dia Inteiro):**
```json
{
  "success": true,
  "message": "Hora extra registrada com sucesso",
  "dados": {
    "nome": "TAINA LIMA DA ROCHA",
    "wfmUser": "S008570",
    "warehouse": "SP",
    "data": "18/Fevereiro/2026",
    "horario": "DIA INTEIRO",
    "diaInteiro": "SIM",
    "registrado_em": "17/02/2026 14:30:45"
  }
}
```

---

### POST `/api/abs/sinergia`

Registra sinergia na planilha.

**Request Body:**
```json
{
  "warehouse": "SP",
  "mes": "Fevereiro",
  "ano": 2026,
  "dia": 18,
  "wfmUser": "S008570",
  "nome": "TAINA LIMA DA ROCHA",
  "setorOrigem": "INBOUND",
  "setorDestino": "OUTBOUND",
  "tipo": "S1",
  "observacoes": "Apoio temporário para pico",
  "timestamp": "2026-02-17T14:30:45.123Z"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Sinergia registrada com sucesso",
  "dados": {
    "nome": "TAINA LIMA DA ROCHA",
    "wfmUser": "S008570",
    "warehouse": "SP",
    "data": "18/Fevereiro/2026",
    "setorOrigem": "INBOUND",
    "setorDestino": "OUTBOUND",
    "tipo": "S1",
    "tipoTexto": "Sinergia Parcial",
    "observacoes": "Apoio temporário para pico",
    "registrado_em": "17/02/2026 14:30:45"
  }
}
```

---

## 🧪 Testes

### Teste de Hora Extra:

```bash
curl -X POST http://localhost:3000/api/abs/hora-extra \
  -H "Content-Type: application/json" \
  -d '{
    "warehouse": "SP",
    "mes": "Fevereiro",
    "ano": 2026,
    "dia": 18,
    "wfmUser": "S008570",
    "nome": "TAINA LIMA DA ROCHA",
    "diaInteiro": false,
    "horaInicio": "18:00",
    "horaFim": "22:00",
    "timestamp": "2026-02-17T14:30:45.123Z"
  }'
```

### Teste de Sinergia:

```bash
curl -X POST http://localhost:3000/api/abs/sinergia \
  -H "Content-Type: application/json" \
  -d '{
    "warehouse": "SP",
    "mes": "Fevereiro",
    "ano": 2026,
    "dia": 18,
    "wfmUser": "S008570",
    "nome": "TAINA LIMA DA ROCHA",
    "setorOrigem": "INBOUND",
    "setorDestino": "OUTBOUND",
    "tipo": "S2",
    "observacoes": "Suporte para Black Friday",
    "timestamp": "2026-02-17T14:30:45.123Z"
  }'
```

---

## 📦 Estrutura de Arquivos Atualizados

### Frontend:
- `public/abs-fixed.html` - Adicionados modais e funções JS

### Backend:
- `src/index.tsx` - Adicionadas 2 novas rotas POST

### Commit:
- `e5ae342` - "feat(abs): Adiciona funcionalidades de Hora Extra e Sinergia"

---

## ✅ Validações Implementadas

### Hora Extra:
- ✅ Colaborador obrigatório
- ✅ Horário obrigatório (se não for dia inteiro)
- ✅ Horário de início deve ser menor que horário de fim
- ✅ Verificação de existência da aba `raw_hr`

### Sinergia:
- ✅ Colaborador obrigatório
- ✅ Tipo obrigatório (S1 ou S2)
- ✅ Setor de destino obrigatório
- ✅ Validação de tipo (apenas S1 ou S2 permitidos)
- ✅ Verificação de existência da aba `raw_sinergia`

---

## 🎨 Design

### Cores:
- **Hora Extra**: Laranja (#FF9800) - representa atenção/tempo extra
- **Sinergia**: Roxo (#9C27B0) - representa colaboração/união

### Layout:
- Modais centralizados com fundo escuro (#2b2b2b)
- Formulários responsivos
- Botões com ícones Font Awesome
- Feedback visual durante salvamento

---

## 🚀 Deploy

**Status**: ✅ Código commitado e pushed para `main`

**Commit**: `e5ae342`

**URL de Produção** (após 2-3 min): https://portal-spxfulfillment.up.railway.app/abs

---

## 📊 Relatórios e Consultas

### Consultar Horas Extras no Google Sheets:

```
=QUERY(raw_hr!A:G, "SELECT * WHERE A IS NOT NULL ORDER BY G DESC")
```

### Consultar Sinergias no Google Sheets:

```
=QUERY(raw_sinergia!A:J, "SELECT * WHERE A IS NOT NULL ORDER BY J DESC")
```

### Relatório de Horas Extras por Colaborador:

```
=QUERY(raw_hr!A:G, "SELECT A, B, COUNT(A) WHERE A IS NOT NULL GROUP BY A, B ORDER BY COUNT(A) DESC LABEL COUNT(A) 'Total de HRs'")
```

### Relatório de Sinergias por Setor:

```
=QUERY(raw_sinergia!A:J, "SELECT F, G, COUNT(F) WHERE F IS NOT NULL GROUP BY F, G ORDER BY COUNT(F) DESC LABEL COUNT(F) 'Total de Sinergias'")
```

---

## 🎯 Próximos Passos (Opcional)

### Melhorias Futuras:
- [ ] Filtro de colaboradores por setor no modal
- [ ] Histórico de HRs/Sinergias do colaborador
- [ ] Relatório consolidado mensal
- [ ] Exportação para Excel
- [ ] Dashboard de estatísticas
- [ ] Notificações por email

---

**Data**: 17/02/2026 14:45 GMT  
**Versão**: 1.2.0  
**Status**: ✅ **FUNCIONALIDADES COMPLETAS E TESTADAS**
