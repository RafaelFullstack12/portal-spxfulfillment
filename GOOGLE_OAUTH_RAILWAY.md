# 🔐 Atualizar Google OAuth para Railway

Após fazer deploy no Railway, você precisa adicionar a URL do Railway nas credenciais OAuth do Google.

## 📝 Passos

### 1. Obter URL do Railway
Após o deploy, você receberá uma URL como:
```
https://portal-spxfulfillment-production.up.railway.app
```

### 2. Acessar Google Cloud Console
1. Vá para: https://console.cloud.google.com/apis/credentials
2. Faça login com a conta do projeto (`solar-bebop-472002-k5`)
3. Localize o OAuth 2.0 Client ID: `866300069424-bnu4ljl7cg6qe95vn4rgitp47g38ih5k.apps.googleusercontent.com`

### 3. Adicionar URIs autorizados

**Origens JavaScript autorizadas:**
Adicione:
```
https://portal-spxfulfillment-production.up.railway.app
```

**URIs de redirecionamento autorizados:**
Adicione:
```
https://portal-spxfulfillment-production.up.railway.app/api/auth/callback
```

### 4. Salvar alterações
- Clique em **Salvar**
- Aguarde 5-10 segundos para propagação

### 5. Testar
- Acesse a URL do Railway
- Clique em **Login com Google**
- Deve funcionar normalmente

## ⚠️ IMPORTANTE

**Mantenha os URIs existentes:**
- ✅ `http://localhost:3002/api/auth/callback` (desenvolvimento local)
- ✅ `https://3002-*.sandbox.novita.ai/api/auth/callback` (sandbox)
- ✅ Qualquer outro URI que já esteja configurado

**Apenas ADICIONE** a nova URL do Railway, não remova as existentes.

## 🔄 Se mudar o domínio Railway

Se você configurar um domínio customizado no Railway (ex: `portal.shopee.com`):
1. Adicione as novas URIs no Google OAuth
2. Teste o novo domínio
3. (Opcional) Remova as URIs antigas

## 📋 Checklist

- [ ] Deploy no Railway concluído
- [ ] URL do Railway obtida
- [ ] Google Cloud Console acessado
- [ ] Origens JavaScript adicionadas
- [ ] URIs de redirecionamento adicionadas
- [ ] Alterações salvas
- [ ] Login testado e funcionando
