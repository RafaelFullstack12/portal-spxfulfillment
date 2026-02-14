# 🧪 TESTE COMPLETO - Sistema de Login

## 📋 **Status Atual**

✅ **Servidor Rodando**
- Porta: 3000
- URL Local: http://localhost:3000
- URL Pública: https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai

✅ **Integração com Google Sheets**
- Planilha: 1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
- Aba: raw_logins
- Service Account configurada

✅ **OAuth Google**
- Client ID: 866300069424-bnu4ljl7cg6qe95vn4rgitp47g38ih5k
- Redirect URI: http://localhost:3000/api/auth/callback

✅ **Logs Detalhados**
- Console.log em todas as etapas do callback
- Facilita debugging

---

## 🎯 **O QUE TESTAR AGORA**

### **Teste 1: Login com Email NÃO Cadastrado (Primeiro Acesso)**

1. **Abrir:** https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
2. **Clicar:** "Entrar com Google"
3. **Autorizar** com qualquer email Google
4. **Resultado Esperado:**
   ```
   Tela de PRIMEIRO ACESSO
   ✅ Dados capturados:
   - Email: seu-email@gmail.com
   - Nome: Seu Nome
   - Avatar: [foto]
   - É Shopee? ✅ SIM ou ❌ NÃO
   
   Status: PRIMEIRO ACESSO - Usuário não existe no banco
   ```

---

### **Teste 2: Login com Email PENDENTE**

**Passo 1: Adicionar manualmente no Google Sheets**

Acesse: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg

Adicione na aba **raw_logins**, linha 2:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| 1 | seu-email@gmail.com | Seu Nome | Analista | PENDENTE | 2026-02-12T00:00:00Z | | https://via.placeholder.com/150 |

**Passo 2: Testar Login**

1. **Voltar para:** https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
2. **Clicar:** "Entrar com Google"
3. **Autorizar** com o MESMO email que você adicionou
4. **Resultado Esperado:**
   ```
   Tela de AGUARDANDO APROVAÇÃO
   ⏱️ Status: PENDENTE
   
   Email: seu-email@gmail.com
   Nome: Seu Nome
   Cargo Solicitado: Analista
   Status: ⏱️ PENDENTE
   Data do Cadastro: 2026-02-12T00:00:00Z
   
   Mensagem: O administrador será notificado e você receberá um email 
   quando seu acesso for liberado.
   ```

---

### **Teste 3: Login com Email APROVADO**

**Passo 1: Modificar Status no Google Sheets**

Na aba **raw_logins**, edite a coluna E (Status):
- De: `PENDENTE`
- Para: `APROVADO`

E adicione um nível na coluna G:
- De: (vazio)
- Para: `1`

Exemplo:
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| 1 | seu-email@gmail.com | Seu Nome | Analista | **APROVADO** | 2026-02-12T00:00:00Z | **1** | https://via.placeholder.com/150 |

**Passo 2: Testar Login**

1. **Voltar para:** https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
2. **Clicar:** "Entrar com Google"
3. **Autorizar** com o MESMO email
4. **Resultado Esperado:**
   ```
   Tela de LOGIN REALIZADO
   ✅ Acesso aprovado
   
   Email: seu-email@gmail.com
   Nome: Seu Nome
   Cargo: Analista
   Nível: 1
   Status: ✅ APROVADO
   
   Botão: Ir para Dashboard (Fase 2)
   ```

---

### **Teste 4: Login com Email REJEITADO**

**Passo 1: Modificar Status no Google Sheets**

Na aba **raw_logins**, edite a coluna E (Status):
- De: `APROVADO`
- Para: `REJEITADO`

**Passo 2: Testar Login**

1. **Voltar para:** https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
2. **Clicar:** "Entrar com Google"
3. **Autorizar** com o MESMO email
4. **Resultado Esperado:**
   ```
   Tela de ACESSO NEGADO
   🚫 Acesso Negado
   
   Entre em contato com o administrador
   ```

---

## 📊 **Ver os Logs (Console)**

Abra o terminal e execute:
```bash
tail -f /home/user/webapp/server.log
```

Você verá logs como:
```
[CALLBACK] Iniciando...
[CALLBACK] Code: Recebido
[CALLBACK] Validando código com Google...
[CALLBACK] userData: OK
[CALLBACK] Email do usuário: seu-email@gmail.com
[CALLBACK] Buscando usuário no Sheets...
[CALLBACK] Usuário encontrado no Sheets? SIM
[CALLBACK] Status do usuário: PENDENTE
[CALLBACK] Exibindo tela de PENDENTE
```

---

## ❓ **Perguntas Importantes**

1. **A tela de login está aparecendo?** SIM / NÃO
2. **O botão "Entrar com Google" redireciona corretamente?** SIM / NÃO
3. **Após autorizar no Google, a tela aparece?** SIM / NÃO
4. **Qual tela está aparecendo?**
   - [ ] Primeiro Acesso
   - [ ] Pendente
   - [ ] Aprovado
   - [ ] Rejeitado
   - [ ] Outra (qual?)
5. **Algum erro aparece na tela?** SIM / NÃO

---

## 🚨 **Se Algo Não Funcionar**

1. **Abra o DevTools do navegador** (F12)
2. **Vá para a aba Console**
3. **Copie os erros e me envie**

Ou envie os logs do servidor:
```bash
tail -100 /home/user/webapp/server.log
```

---

## ✅ **Checklist Rápido**

- [ ] Servidor rodando na porta 3000
- [ ] Página de login abre
- [ ] Botão Google funciona
- [ ] Redirecionamento após autorização
- [ ] Tela de feedback aparece
- [ ] Status correto conforme o Sheets

---

**Próximo Passo:** Me diga qual cenário você quer testar primeiro! 🎉
