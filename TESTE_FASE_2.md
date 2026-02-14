# 🎯 TESTE FASE 2 - Cadastro Completo

## ✅ **O QUE FOI IMPLEMENTADO:**

### **Fase 2 - Cadastro Completo**
1. ✅ Tela de seleção de cargo com 4 opções
2. ✅ Endpoint POST /api/auth/register
3. ✅ Método insertUser() no SheetsManager
4. ✅ Tela de confirmação de cadastro
5. ✅ Salvamento automático no Google Sheets

---

## 🚀 **TESTE COMPLETO - PASSO A PASSO**

### **📍 URLs Importantes:**
- **Login:** https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
- **Planilha:** https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg

---

### **🧪 TESTE 1: CADASTRO COMPLETO (Primeiro Acesso)**

#### **Passo 1: Login**
1. Abra: https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
2. Clique em **"Entrar com Google"**
3. Autorize com um email **NOVO** (que nunca foi usado antes)

#### **Passo 2: Tela de Seleção de Cargo**

Você verá esta tela:

```
┌─────────────────────────────────────────────────┐
│        [LOGO SHOPEE]                            │
│                                                 │
│    Bem-vindo ao Portal!                         │
│    Complete seu cadastro selecionando          │
│    seu cargo                                    │
│                                                 │
│  ┌──────────────────────────────┐              │
│  │ [Foto] Seu Nome              │              │
│  │ seu-email@gmail.com          │              │
│  │ ⏱️ Pendente                   │              │
│  └──────────────────────────────┘              │
│                                                 │
│  ⚠️ Importante:                                 │
│  Seu cadastro aguardará aprovação do admin     │
│                                                 │
│  Selecione seu cargo:                          │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ 👤 Básico   │  │ 📊 Analista │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ 👥 Supervisor│  │ 👑 Gestor   │             │
│  │ 🔒 Requer   │  │ 🔒 Requer   │             │
│  │  aprovação  │  │  aprovação  │             │
│  └─────────────┘  └─────────────┘             │
│                                                 │
│  [← Voltar]      [✓ Continuar]                │
└─────────────────────────────────────────────────┘
```

#### **Passo 3: Selecionar Cargo**

1. **Clique em um dos 4 cards:**
   - 👤 **Básico** - Acesso básico
   - 📊 **Analista** - Análise de dados
   - 👥 **Supervisor** - Supervisão (requer aprovação)
   - 👑 **Gestor** - Gestão (requer aprovação)

2. O card selecionado ficará **destacado com borda laranja**
3. O botão **"Continuar"** será habilitado

#### **Passo 4: Confirmar**

1. Clique em **"Continuar"**
2. Você verá: **"Criando seu cadastro..."** (loading)
3. Aguarde 2-3 segundos

#### **Passo 5: Tela de Sucesso**

Você verá:

```
┌─────────────────────────────────────────────────┐
│        [LOGO SHOPEE]                            │
│                                                 │
│           ✅                                     │
│                                                 │
│    Cadastro Realizado!                          │
│    Seu cadastro foi criado com sucesso          │
│                                                 │
│  ┌───────────────────────────────┐             │
│  │ Email: seu-email@gmail.com    │             │
│  │ Nome: Seu Nome                │             │
│  │ Cargo Solicitado: Analista    │             │
│  │ Status: ⏱️ PENDENTE            │             │
│  └───────────────────────────────┘             │
│                                                 │
│  ℹ️ Próximos passos:                            │
│  1. Seu cadastro está pendente                 │
│  2. O administrador será notificado            │
│  3. Você receberá email quando aprovado        │
│  4. Após aprovação, você poderá acessar        │
│                                                 │
│  [🏠 Voltar ao Login]                          │
└─────────────────────────────────────────────────┘
```

#### **Passo 6: Verificar no Google Sheets**

1. Abra: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
2. Vá para a aba **raw_logins**
3. **Verifique** se foi criada uma nova linha com:
   - **Coluna A (ID):** 1, 2, 3... (auto-incrementado)
   - **Coluna B (Email):** seu-email@gmail.com
   - **Coluna C (Nome):** Seu Nome
   - **Coluna D (Cargo):** Analista (ou o que você selecionou)
   - **Coluna E (Status):** PENDENTE
   - **Coluna F (Data):** 2026-02-12T...
   - **Coluna G (Nível):** (vazio)
   - **Coluna H (Avatar):** https://...

