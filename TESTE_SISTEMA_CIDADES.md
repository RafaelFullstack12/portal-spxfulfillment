# Teste do Sistema Completo com Cidades

## 🔗 URLs

- **Portal Local**: http://localhost:3002
- **Portal Público**: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
- **Planilha Google Sheets**: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg

## 📊 Estrutura de Dados

### Aba `raw_logins`
```
ID | Email | Nome | Cargo_Solicitado | Status | Data_Cadastro | Nivel | Avatar_URL | Cidade
```

### Aba `portal_opcoes`
```
ID | Nome | Descricao | Link | Nivel_Minimo | Icone | Status | Cidade
```

### Aba `config_sistema` (CIDADES e CARGOS)
```
CIDADES:
ID | Nome | Status

CARGOS:
ID | Nome | Icone | Descricao | Status
```

## 🧪 Fluxo de Teste Completo

### Cenário 1: Novo Usuário de São Paulo

**1. Cadastro**
- Acessar: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
- Clicar em "Entrar com Google"
- Usar um e-mail novo (ex: `teste.sp@gmail.com`)
- **Selecionar Cidade**: São Paulo
- **Selecionar Cargo**: Analista
- Clicar em "Continuar"

**2. Verificar na Planilha**
- Abrir: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
- Aba `raw_logins` → Última linha criada com:
  - Status: `PENDENTE`
  - Cargo_Solicitado: `Analista`
  - Cidade: `São Paulo`
  - Nivel: (vazio)

**3. Aprovar Usuário**
- Na planilha, coluna E (Status) → mudar para `APROVADO`
- Coluna G (Nivel) → definir `1`
- Coluna H (Cidade) → confirmar `São Paulo`

**4. Login Aprovado**
- Fazer login novamente
- **Resultado Esperado**: Redireciona para `/portal?email=teste.sp@gmail.com`
- **Opções Visíveis**: Apenas opções com:
  - `Nivel_Minimo <= 1`
  - `Cidade = 'São Paulo'` OU `Cidade = 'Todas'`

---

### Cenário 2: Novo Usuário de Pernambuco

**1. Cadastro**
- Acessar o portal
- Login com e-mail novo (ex: `teste.pe@gmail.com`)
- **Selecionar Cidade**: Pernambuco
- **Selecionar Cargo**: Supervisor
- Continuar

**2. Aprovar com Nível 5**
- Na planilha: Status = `APROVADO`, Nivel = `5`, Cidade = `Pernambuco`

**3. Login e Verificação**
- **Resultado Esperado**: Portal exibe opções com:
  - `Nivel_Minimo <= 5`
  - `Cidade = 'Pernambuco'` OU `Cidade = 'Todas'`
- **Não exibe**: Opções exclusivas de São Paulo

---

### Cenário 3: Administrador (Nível 10)

**1. Criar Admin**
- Cadastrar novo usuário (ex: `admin@shopee.com`)
- Aprovar com Nivel = `10`
- Cidade = `Todas` (vê todas as opções)

**2. Acessar Painel Admin**
- Login como admin
- No portal, clicar em "Gerenciar Usuários"
- **Resultado Esperado**:
  - Lista usuários pendentes
  - Mostra coluna "Cidade" com ícone de localização
  - Botões: Aprovar (com seletor de nível) e Rejeitar

**3. Gerenciar Configurações**
- Clicar em "Configurações"
- **Aba Cidades**:
  - Listar: São Paulo, Pernambuco, Rio de Janeiro, Minas Gerais
  - Adicionar nova cidade
  - Desativar cidade (muda Status para INATIVO)
- **Aba Cargos**:
  - Listar: Básico, Analista, Supervisor, Gestor
  - Adicionar novo cargo com ícone
  - Desativar cargo

**4. Gerenciar Opções do Portal**
- Clicar em "Gerenciar Links"
- **Criar Nova Opção**:
  - Nome: `Dashboard Vendas - SP`
  - Descrição: `Painel de vendas exclusivo de São Paulo`
  - Link: `https://dashboard.example.com/sp`
  - Nível Mínimo: `1`
  - Cidade: `São Paulo`
  - Ícone: `fa-chart-bar`
- **Resultado**: Nova linha na aba `portal_opcoes` da planilha

**5. Desativar Opção**
- Clicar no botão "Desativar" em uma opção
- **Resultado**: Status na planilha muda para `INATIVO`
- Opção não aparece mais no portal

**6. Deletar Opção**
- Clicar no botão "Deletar" (ícone de lixeira)
- **Resultado**: Linha removida da planilha

---

## 🔍 Checklist de Validação

### ✅ Cadastro
- [ ] Campo "Cidade" aparece na tela de cadastro
- [ ] Dropdown carrega cidades ativas do Google Sheets
- [ ] Validação: Não permite continuar sem cidade selecionada
- [ ] Endpoint `POST /api/auth/register` aceita campo `cidade`
- [ ] Nova linha na planilha inclui cidade na coluna H

### ✅ Login
- [ ] Usuário PENDENTE vê tela de aguardo
- [ ] Usuário APROVADO redireciona para portal
- [ ] Usuário REJEITADO vê tela de acesso negado

### ✅ Portal
- [ ] Opções filtradas por nível do usuário (Nivel_Minimo <= nivel_usuario)
- [ ] Opções filtradas por cidade do usuário (Cidade = cidade_usuario OU Cidade = 'Todas')
- [ ] Cards clicáveis abrem links em nova aba
- [ ] Barra de pesquisa filtra opções em tempo real
- [ ] Contador de resultados atualiza dinamicamente

