# 🧪 TESTE COMPLETO: Login até Portal

## 📋 Pré-requisitos

1. **Google OAuth configurado** no Google Console:
   - Client ID: `866300069424-bnu4ljl7cg6qe95vn4rgitp47g38ih5k`
   - URIs de redirecionamento:
     - `http://localhost:3002/api/auth/callback`
     - `https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/api/auth/callback`

2. **Servidor rodando** na porta 3002

3. **Google Sheets** configurado:
   - Planilha ID: `1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg`
   - Aba: `raw_logins`

---

## 🔗 URLs Importantes

- **Login**: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
- **Planilha**: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg

---

## 📝 CENÁRIO 1: Primeiro Acesso (Novo Usuário)

### Passos:

1. **Abrir o portal**:
   - URL: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai

2. **Clicar em "Entrar com Google"**

3. **Autorizar com um email NOVO** (nunca usado antes)

4. **Selecionar cargo**:
   - Aparecerá a tela com 4 opções:
     - 👤 Básico
     - 📊 Analista
     - 👥 Supervisor
     - 👑 Gestor
   - Selecionar um cargo
   - Clicar em "Continuar"

5. **Tela de Confirmação**:
   - Aparecerá: "✅ Cadastro Realizado!"
   - Mostra: "Seu cadastro está pendente de aprovação"

6. **Verificar no Google Sheets**:
   - Abrir: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
   - Aba: `raw_logins`
   - Verificar que a linha foi criada com:
     - Email do usuário
     - Nome
     - Cargo selecionado
     - Status: **PENDENTE**

---

## 🔄 CENÁRIO 2: Login com Status PENDENTE

### Passos:

1. **Voltar ao login** (clicar em "Voltar ao Login")

2. **Fazer login novamente** com o mesmo email

3. **Resultado esperado**:
   - Aparecerá tela: "⏱️ Aguardando Aprovação"
   - Mensagem: "Seu cadastro está sendo analisado"
   - Botão: "← Voltar"

---

## ✅ CENÁRIO 3: Login com Status APROVADO (PORTAL)

### Preparação:

1. **Abrir a planilha**:
   - https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg

2. **Na linha do usuário**, editar:
   - Coluna E (Status): mudar para **APROVADO**
   - Coluna G (Nivel): definir um número (ex: `0`, `1`, `5` ou `10`)

3. **Salvar a planilha**

### Passos do Teste:

1. **Voltar ao login**

2. **Fazer login novamente** com o mesmo email

3. **Resultado esperado**:
   - **REDIRECIONA AUTOMATICAMENTE para o portal!** 🎉
   - URL: `https://3002-.../portal?email=seu-email@gmail.com`

4. **Verificar o portal**:
   
   **Se Nível 0**:
   - Header com logo Shopee, nome do usuário e nível
   - Aviso amarelo: "Acesso Básico (Nível 0)"
   - 1 card disponível: "Planilha Base"
   
   **Se Nível 1**:
   - Header com informações
   - 2 cards:
     - Planilha Base
     - Dashboard Vendas
   
   **Se Nível 5**:
   - 3 cards:
     - Planilha Base
     - Dashboard Vendas
     - Relatório Financeiro
   
   **Se Nível 10 (Admin)**:
   - Banner roxo: "Painel Administrativo"
   - 5 cards:
     - Planilha Base
     - Dashboard Vendas
     - Relatório Financeiro
     - Configurações (Admin)
     - Gerenciar Usuários (Admin)

---

## ❌ CENÁRIO 4: Login com Status REJEITADO

### Preparação:

1. **Na planilha**, editar:
   - Coluna E (Status): **REJEITADO**

### Passos:

1. **Fazer login**

2. **Resultado esperado**:
   - Tela: "🚫 Acesso Negado"
   - Mensagem: "Entre em contato com o administrador"
   - Botão: "← Voltar"

---

## 🔍 Verificação de Logs

### Ver logs em tempo real:

```bash
tail -f /home/user/webapp/server.log
```

### Logs esperados:

```
[LOGIN] Host: 3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
[LOGIN] Protocol: https
[LOGIN] Redirect URI: https://3002-.../api/auth/callback
[CALLBACK] Iniciando...
[CALLBACK] Code: Recebido
[AUTH] Tokens recebidos: OK
[CALLBACK] Email do usuário: seu-email@gmail.com
[CALLBACK] Buscando usuário no Sheets...
[CALLBACK] Usuário encontrado no Sheets? SIM
[CALLBACK] Status do usuário: APROVADO
[PORTAL] Carregando portal para: seu-email@gmail.com
[PORTAL] Usuário: Seu Nome | Nível: 1
```

---

## ✅ Checklist de Validação

Após os testes, confirme:

- [ ] Primeiro acesso mostra tela de seleção de cargo
- [ ] Cadastro cria linha no Google Sheets
- [ ] Login com PENDENTE mostra tela de aguardando aprovação
- [ ] Login com APROVADO **redireciona automaticamente para o portal**
- [ ] Portal mostra opções conforme nível de acesso
- [ ] Nível 0 mostra 1 opção
- [ ] Nível 1 mostra 2 opções
- [ ] Nível 5 mostra 3 opções
- [ ] Nível 10 mostra 5 opções + painel admin
- [ ] Login com REJEITADO mostra acesso negado
- [ ] Botão "Sair" volta ao login

---

## 🎯 Próximos Passos (Opcional)

Se tudo funcionar, as próximas implementações seriam:

1. **Portal dinâmico**: Ler opções do Google Sheets (aba `portal_opcoes`)
2. **Links funcionais**: Fazer os cards redirecionarem para URLs reais
3. **Barra de pesquisa**: Filtrar opções em tempo real
4. **Painel Admin**: CRUD de opções e gerenciamento de usuários
5. **Session/JWT**: Autenticação com token ao invés de query param `?email=`

---

## 🚨 Troubleshooting

### Erro: "redirect_uri_mismatch"
- Confirme que as URIs estão corretas no Google Console
- Aguarde 30 segundos após salvar

### Erro: "Falha na autenticação"
- Verifique credenciais do OAuth no `config.ts`
- Confirme que Client ID e Secret estão corretos

### Erro: "Usuário não aprovado"
- Verifique status no Sheets (coluna E)
- Confirme que está escrito exatamente "APROVADO" (maiúsculas)

### Portal não carrega
- Confirme que servidor está rodando: `curl http://localhost:3002/`
- Verifique logs: `tail -f /home/user/webapp/server.log`

---

## 📊 Estrutura da Planilha `raw_logins`

| Coluna | Campo | Exemplo |
|--------|-------|---------|
| A | ID | 1 |
| B | Email | usuario@gmail.com |
| C | Nome | João Silva |
| D | Cargo_Solicitado | Analista |
| E | Status | APROVADO |
| F | Data_Cadastro | 2026-02-12T12:00:00Z |
| G | Nivel | 1 |
| H | Avatar_URL | https://... |

---

**🚀 TESTE AGORA**: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
