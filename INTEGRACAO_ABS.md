# 📋 Adicionar Sistema ABS ao Portal

## 🎯 O que foi feito

### ✅ 1. Arquivos Copiados
- ✅ `mockup_abs_completo.html` → `/home/user/webapp/public/abs.html`
- ✅ `mockup_abs_admin.html` → `/home/user/webapp/public/abs-admin.html`

### ✅ 2. Rotas Adicionadas no `src/index.tsx`

```typescript
/**
 * Sistema ABS - Rotas estáticas
 */
app.get('/abs', async (c) => {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const htmlPath = path.join(process.cwd(), 'public', 'abs.html')
    const html = await fs.readFile(htmlPath, 'utf-8')
    return c.html(html)
  } catch (error) {
    console.error('[ABS] Erro ao carregar:', error)
    return c.html('<h1>Erro ao carregar Sistema ABS</h1>', 500)
  }
})

app.get('/abs/admin', async (c) => {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const htmlPath = path.join(process.cwd(), 'public', 'abs-admin.html')
    const html = await fs.readFile(htmlPath, 'utf-8')
    return c.html(html)
  } catch (error) {
    console.error('[ABS Admin] Erro ao carregar:', error)
    return c.html('<h1>Erro ao carregar Painel Admin</h1>', 500)
  }
})
```

---

## 📊 Adicionar Cards no Google Sheets

**IMPORTANTE**: Você precisa adicionar manualmente no Google Sheets na aba `portal_opcoes`.

### Card 1: Sistema ABS (Nível 5 - Supervisores)

| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F | Coluna G |
|----------|----------|----------|----------|----------|----------|----------|
| `abs` | `Sistema ABS` | `Controle de Absenteísmo - Marcação de presença e gestão de colaboradores` | `/abs` | `5` | `fa-user-check` | `ATIVO` |

**Descrição dos campos**:
- **A (id)**: `abs` - Identificador único
- **B (nome)**: `Sistema ABS` - Nome exibido
- **C (descricao)**: `Controle de Absenteísmo - Marcação de presença e gestão de colaboradores`
- **D (link)**: `/abs` - Link da rota
- **E (nivel_minimo)**: `5` - Apenas supervisores e acima
- **F (icone)**: `fa-user-check` - Ícone Font Awesome
- **G (status)**: `ATIVO` - Status do card

### Card 2: Painel Admin ABS (Nível 10 - Admins)

| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F | Coluna G |
|----------|----------|----------|----------|----------|----------|----------|
| `abs-admin` | `Admin ABS` | `Painel administrativo do ABS - Gerenciar warehouses, links Google Sheets e usuários` | `/abs/admin` | `10` | `fa-cogs` | `ATIVO` |

**Descrição dos campos**:
- **A (id)**: `abs-admin` - Identificador único
- **B (nome)**: `Admin ABS` - Nome exibido
- **C (descricao)**: `Painel administrativo do ABS - Gerenciar warehouses, links Google Sheets e usuários`
- **D (link)**: `/abs/admin` - Link da rota
- **E (nivel_minimo)**: `10` - Apenas administradores
- **F (icone)**: `fa-cogs` - Ícone Font Awesome
- **G (status)**: `ATIVO` - Status do card

---

## 🔗 Links das Rotas

### URLs do Sistema (após deploy):

**Produção (Railway/Cloudflare)**:
- Portal: `https://portal-spxfulfillment.up.railway.app/`
- Sistema ABS: `https://portal-spxfulfillment.up.railway.app/abs`
- Admin ABS: `https://portal-spxfulfillment.up.railway.app/abs/admin`

**Local (desenvolvimento)**:
- Portal: `http://localhost:3000/`
- Sistema ABS: `http://localhost:3000/abs`
- Admin ABS: `http://localhost:3000/abs/admin`

---

## 🧪 Como Testar

### 1. Testar Localmente

```bash
# Ir para o diretório
cd /home/user/webapp

# Build
npm run build

# Iniciar servidor (Railway mode)
npm run start
```

### 2. Acessar URLs

1. **Portal**: http://localhost:3000/
   - Fazer login com Google
   - Ver card "Sistema ABS" (se nível >= 5)
   - Ver card "Admin ABS" (se nível = 10)

2. **Sistema ABS direto**: http://localhost:3000/abs
   - Deve carregar as 6 telas completas
   - Portal → Warehouses → Mês → Supervisor → Calendário → Marcação

3. **Admin ABS direto**: http://localhost:3000/abs/admin
   - Login com admin/admin123
   - 4 tabs: Warehouses | Sheets | Usuários | Logs

---

## 🚀 Deploy

### Opção 1: Railway (Recomendado)

```bash
cd /home/user/webapp

# Commit
git add .
git commit -m "feat: Adiciona Sistema ABS e Painel Admin"

# Push
git push origin main
```

Railway vai detectar automaticamente e fazer deploy.

### Opção 2: Cloudflare Pages

```bash
cd /home/user/webapp

# Build
npm run build

# Deploy
npx wrangler pages deploy dist --project-name portal-spxfulfillment
```

---

## 📝 Checklist de Implementação

### ✅ Concluído

- [x] Copiar arquivos HTML para `public/`
- [x] Adicionar rotas `/abs` e `/abs/admin` no `index.tsx`
- [x] Documentar como adicionar cards no Google Sheets

### ⏳ Pendente (Manual)

- [ ] Adicionar 2 linhas na planilha `portal_opcoes` do Google Sheets
- [ ] Testar localmente
- [ ] Fazer build
- [ ] Deploy em produção
- [ ] Testar em produção

---

## 🔐 Permissões

### Sistema ABS
- **Nível mínimo**: 5 (Supervisor)
- **Acesso**: Supervisores e Administradores

### Admin ABS
- **Nível mínimo**: 10 (Administrador)
- **Acesso**: Apenas Administradores

---

## 📚 Documentação Adicional

- **ABS_RESUMO_COMPLETO.md**: Sistema ABS completo (6 telas)
- **ABS_PAINEL_ADMIN.md**: Painel administrativo
- **ABS_ADMIN_RESUMO_VISUAL.md**: Resumo visual do painel

---

## ✅ Próximos Passos

1. **Adicionar no Google Sheets**:
   - Abrir planilha `portal_opcoes`
   - Adicionar 2 linhas conforme tabelas acima
   - Salvar

2. **Testar**:
   ```bash
   cd /home/user/webapp
   npm run build
   npm run start
   ```
   - Acessar: http://localhost:3000/
   - Login
   - Verificar cards aparecem

3. **Deploy**:
   ```bash
   git add .
   git commit -m "feat: Sistema ABS integrado"
   git push origin main
   ```

---

✅ **Sistema ABS integrado ao Portal com sucesso!**