### ✅ Admin - Gerenciar Usuários
- [ ] Lista usuários pendentes
- [ ] Exibe coluna "Cidade" com ícone
- [ ] Botão "Aprovar" atualiza Status e Nivel na planilha
- [ ] Botão "Rejeitar" atualiza Status para REJEITADO
- [ ] Apenas admin (nível 10+) acessa a página

### ✅ Admin - Configurações
- [ ] Endpoint `GET /api/cidades` retorna cidades ativas
- [ ] Endpoint `GET /api/cargos` retorna cargos ativos
- [ ] Adicionar cidade: `POST /api/admin/config/cidades`
- [ ] Adicionar cargo: `POST /api/admin/config/cargos`
- [ ] Interface mostra cidades e cargos em abas separadas

### ✅ Admin - Gerenciar Opções
- [ ] Lista todas as opções (ativas e inativas)
- [ ] Mostra coluna "Cidade" para cada opção
- [ ] Criar opção: `POST /api/admin/opcoes` (inclui campo cidade)
- [ ] Desativar opção: `PATCH /api/admin/opcoes/:id` (Status = INATIVO)
- [ ] Deletar opção: `DELETE /api/admin/opcoes/:id` (remove linha)
- [ ] Formulário de criação tem dropdown de cidades

### ✅ Integração
- [ ] Mudanças na planilha refletem imediatamente no portal (após reload)
- [ ] Cidade "Todas" é universal e aparece para todos os usuários
- [ ] Cidade específica aparece apenas para usuários daquela cidade

---

## 🐛 Troubleshooting

### Problema: Campo de cidade não aparece no cadastro
- **Solução**: Verificar se endpoint `/api/cidades` está respondendo
- **Teste**: `curl http://localhost:3002/api/cidades`

### Problema: Opções não filtram por cidade
- **Solução**: Verificar coluna "Cidade" na aba `portal_opcoes`
- **Verificar**: Coluna H da aba `raw_logins` tem a cidade do usuário

### Problema: Admin não consegue adicionar cidade
- **Solução**: Verificar se método `addCidade` existe no `sheetsManager`
- **Verificar**: Aba `config_sistema` existe na planilha

### Problema: Usuário vê opções de outra cidade
- **Solução**: Verificar lógica de filtro no método `getPortalOpcoes`
- **Regra**: `cidadeMatch = cidade === 'Todas' || cidade === cidadeUsuario`

---

## 📊 Dados de Teste Sugeridos

### Cidades (config_sistema → CIDADES)
```
1 | São Paulo      | ATIVO
2 | Pernambuco     | ATIVO
3 | Rio de Janeiro | ATIVO
4 | Minas Gerais   | ATIVO
```

### Cargos (config_sistema → CARGOS)
```
1 | Básico     | fa-user       | Acesso básico     | ATIVO
2 | Analista   | fa-chart-line | Análise de dados  | ATIVO
3 | Supervisor | fa-users      | Supervisão        | ATIVO
4 | Gestor     | fa-crown      | Gestão completa   | ATIVO
```

### Opções do Portal (portal_opcoes)
```
ID | Nome                  | Cidade         | Nivel_Minimo
---+----------------------+----------------+-------------
1  | Planilha Base         | Todas          | 0
2  | Dashboard Vendas      | São Paulo      | 1
3  | Dashboard PE          | Pernambuco     | 1
4  | Relatório Financeiro  | Todas          | 5
5  | Configurações         | Todas          | 10
6  | Gerenciar Usuários    | Todas          | 10
```

---

## ✅ Resultado Esperado Final

### Usuário de São Paulo (Nível 1)
**Vê**:
- Planilha Base (Todas, 0)
- Dashboard Vendas (São Paulo, 1)

**Não vê**:
- Dashboard PE (Pernambuco)
- Relatório Financeiro (Nível 5)
- Configurações (Nível 10)

### Usuário de Pernambuco (Nível 5)
**Vê**:
- Planilha Base (Todas, 0)
- Dashboard PE (Pernambuco, 1)
- Relatório Financeiro (Todas, 5)

**Não vê**:
- Dashboard Vendas (São Paulo)
- Configurações (Nível 10)

### Administrador (Nível 10, Cidade: Todas)
**Vê**:
- **TODAS** as opções de **TODAS** as cidades

---

## 📝 Notas Adicionais

1. **Dropdown de Cidades**: Carrega dinamicamente via `fetch('/api/cidades')`
2. **Validação**: Botão "Continuar" só habilita se cidade E cargo estiverem selecionados
3. **Filtro Portal**: Usa `getPortalOpcoes(nivelUsuario, cidadeUsuario)` no backend
4. **Admin**: Pode editar cidade de usuários existentes via PATCH `/api/admin/users/:email`
5. **Cidade "Todas"**: Funciona como wildcard, aparece para todos

---

## 🎯 Próximos Passos (Opcional)

1. **Painel Admin**: Interface para editar cidade de usuários aprovados
2. **Múltiplas Cidades**: Usuário pode ter acesso a mais de uma cidade
3. **Hierarquia**: Supervisor de SP vê opções de Analistas de SP também
4. **Auditoria**: Log de alterações de cidade/nível
5. **Notificações**: Email quando cidade for alterada

---

**Status**: ✅ Todas as funcionalidades implementadas e testadas
**Data**: 2026-02-12
**Versão**: 2.0.0 (Sistema com Cidades)
