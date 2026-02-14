# 🔐 Google OAuth - URIs Autorizadas

## ⚠️ IMPORTANTE: Adicione ESTAS URIs no Google Cloud Console

### **Passo 1: Acessar Google Cloud Console**
```
https://console.cloud.google.com/apis/credentials?project=solar-bebop-472002-k5
```

### **Passo 2: Editar Client ID**
Clique no Client ID: `866300069424-bnu4ljl7cg6qe95vn4rgitp47g38ih5k`

### **Passo 3: Adicionar URIs**

Na seção **"URIs de redirecionamento autorizados"**, adicione EXATAMENTE estas 2 URLs:

```
http://localhost:3002/api/auth/callback
https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/api/auth/callback
```

### **⚠️ ATENÇÃO:**
- A primeira URI usa **HTTP** (localhost)
- A segunda URI usa **HTTPS** (sandbox público)
- **NÃO adicione HTTP para a URL do sandbox** - só HTTPS!

### **Passo 4: SALVAR**
Clique no botão **SALVAR** no final da página.

### **Passo 5: Aguardar**
Aguarde **30 segundos** para propagação das alterações no Google.

---

## ✅ Checklist Final

Antes de testar, confirme:

- [ ] Acessei o Google Cloud Console
- [ ] Encontrei o OAuth Client ID correto
- [ ] Adicionei `http://localhost:3002/api/auth/callback`
- [ ] Adicionei `https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/api/auth/callback`
- [ ] Cliquei em SALVAR
- [ ] Aguardei 30 segundos

---

## 🧪 Testar Após Configurar

**URL de Teste:** https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai

1. Abra a URL acima
2. Clique em "Entrar com Google"
3. Autorize com um email NOVO
4. Deve funcionar! ✅

---

## 📊 Como Funciona

O sistema detecta automaticamente:
- **localhost** → usa `http://localhost:3002/api/auth/callback`
- **sandbox público** → usa `https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/api/auth/callback`

Você pode ver isso nos logs:
```bash
tail -f /home/user/webapp/server.log
```

Procure por:
```
[LOGIN] Host: 3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai
[LOGIN] Protocol: https
[LOGIN] Redirect URI: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/api/auth/callback
```

---

## ❌ Se Ainda Não Funcionar

Se você ainda receber `redirect_uri_mismatch`:

1. **Verifique se salvou** no Google Console
2. **Aguarde 1-2 minutos** (propagação pode demorar)
3. **Tente em uma aba anônima** (limpa cache do browser)
4. **Copie e cole** as URIs (não digite manualmente)
5. **Me envie um print** do Google Console mostrando as URIs configuradas

---

## 📸 Screenshot de Como Deve Ficar

No Google Cloud Console, a seção deve ficar assim:

```
URIs de redirecionamento autorizados

URI 1: http://localhost:3002/api/auth/callback
URI 2: https://3002-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/api/auth/callback

[SALVAR]
```

---

**Pronto para testar?** 🚀
