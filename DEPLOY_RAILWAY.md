# 🚂 Deploy no Railway

## ✅ O que foi feito

1. **Arquivos criados:**
   - `server.js` - Servidor Node.js com @hono/node-server
   - `railway.json` - Configuração do Railway
   - `.env.example` - Exemplo de variáveis de ambiente

2. **package.json atualizado:**
   - Adicionado script `start:railway`
   - Adicionada dependência `@hono/node-server`

## 🚀 Como fazer deploy

### 1. Criar conta no Railway
- Acesse: https://railway.app
- Faça login com GitHub
- **Plano gratuito:** $5 de crédito/mês (≈500 horas)

### 2. Criar novo projeto
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Autorize o Railway a acessar seu GitHub
4. Escolha o repositório: **portal-spxfulfillment**
5. O Railway detectará automaticamente Node.js

### 3. Configurar variáveis de ambiente (NÃO são necessárias)
**IMPORTANTE:** As credenciais Google já estão no código (`src/config.ts`), então **NÃO** precisa configurar variáveis de ambiente.

Se no futuro quiser usar variáveis de ambiente, adicione:
- `PORT` (Railway define automaticamente)

### 4. Deploy automático
- Railway vai:
  1. Clonar o repositório
  2. Executar `npm install`
  3. Executar `npm run start:railway`
  4. Gerar URL pública

### 5. URL gerada
Após o deploy (≈2-3 minutos):
- URL: `https://portal-spxfulfillment-production.up.railway.app`
- Ou similar com ID aleatório

### 6. Configurar domínio customizado (opcional)
1. No dashboard do Railway, clique no projeto
2. Vá em **Settings → Domains**
3. Adicione domínio customizado (ex: portal.shopee.com)

## 📊 Monitoramento

- **Logs:** Railway → Deploy → View Logs
- **Métricas:** Railway → Metrics (CPU, RAM, Network)
- **Custos:** Railway → Usage (acompanhe créditos)

## 🔄 Auto-deploy

Railway configura auto-deploy do GitHub automaticamente:
- Cada `git push origin main` → deploy automático
- Rollback disponível no dashboard

## 🆘 Troubleshooting

### Deploy falhou
- Verifique logs no Railway dashboard
- Confirme que `package.json` tem `start:railway`
- Verifique se `@hono/node-server` foi instalado

### Timeout na inicialização
- Railway aguarda 60s para health check
- Se demorar, aumente timeout em railway.json

### Erro de memória
- Plano gratuito: 512 MB RAM
- Se exceder, upgrade para plano pago ($5/mês)

## 💰 Custos

**Plano Gratuito:**
- $5 de crédito/mês
- ≈500 horas de execução
- Suficiente para projetos pequenos/médios

**Plano Hobby ($5/mês):**
- Sem limites de tempo
- 8 GB RAM
- Melhor para produção

## 📝 Próximos passos

1. Criar conta no Railway
2. Conectar repositório GitHub
3. Aguardar deploy (2-3 min)
4. Testar URL gerada
5. (Opcional) Configurar domínio customizado

## 🎯 Vantagens do Railway vs outras plataformas

| Plataforma | Custo | Setup | Auto-deploy | Node.js | Código atual |
|------------|-------|-------|-------------|---------|--------------|
| **Railway** | 🆓 $5/mês | ⚡ 5 min | ✅ Sim | ✅ Nativo | ✅ Zero mudanças |
| Vercel | 🆓/$20 | ⏱️ Horas | ✅ Sim | ⚠️ Serverless | ❌ Erros de runtime |
| Cloudflare | 💰 $5/mês | ⏱️ Horas | ✅ Sim | ❌ Workers | ❌ Bundle 12 MB |
| Streamlit | 🆓 | 🐌 2-3h | ✅ Sim | ❌ Python | ❌ Refatorar tudo |

---

**Resultado esperado:**
✅ Deploy em 5 minutos
✅ Código 100% funcional
✅ URL pública disponível
✅ Auto-deploy configurado
✅ $5/mês grátis
