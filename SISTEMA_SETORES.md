# Sistema de Setores e Níveis Customizáveis

## Visão Geral

O sistema de setores permite organizar os links do portal por área/departamento, facilitando a navegação dos usuários. Os níveis de acesso também podem ser personalizados pelos administradores.

## Estrutura no Google Sheets

### Aba: `config_setores_niveis`

**Tabela de Setores (A1:C...)**
```
| SETORES  |                                    |        |
| ID       | Nome                               | Status |
| 1        | GERAL                              | ATIVO  |
| 2        | INBOUND                            | ATIVO  |
| 3        | OUTBOUND                           | ATIVO  |
| 4        | INVENTÁRIO                         | ATIVO  |
| 5        | TREINAMENTOS                       | ATIVO  |
| 6        | QUALIDADE                          | ATIVO  |
| 7        | MWH E EXCELENCIA OPERACIONAL       | ATIVO  |
| 8        | FLOW                               | ATIVO  |
| 9        | SECURITY                           | ATIVO  |
```

**Tabela de Níveis (E1:G...)**
```
| NÍVEIS DE ACESSO |       |                |
| ID               | Nível | Descrição      |
| 1                | 0     | Básico         |
| 2                | 1     | Analista       |
| 3                | 5     | Supervisor     |
| 4                | 10    | Administrador  |
```

### Aba: `portal_opcoes`

**Nova Coluna I: Setor**
```
| A   | B         | C            | D    | E             | F      | G      | H          | I         |
| ID  | Nome      | Descricao    | Link | Nivel_Minimo  | Icone  | Status | Cidade     | Setor     |
| 1   | Dashboard | Dashboard SP | ...  | 1             | fa-... | ATIVO  | São Paulo  | INBOUND   |
| 2   | Relatório | Relatório PE | ...  | 5             | fa-... | ATIVO  | Pernambuco | OUTBOUND  |
```

## Funcionalidades

### 1. Filtro de Setores no Portal

**URL:** `/portal?email=SEU_EMAIL&setor=SETOR_NOME`

**Exemplos:**
- `/portal?email=user@shopee.com&setor=TODOS` - Mostra todos os setores
- `/portal?email=user@shopee.com&setor=INBOUND` - Mostra apenas links do setor INBOUND
- `/portal?email=user@shopee.com&setor=OUTBOUND` - Mostra apenas links do setor OUTBOUND

**Interface:**
- Barra de filtros com botões para cada setor
- Botão "Todos" para remover o filtro
- Botão ativo fica destacado em laranja
- Contagem de opções atualiza automaticamente

### 2. Painel Admin: Criar Links com Setor

**URL:** `/admin/opcoes?email=ADMIN_EMAIL`

**Campos do formulário:**
- Nome *
- Descrição
- URL do Link *
- Ícone (Font Awesome)
- Nível Mínimo (0, 1, 5, 10)
- Cidade (dropdown com cidades ativas + "Todas")
- **Setor (dropdown com setores ativos)** ← NOVO

**Tabela de links:**
- Coluna adicional "Setor" exibe o setor de cada link
- Badge cinza com ícone de briefcase

### 3. Painel Admin: Gerenciar Setores (Futuro)

**URL:** `/admin/config?email=ADMIN_EMAIL`

**Funcionalidades planejadas:**
- ✅ Listar setores ativos
- ✅ Adicionar novo setor
- ✅ Deletar setor
- ⏳ Interface de gerenciamento (implementar)

### 4. Painel Admin: Gerenciar Níveis (Futuro)

**Funcionalidades planejadas:**
- ✅ Listar níveis customizados
- ✅ Adicionar novo nível (número e descrição)
- ✅ Deletar nível
- ⏳ Interface de gerenciamento (implementar)

## API Endpoints

### Setores

**Listar Setores Ativos**
```
GET /api/setores
Response: [{ id: 1, nome: "GERAL", status: "ATIVO" }, ...]
```

**Adicionar Setor**
```
POST /api/admin/config/setores
Body: { "nome": "NOVO_SETOR" }
Response: { "success": true, "message": "Setor adicionado" }
```

**Deletar Setor**
```
DELETE /api/admin/config/setores/:id
Response: { "success": true, "message": "Setor deletado" }
```

### Níveis

**Listar Níveis Customizados**
```
GET /api/niveis
Response: [{ id: 1, nivel: 0, descricao: "Básico" }, ...]
```

**Adicionar Nível**
```
POST /api/admin/config/niveis
Body: { "nivel": 3, "descricao": "Coordenador" }
Response: { "success": true, "message": "Nível adicionado" }
```

**Deletar Nível**
```
DELETE /api/admin/config/niveis/:id
Response: { "success": true, "message": "Nível deletado" }
```

## SheetsManager - Novos Métodos

```typescript
// Setores
async getSetoresAtivos(): Promise<{id: number, nome: string, status: string}[]>
async addSetor(nome: string): Promise<{success: boolean, id: number}>
async deleteSetor(id: string): Promise<{success: boolean}>

// Níveis
async getNiveisCustomizados(): Promise<{id: number, nivel: number, descricao: string}[]>
async addNivel(nivel: number, descricao: string): Promise<{success: boolean, id: number}>
async deleteNivel(id: string): Promise<{success: boolean}>

// Portal Opcoes (atualizado)
async getPortalOpcoes(nivelUsuario: number, cidadeUsuario: string, setorFiltro?: string)
async insertPortalOpcao(data: {..., setor?: string})
async updatePortalOpcao(id: string, data: {..., setor?: string})
async getAllPortalOpcoes() // agora retorna campo setor
```

