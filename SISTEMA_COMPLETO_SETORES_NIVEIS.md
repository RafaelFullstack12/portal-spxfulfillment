# ✅ Sistema Completo - Setores e Níveis

## 🎯 Implementação Final

### 1. **Sistema de Setores** (Filtro Simples - SEM interface de manutenção)

**Função:** Filtro visual no portal para organizar links por área/departamento

**Localização:** Apenas no portal do usuário (`/portal?email=...`)

**Setores Padrão (9):**
1. GERAL
2. INBOUND
3. OUTBOUND
4. INVENTÁRIO
5. TREINAMENTOS
6. QUALIDADE
7. MWH E EXCELENCIA OPERACIONAL
8. FLOW
9. SECURITY

**Como Usar:**
- Usuário clica no botão do setor desejado
- Portal filtra e mostra apenas links daquele setor
- Botão "Todos" remove o filtro
- URL: `/portal?email=user@shopee.com&setor=INBOUND`

**Manutenção:**
- ❌ **SEM interface de gerenciamento** (conforme solicitado)
- Para adicionar/remover setores: usar API diretamente ou editar Google Sheets

---

### 2. **Sistema de Níveis de Acesso** (COM interface completa)

**Função:** Gerenciar níveis de permissão no sistema

**Localização:** Painel admin `/admin/config?email=ADMIN_EMAIL`

**Interface Completa:**
- ✅ Listar níveis (ordenados de 0 a 100)
- ✅ Adicionar novo nível (número + descrição)
- ✅ Deletar nível com confirmação
- ✅ Cards coloridos por nível:
  - Cinza (0) - Básico
  - Azul (1-4) - Analista
  - Laranja (5-9) - Supervisor
  - Roxo (10+) - Administrador

**Níveis Padrão (4):**
```
Nível 0  - Básico
Nível 1  - Analista
Nível 5  - Supervisor
Nível 10 - Administrador
```

**Como Usar:**
1. Acesse `/admin/config?email=ADMIN_EMAIL`
2. Role até a seção "Níveis de Acesso"
3. Clique em "+ Adicionar Nível"
4. Digite o número (0-100) e a descrição
5. Clique em "Salvar"

**Exemplo - Criar Nível Coordenador:**
```
Número: 3
Descrição: Coordenador

Resultado: Nível 3 - Coordenador (card azul)
```

---

## 📊 Estrutura no Google Sheets

### Aba: `config_setores_niveis`

**Tabela de Setores (A1:C11)**
```
| SETORES  | Nome                             | Status |
|----------|----------------------------------|--------|
| 1        | GERAL                            | ATIVO  |
| 2        | INBOUND                          | ATIVO  |
| 3        | OUTBOUND                         | ATIVO  |
| ...      | ...                              | ...    |
```

**Tabela de Níveis (E1:G6)**
```
| NÍVEIS DE ACESSO | Nível | Descrição     |
|------------------|-------|---------------|
| 1                | 0     | Básico        |
| 2                | 1     | Analista      |
| 3                | 5     | Supervisor    |
| 4                | 10    | Administrador |
```

### Aba: `portal_opcoes`

**Colunas (A:I)**
```
A: ID
B: Nome
C: Descricao
D: Link
E: Nivel_Minimo
F: Icone
G: Status
H: Cidade
I: Setor  ← NOVO
```

---

## 🔗 Endpoints de API

### Setores (Apenas Listagem)
```
GET /api/setores
→ [{ id: 1, nome: "GERAL", status: "ATIVO" }, ...]
```

### Níveis (CRUD Completo)
```
GET /api/niveis
→ [{ id: 1, nivel: 0, descricao: "Básico" }, ...]

POST /api/admin/config/niveis
Body: { nivel: 3, descricao: "Coordenador" }
→ { success: true, message: "Nível adicionado" }

DELETE /api/admin/config/niveis/:id
→ { success: true, message: "Nível deletado" }
```

---

## 📱 Telas do Sistema

### 1. Portal do Usuário (`/portal`)

**Filtro de Setores:**
```
┌─────────────────────────────────────────────────┐
│ Filtrar por Setor                               │
├─────────────────────────────────────────────────┤
│ [Todos] [GERAL] [INBOUND] [OUTBOUND] ...       │
└─────────────────────────────────────────────────┘

Cards de opções aparecem filtrados por setor
```

### 2. Admin: Criar Link (`/admin/opcoes`)

**Formulário com dropdown de Setor:**
```
Nome: [_________________________]
URL:  [_________________________]
Cidade: [Dropdown ▼]
Setor:  [Dropdown ▼]  ← NOVO
Nível:  [Dropdown ▼]
```

