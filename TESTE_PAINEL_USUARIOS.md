# Teste do Painel Completo de Gerenciamento de Usuários

## 🔗 URLs

- **Portal**: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
- **Painel Admin**: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/admin/users?email=SEU_EMAIL_ADMIN
- **Planilha**: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg

## 🎯 Funcionalidades Implementadas

### 1. **Interface com Abas**
- ✅ **Pendentes**: Usuários com status PENDENTE
- ✅ **Aprovados**: Usuários com status APROVADO
- ✅ **Rejeitados**: Usuários com status REJEITADO
- ✅ **Todos**: Lista completa de todos os usuários

### 2. **Estatísticas em Cards**
- ✅ Total de Usuários (contador dinâmico)
- ✅ Pendentes (amarelo)
- ✅ Aprovados (verde)
- ✅ Rejeitados (vermelho)

### 3. **Ações Disponíveis**
- ✅ **Aprovar**: Botão verde (apenas para pendentes)
- ✅ **Rejeitar**: Botão vermelho (apenas para pendentes)
- ✅ **Editar**: Botão azul (todos os usuários)
- ✅ **Deletar**: Botão cinza (todos os usuários)

### 4. **Modal de Edição**
Campos editáveis:
- ✅ Nome
- ✅ Cargo (dropdown com cargos ativos)
- ✅ Cidade (dropdown com cidades ativas + "Todas")
- ✅ Nível de Acesso (0, 1, 5, 10)
- ✅ Status (Pendente, Aprovado, Rejeitado)

## 🧪 Fluxo de Teste Completo

### Pré-requisitos
1. Ter um usuário admin com Nivel = 10
2. Ter pelo menos 3 usuários cadastrados:
   - 1 Pendente
   - 1 Aprovado
   - 1 Rejeitado

### Teste 1: Acessar Painel Admin

**Passos:**
1. Fazer login como administrador (Nivel 10)
2. No portal, clicar em "Gerenciar Usuários"
3. Verificar que a URL é `/admin/users?email=SEU_EMAIL`

**Resultado Esperado:**
- ✅ Página carrega com 4 cards de estatísticas
- ✅ Aba "Pendentes" está ativa por padrão
- ✅ Tabela mostra usuários pendentes

---

### Teste 2: Navegar entre Abas

**Passos:**
1. Clicar na aba "Aprovados"
2. Clicar na aba "Rejeitados"
3. Clicar na aba "Todos"
4. Voltar para "Pendentes"

**Resultado Esperado:**
- ✅ Cada aba mostra apenas os usuários do status correspondente
- ✅ Aba "Todos" mostra todos os usuários (soma de todas as categorias)
- ✅ Contador no nome da aba está correto
- ✅ Transição entre abas é suave

---

### Teste 3: Aprovar Usuário Pendente

**Passos:**
1. Na aba "Pendentes", encontrar um usuário
2. Clicar no botão verde (✓) "Aprovar"
3. Confirmar ação no alert
4. Aguardar reload da página

**Resultado Esperado:**
- ✅ Alert de confirmação aparece
- ✅ Após confirmar, aparece "Usuário aprovado!"
- ✅ Página recarrega
- ✅ Usuário some da aba "Pendentes"
- ✅ Usuário aparece na aba "Aprovados"
- ✅ Na planilha: Status = APROVADO, Nivel = 1

---

### Teste 4: Rejeitar Usuário Pendente

**Passos:**
1. Na aba "Pendentes", encontrar um usuário
2. Clicar no botão vermelho (✗) "Rejeitar"
3. Confirmar ação no alert
4. Aguardar reload da página

**Resultado Esperado:**
- ✅ Alert de confirmação aparece
- ✅ Após confirmar, aparece "Usuário rejeitado"
- ✅ Página recarrega
- ✅ Usuário some da aba "Pendentes"
- ✅ Usuário aparece na aba "Rejeitados"
- ✅ Na planilha: Status = REJEITADO

---

### Teste 5: Editar Usuário (Modal)

**Passos:**
1. Em qualquer aba, clicar no botão azul (✎) "Editar" de um usuário
2. Verificar que modal abre com dados preenchidos
3. Alterar os seguintes campos:
   - Nome: "João Silva Editado"
   - Cargo: "Supervisor"
   - Cidade: "Pernambuco"
   - Nível: 5
   - Status: "APROVADO"
4. Clicar em "Salvar"
5. Aguardar mensagem de sucesso

**Resultado Esperado:**
- ✅ Modal abre com overlay escuro
- ✅ Todos os campos carregam com valores atuais
- ✅ Dropdowns mostram opções corretas
- ✅ Após salvar: "Usuário atualizado com sucesso!"
- ✅ Página recarrega
- ✅ Alterações refletem na tabela
- ✅ Na planilha: Todos os campos atualizados

---

### Teste 6: Cancelar Edição

**Passos:**
1. Clicar em "Editar" de um usuário
2. Alterar alguns campos
3. Clicar em "Cancelar"

**Resultado Esperado:**
- ✅ Modal fecha sem salvar
- ✅ Nenhuma alteração é feita
- ✅ Página não recarrega

---

### Teste 7: Deletar Usuário

**Passos:**
1. Em qualquer aba, clicar no botão cinza (🗑️) "Deletar" de um usuário
2. Ler o alerta de confirmação: "ATENÇÃO: Deletar usuário X? Esta ação NÃO pode ser desfeita!"
3. Confirmar

**Resultado Esperado:**
- ✅ Alert de aviso aparece
- ✅ Após confirmar: "Usuário deletado com sucesso"
- ✅ Página recarrega
- ✅ Usuário não aparece em nenhuma aba
- ✅ Na planilha: Linha do usuário foi removida
- ✅ **IMPORTANTE**: Ação é irreversível

