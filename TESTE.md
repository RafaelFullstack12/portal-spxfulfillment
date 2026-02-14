# 🧪 GUIA RÁPIDO DE TESTE - Tela de Login

## ⚡ **TESTE RÁPIDO (5 minutos)**

### **1. Iniciar o servidor**
```bash
cd /home/user/webapp
npm run dev
```

**Aguarde até ver:**
```
> dev
> vite dev --host 0.0.0.0 --port 3000

  VITE v6.4.1  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

---

### **2. Acessar a tela de login**
```
http://localhost:3000
```

**Você verá:**
- Logo Shopee
- Botão "Entrar com Google"
- Info box com instruções

---

### **3. Testar a conexão com Sheets**
```
http://localhost:3000/api/test/sheets
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Conexão OK",
  "initialized": true
}
```

✅ **Se vir isso, o Sheets está conectado!**

---

### **4. Testar o login (3 cenários)**

#### **Cenário A: Primeiro acesso (email não cadastrado)**
1. Clique "Entrar com Google"
2. Use qualquer email Google
3. ✅ Verá: "Autenticação OK! PRIMEIRO ACESSO"
   - Dados capturados
   - É Shopee? SIM/NÃO
   - Mensagem: Fase 2 será cadastro

#### **Cenário B: Usuário PENDENTE**
**Pré-requisito:** Adicionar manualmente no Sheets

1. Abra a planilha: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
2. Aba: `raw_logins`
3. Adicione uma linha:
   ```
   ID: 1
   Email: seu@email.com
   Nome: Seu Nome
   Cargo_Solicitado: Analista
   Status: PENDENTE
   Data_Cadastro: 2026-02-11 10:00
   Nivel: (vazio)
   Avatar_URL: (vazio)
   ```
4. Faça login com esse email
5. ⏱️ Verá: "Aguardando Aprovação"

#### **Cenário C: Usuário APROVADO**
1. Mude o Status para `APROVADO` e Nivel para `1`
2. Faça login novamente
3. ✅ Verá: "Login Realizado!"

---

## 🐛 **SE DER ERRO**

### **Erro 1: "Falha na autenticação"**
**Causa:** OAuth não configurado
**Solução:** Verifique se o Client ID está correto em `src/config.ts`

### **Erro 2: "Erro ao buscar usuário"**
**Causa:** Service Account sem permissão
**Solução:** 
1. Abra a planilha
2. Compartilhe com: `sheets-bot@solar-bebop-472002-k5.iam.gserviceaccount.com`
3. Dê permissão de Editor

### **Erro 3: Servidor não inicia**
**Solução:**
```bash
cd /home/user/webapp
fuser -k 3000/tcp
npm run dev
```

---

## 📸 **PRINTSCREENS ESPERADOS**

### **Tela 1: Login**
- [ ] Logo Shopee visível
- [ ] Botão "Entrar com Google"
- [ ] Info box azul
- [ ] Footer "Sistema seguro"

### **Tela 2: Primeiro Acesso**
- [ ] Título "Autenticação OK!"
- [ ] Box azul com dados
- [ ] Box amarelo "Primeiro Acesso"
- [ ] Botões de voltar e continuar

### **Tela 3: Pendente**
- [ ] Ícone relógio amarelo
- [ ] Título "Aguardando Aprovação"
- [ ] Dados do usuário
- [ ] Status: PENDENTE

### **Tela 4: Aprovado**
- [ ] Ícone check verde
- [ ] Título "Login Realizado"
- [ ] Dados com nível
- [ ] Botão "Ir para Dashboard"

---

## ✅ **CHECKLIST DE VALIDAÇÃO**

Teste cada item:

- [ ] Servidor inicia sem erros
- [ ] Tela de login carrega
- [ ] Logo Shopee aparece
- [ ] Botão Google funciona
- [ ] Redireciona para OAuth Google
- [ ] Callback recebe dados
- [ ] Busca no Sheets funciona
- [ ] Mostra "Primeiro Acesso" corretamente
- [ ] Mostra "Pendente" corretamente
- [ ] Mostra "Aprovado" corretamente
- [ ] Email Shopee é identificado
- [ ] Email externo é identificado

---

## 🎯 **RESULTADO ESPERADO**

**✅ TUDO OK se:**
1. Servidor inicia em ~30s
2. Tela de login carrega
3. OAuth funciona
4. Sheets conecta
5. Busca usuário funciona
6. 3 fluxos funcionam

**Pronto para Fase 2!** 🚀

---

## 📝 **ANOTAÇÕES DE TESTE**

Use este espaço para anotar problemas encontrados:

```
[ ] Problema 1: __________________________________
    Solução: ____________________________________

[ ] Problema 2: __________________________________
    Solução: ____________________________________
```

---

**Tempo estimado de teste:** 15-20 minutos  
**Última atualização:** 2026-02-11