## Lógica de Filtro

### No SheetsManager.getPortalOpcoes()

```typescript
// 1. Filtro por Status
if (status !== 'ATIVO') continue

// 2. Filtro por Nível de Acesso
if (nivelUsuario < nivelMinimo) continue

// 3. Filtro por Cidade
const isAdmin = nivelUsuario >= 10
const cidadeMatch = isAdmin || cidade === 'Todas' || cidade === cidadeUsuario
if (!cidadeMatch) continue

// 4. Filtro por Setor (NOVO)
const setorMatch = !setorFiltro || setorFiltro === 'TODOS' || setor === setorFiltro
if (!setorMatch) continue

// Adiciona opção aos resultados
opcoes.push({...})
```

## Setores Padrão

1. **GERAL** - Links gerais/comuns a todos
2. **INBOUND** - Recebimento e processamento de entrada
3. **OUTBOUND** - Expedição e processamento de saída
4. **INVENTÁRIO** - Controle de estoque
5. **TREINAMENTOS** - Materiais de treinamento
6. **QUALIDADE** - Controle de qualidade
7. **MWH E EXCELENCIA OPERACIONAL** - Melhorias e excelência
8. **FLOW** - Fluxo de processos
9. **SECURITY** - Segurança

## Como Usar

### Para Usuários

1. Acesse o portal: `https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/portal?email=SEU_EMAIL`
2. Veja a barra de filtros de setores acima dos cards
3. Clique em um setor para ver apenas links daquele setor
4. Clique em "Todos" para ver todas as opções novamente

### Para Administradores

**Criar Link com Setor:**
1. Acesse `/admin/opcoes?email=ADMIN_EMAIL`
2. Clique em "Adicionar Novo Link"
3. Preencha os campos (incluindo dropdown de Setor)
4. Clique em "Salvar Link"

**Gerenciar Setores (via Sheets):**
1. Abra a planilha: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
2. Acesse a aba `config_setores_niveis`
3. Adicione/remova setores manualmente na tabela de setores
4. ⚠️ Cuidado: deletar setor não remove links vinculados a ele

**Gerenciar Setores (via API - futuramente via UI):**
```bash
# Adicionar novo setor
curl -X POST https://portal.com/api/admin/config/setores \
  -H "Content-Type: application/json" \
  -d '{"nome":"LOGÍSTICA"}'

# Deletar setor (ID 10)
curl -X DELETE https://portal.com/api/admin/config/setores/10
```

## Scripts de Inicialização

**Arquivo:** `init_setores_niveis_v2.cjs`

**Função:** Cria aba `config_setores_niveis` no Google Sheets com:
- Tabela de setores (9 setores padrão)
- Tabela de níveis (4 níveis padrão)
- Adiciona coluna Setor na aba `portal_opcoes`

**Executar:**
```bash
cd /home/user/webapp
node init_setores_niveis_v2.cjs
```

## Benefícios

### Para Usuários
✅ **Organização:** Links agrupados por área de atuação  
✅ **Navegação rápida:** Filtro visual para encontrar links facilmente  
✅ **Foco:** Ver apenas links relevantes ao seu setor  

### Para Administradores
✅ **Gestão flexível:** Criar novos setores conforme necessário  
✅ **Escalabilidade:** Sistema suporta quantos setores forem necessários  
✅ **Personalização:** Níveis de acesso customizáveis  
✅ **Auditoria:** Controle de quais setores existem e estão ativos  

## Próximos Passos (Sugestões)

1. **Interface de gerenciamento de setores** no painel `/admin/config`
   - Cards para adicionar/deletar setores
   - Mesmo padrão visual de cidades e cargos

2. **Interface de gerenciamento de níveis** no painel `/admin/config`
   - Formulário para adicionar novo nível (número + descrição)
   - Lista de níveis com botão de deletar

3. **Validações:**
   - Impedir deletar setor se houver links ativos vinculados
   - Impedir deletar nível se houver usuários ou links usando aquele nível

4. **Permissões por setor:**
   - Usuário pode ter acesso apenas a setores específicos
   - Nova coluna no usuário: `setores_permitidos`

5. **Dashboard de estatísticas:**
   - Quantos links por setor
   - Setores mais acessados
   - Usuários por setor

## URLs Importantes

- Portal: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
- Planilha: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg

## Status Atual

✅ **Implementado:**
- Estrutura de dados (aba config_setores_niveis)
- Filtro de setores no portal
- Dropdown de setor ao criar links
- Endpoints de API para setores e níveis
- Métodos no SheetsManager
- Coluna Setor na tabela de links

⏳ **Pendente:**
- Interface visual para gerenciar setores no painel admin/config
- Interface visual para gerenciar níveis no painel admin/config
- Validações avançadas (não deletar se em uso)
- Permissões por setor (usuário restrito a setores específicos)

## Créditos Utilizados

~88.000 / 200.000 tokens utilizados no desenvolvimento completo do sistema.