**Tabela com coluna Setor:**
```
ID | Nome       | Link | Cidade | Setor    | Nível | Status
1  | Dashboard  | ...  | SP     | INBOUND  | 1     | ATIVO
2  | Relatório  | ...  | PE     | OUTBOUND | 5     | ATIVO
```

### 3. Admin: Configurações (`/admin/config`)

**Seção Níveis de Acesso:**
```
┌─────────────────────────────────────────────────┐
│ Níveis de Acesso (4)     [+ Adicionar Nível]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────┬──────────────────┐   │
│  │ [0] Básico      [🗑] │ [1] Analista [🗑]│   │
│  │ Nível 0 - ID: 1      │ Nível 1 - ID: 2  │   │
│  └──────────────────────┴──────────────────┘   │
│                                                 │
│  ┌──────────────────────┬──────────────────┐   │
│  │ [5] Supervisor  [🗑] │ [10] Admin   [🗑]│   │
│  │ Nível 5 - ID: 3      │ Nível 10 - ID: 4 │   │
│  └──────────────────────┴──────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Funcionalidades

### Setores (Filtro Simples)
- ✅ Filtro visual no portal
- ✅ Dropdown de setor ao criar link
- ✅ Coluna setor na tabela de links
- ✅ URL com parâmetro `?setor=`
- ✅ 9 setores padrão criados
- ❌ Interface de manutenção (não implementada - conforme solicitado)

### Níveis (Gerenciamento Completo)
- ✅ Interface de gerenciamento completa
- ✅ Adicionar novo nível
- ✅ Deletar nível com confirmação
- ✅ Validação (0-100)
- ✅ Cards coloridos por faixa
- ✅ Ordenação automática
- ✅ 4 níveis padrão criados
- ✅ API endpoints CRUD

---

## 🎨 Design e UX

### Cores dos Cards de Níveis

| Faixa   | Cor      | Hex       | Uso          |
|---------|----------|-----------|--------------|
| 0       | Cinza    | bg-gray   | Básico       |
| 1-4     | Azul     | bg-blue   | Analista     |
| 5-9     | Laranja  | bg-orange | Supervisor   |
| 10+     | Roxo     | bg-purple | Admin        |

### Botões de Setor

| Estado  | Cor      | Descrição           |
|---------|----------|---------------------|
| Ativo   | Laranja  | bg-orange-500       |
| Inativo | Cinza    | bg-gray-100         |
| Hover   | Escuro   | hover:bg-gray-200   |

---

## 🚀 Como Testar

### 1. Testar Filtro de Setores (Portal)

```
URL: https://3004-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/portal?email=SEU_EMAIL

1. Faça login
2. Veja a barra de filtros de setores
3. Clique em "INBOUND" → só aparecem links do INBOUND
4. Clique em "Todos" → aparecem todos os links
```

### 2. Testar Gerenciamento de Níveis (Admin)

```
URL: https://3004-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/admin/config?email=ADMIN_EMAIL

1. Role até "Níveis de Acesso"
2. Clique em "+ Adicionar Nível"
3. Digite: Nível 3, Descrição "Coordenador"
4. Clique em "Salvar"
5. Veja o novo card azul aparecer
6. Clique no ícone 🗑 para deletar (confirmação)
```

### 3. Testar Criar Link com Setor (Admin)

```
URL: https://3004-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/admin/opcoes?email=ADMIN_EMAIL

1. Clique em "+ Adicionar Novo Link"
2. Preencha Nome, URL, Cidade
3. Selecione um Setor no dropdown
4. Clique em "Salvar Link"
5. Veja a coluna Setor na tabela
```

---

## 📦 Arquivos Modificados

**Views:**
- `src/views/admin-config.ts` → Seção de níveis adicionada
- `src/views/admin-opcoes.ts` → Dropdown de setor
- `src/views/portal.ts` → Filtro de setores

**Backend:**
- `src/index.tsx` → Endpoints de setores e níveis
- `src/services/sheets.ts` → Métodos CRUD

**Scripts:**
- `init_setores_niveis_v2.cjs` → Inicialização

**Documentação:**
- `SISTEMA_SETORES.md` → Doc completa
- `SISTEMA_COMPLETO_SETORES_NIVEIS.md` → Este arquivo

---

## 🔗 Links Importantes

- **Portal:** https://3004-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
- **Planilha:** https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
- **Admin Config:** `/admin/config?email=ADMIN_EMAIL`
- **Admin Opções:** `/admin/opcoes?email=ADMIN_EMAIL`

---

## ✅ Sistema 100% Funcional

**Status:** Pronto para produção  
**Commits:** 2 commits realizados  
**Créditos:** ~87.000 / 200.000 tokens  
**Data:** 2026-02-12