---

### Teste 8: Fechar Modal com "X"

**Passos:**
1. Abrir modal de edição
2. Clicar no ícone "X" no canto superior direito

**Resultado Esperado:**
- ✅ Modal fecha sem salvar
- ✅ Comportamento igual ao botão "Cancelar"

---

### Teste 9: Verificar Colunas da Tabela

**Passos:**
1. Verificar cabeçalho da tabela
2. Verificar dados de um usuário

**Resultado Esperado:**
Colunas presentes:
- ✅ Usuário (avatar + nome)
- ✅ Email
- ✅ Cargo
- ✅ Cidade (badge azul com ícone)
- ✅ Nível (badge roxo)
- ✅ Status (badge colorido: verde/vermelho/amarelo)
- ✅ Data (formato DD/MM/AAAA)
- ✅ Ações (botões)

---

### Teste 10: Editar Múltiplos Campos ao Mesmo Tempo

**Passos:**
1. Abrir edição de um usuário aprovado
2. Alterar:
   - Cidade: "São Paulo" → "Pernambuco"
   - Nível: 1 → 5
   - Status: "APROVADO" → "PENDENTE"
3. Salvar

**Resultado Esperado:**
- ✅ Todos os campos atualizam corretamente
- ✅ Usuário muda de aba (Aprovados → Pendentes)
- ✅ Na planilha: Todas as alterações refletidas

---

## 🎨 Verificações Visuais

### Layout
- ✅ Header roxo com título e botões de navegação
- ✅ Cards de estatísticas coloridos (azul, amarelo, verde, vermelho)
- ✅ Abas com estilo ativo (roxo) e inativo (cinza)
- ✅ Tabela com hover effect nas linhas
- ✅ Botões coloridos e com ícones

### Responsividade
- ✅ Cards empilham em telas pequenas (grid-cols-1)
- ✅ Abas ficam empilhadas em mobile
- ✅ Tabela tem scroll horizontal se necessário
- ✅ Modal se ajusta ao tamanho da tela

### Interatividade
- ✅ Botões mudam de cor no hover
- ✅ Modal tem animação de fade-in
- ✅ Transição suave entre abas
- ✅ Formulário valida campos obrigatórios

---

## 📊 Tabela de Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/admin/users` | Painel de gerenciamento (requer nível 10) |
| GET | `/api/cidades` | Lista cidades ativas |
| GET | `/api/cargos` | Lista cargos ativos |
| POST | `/api/admin/users/approve` | Aprovar usuário pendente |
| POST | `/api/admin/users/reject` | Rejeitar usuário pendente |
| PATCH | `/api/admin/users/:email` | Editar dados completos do usuário |
| DELETE | `/api/admin/users/:email` | Deletar usuário (irreversível) |

---

## 🐛 Troubleshooting

### Problema: Modal não abre
- **Solução**: Verificar console do navegador
- **Possível causa**: Erro no JavaScript ao carregar dados

### Problema: Deletar não funciona
- **Solução**: Verificar se método `deleteUser` existe no sheetsManager
- **Comando teste**: `curl -X DELETE http://localhost:3002/api/admin/users/teste@email.com`

### Problema: Edição não salva
- **Solução**: Verificar se endpoint PATCH está recebendo todos os campos
- **Verificar**: Console do servidor para erros

### Problema: Abas não mudam
- **Solução**: Verificar se JavaScript está carregando
- **Verificar**: Função `changeTab()` existe

---

## ✅ Checklist de Validação Completo

### Interface
- [ ] 4 cards de estatísticas visíveis
- [ ] 4 abas: Pendentes, Aprovados, Rejeitados, Todos
- [ ] Contador correto em cada aba
- [ ] Tabela mostra todas as colunas
- [ ] Botões com ícones corretos

### Funcionalidades
- [ ] Aprovar usuário (Pendente → Aprovado)
- [ ] Rejeitar usuário (Pendente → Rejeitado)
- [ ] Editar usuário (modal abre e salva)
- [ ] Deletar usuário (linha removida da planilha)
- [ ] Cancelar edição (modal fecha sem salvar)
- [ ] Fechar modal com "X"

### Integração
- [ ] Mudanças refletem na planilha
- [ ] Reload da página após ações
- [ ] Alertas de sucesso/erro aparecem
- [ ] Filtro por status funciona

### Permissões
- [ ] Apenas admin (nível 10) acessa
- [ ] Usuário não-admin vê "Acesso Negado"

---

## 🎯 Resumo de Ações

| Ação | Botão | Cor | Disponível Para | Efeito |
|------|-------|-----|-----------------|--------|
| Aprovar | ✓ | Verde | Pendentes | Status → APROVADO, define Nivel |
| Rejeitar | ✗ | Vermelho | Pendentes | Status → REJEITADO |
| Editar | ✎ | Azul | Todos | Abre modal, edita todos os campos |
| Deletar | 🗑️ | Cinza | Todos | Remove linha da planilha (irreversível) |

---

## 📝 Notas Adicionais

1. **Deleção é Irreversível**: Ao deletar um usuário, a linha é removida permanentemente da planilha
2. **Nível Padrão**: Ao aprovar, nível padrão é 1 (pode ser alterado via edição)
3. **Cidade "Todas"**: Aparece no dropdown de edição, usuário vê opções de todas as cidades
4. **Status Editável**: Admin pode mudar status manualmente (PENDENTE ↔ APROVADO ↔ REJEITADO)
5. **Validação**: Email não é editável (usado como ID único)

---

**Status**: ✅ Todas as funcionalidades implementadas
**Data**: 2026-02-12
**Versão**: 3.0.0 (Gerenciamento Completo de Usuários)