**✅ Se a linha foi criada = TESTE PASSOU!**

---

### **🧪 TESTE 2: LOGIN APÓS CADASTRO (Status PENDENTE)**

#### **Passo 1: Fazer Login Novamente**

1. Volte para: https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
2. Clique em **"Entrar com Google"**
3. Autorize com o **MESMO email** que você cadastrou

#### **Passo 2: Resultado Esperado**

Você verá a tela de **"Aguardando Aprovação"**:

```
┌─────────────────────────────────────────────────┐
│           ⏱️                                     │
│                                                 │
│    Aguardando Aprovação                         │
│    Seu cadastro está pendente                   │
│                                                 │
│  Email: seu-email@gmail.com                    │
│  Nome: Seu Nome                                │
│  Cargo Solicitado: Analista                    │
│  Status: ⏱️ PENDENTE                            │
│  Data do Cadastro: 2026-02-12...               │
│                                                 │
│  ℹ️ O administrador será notificado...          │
│                                                 │
│  [← Voltar ao Login]                           │
└─────────────────────────────────────────────────┘
```

**✅ Se apareceu esta tela = TESTE PASSOU!**

---

### **🧪 TESTE 3: APROVAR USUÁRIO**

#### **Passo 1: Editar Status no Sheets**

1. Abra: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
2. Aba **raw_logins**, encontre a linha do seu email
3. **Edite a Coluna E (Status):**
   - De: `PENDENTE`
   - Para: `APROVADO`
4. **Edite a Coluna G (Nível):**
   - De: (vazio)
   - Para: `1`

#### **Passo 2: Fazer Login Novamente**

1. Volte para: https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
2. Faça login com o **MESMO email**

#### **Passo 3: Resultado Esperado**

Você verá a tela de **"Login Realizado"**:

```
┌─────────────────────────────────────────────────┐
│           ✅                                     │
│                                                 │
│    ✅ Login Realizado!                          │
│    Acesso aprovado                              │
│                                                 │
│  Email: seu-email@gmail.com                    │
│  Nome: Seu Nome                                │
│  Cargo: Analista                               │
│  Nível: 1                                      │
│  Status: ✅ APROVADO                            │
│                                                 │
│  ℹ️ Na próxima fase, você será redirecionado    │
│     para o dashboard do portal                  │
│                                                 │
│  [Ir para Dashboard (Fase 2)]                  │
└─────────────────────────────────────────────────┘
```

**✅ Se apareceu esta tela = TESTE PASSOU!**

---

## 📊 **CHECKLIST DE TESTE**

### **Fluxo Completo:**
- [ ] Tela de login aparece
- [ ] Botão Google redireciona
- [ ] Tela de seleção de cargo aparece
- [ ] Cards de cargo são clicáveis
- [ ] Card selecionado fica destacado
- [ ] Botão "Continuar" habilita após seleção
- [ ] Loading aparece ao clicar em "Continuar"
- [ ] Tela de sucesso aparece após cadastro
- [ ] Nova linha é criada no Google Sheets
- [ ] Login após cadastro mostra tela PENDENTE
- [ ] Após mudar para APROVADO, mostra tela de sucesso

### **Dados no Sheets:**
- [ ] ID auto-incrementado
- [ ] Email correto
- [ ] Nome correto
- [ ] Cargo selecionado salvo
- [ ] Status = PENDENTE
- [ ] Data de cadastro preenchida
- [ ] Avatar URL salvo

---

## 🎉 **TESTE AGORA!**

**Siga os 3 testes acima e me diga:**

1. ✅ **Teste 1 passou?** (Cadastro completo)
2. ✅ **Teste 2 passou?** (Login após cadastro)
3. ✅ **Teste 3 passou?** (Aprovação)
4. ❌ **Algum erro?** (Se sim, qual?)

---

**Pronto para testar?** 🚀

URL: https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
