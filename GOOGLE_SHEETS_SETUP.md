# 📊 CONFIGURAÇÃO GOOGLE SHEETS - SISTEMA ABS

**Data**: 17/02/2026  
**Status**: ✅ Sistema deployado, aguardando configuração dos cards

---

## 🎯 AÇÃO IMEDIATA NECESSÁRIA

Para que o Sistema ABS apareça no Portal, você precisa adicionar 2 linhas no Google Sheets.

---

## 📝 PASSO A PASSO

### 1. Abrir a Planilha do Portal

```
https://docs.google.com/spreadsheets/d/1pm0dtDn6x9k4Ct5u98pyD7FoAzl52GEzRazuFdPgU-w
```

### 2. Ir na Aba `portal_opcoes`

Clique na aba chamada **portal_opcoes** no rodapé da planilha.

### 3. Adicionar as 2 Linhas

Role até o final da lista e adicione estas 2 linhas novas:

---

## 📋 LINHA 1: Sistema ABS (Supervisores - Nível 5+)

**Cole exatamente esta linha** (cada valor em uma coluna):

| Coluna | Valor |
|--------|-------|
| **A** | `abs` |
| **B** | `Sistema ABS` |
| **C** | `Controle de Absenteísmo - Marcação de presença e gestão de colaboradores` |
| **D** | `/abs` |
| **E** | `5` |
| **F** | `fa-user-check` |
| **G** | `ATIVO` |
| **H** | `RH` |

**Formato de linha completa** (separe por Tab ou use colunas):
```
abs	Sistema ABS	Controle de Absenteísmo - Marcação de presença e gestão de colaboradores	/abs	5	fa-user-check	ATIVO	RH
```

---

## 📋 LINHA 2: Admin ABS (Administradores - Nível 10)

**Cole exatamente esta linha** (cada valor em uma coluna):

| Coluna | Valor |
|--------|-------|
| **A** | `abs-admin` |
| **B** | `Admin ABS` |
| **C** | `Painel administrativo do ABS - Gerenciar warehouses, links Google Sheets e usuários` |
| **D** | `/abs/admin` |
| **E** | `10` |
| **F** | `fa-cogs` |
| **G** | `ATIVO` |
| **H** | `RH` |

**Formato de linha completa** (separe por Tab ou use colunas):
```
abs-admin	Admin ABS	Painel administrativo do ABS - Gerenciar warehouses, links Google Sheets e usuários	/abs/admin	10	fa-cogs	ATIVO	RH
```

---

## 📊 ENTENDENDO AS COLUNAS

| Coluna | Nome | Descrição | Exemplo |
|--------|------|-----------|---------|
| **A** | ID único | Identificador único do card | `abs` |
| **B** | Nome | Título que aparece no card | `Sistema ABS` |
| **C** | Descrição | Texto descritivo do card | `Controle de Absenteísmo...` |
| **D** | URL | Rota da aplicação | `/abs` |
| **E** | Nível | Nível mínimo de acesso (1-10) | `5` |
| **F** | Ícone | Ícone Font Awesome | `fa-user-check` |
| **G** | Status | ATIVO ou INATIVO | `ATIVO` |
| **H** | Setor | Categoria/Setor (opcional) | `RH` |

---

## 🔐 NÍVEIS DE ACESSO

| Nível | Cargo | Descrição |
|-------|-------|-----------|
| **10** | ADMIN | Acesso total ao sistema |
| **5** | SUPERVISOR | Pode marcar presença dos colaboradores |
| **3** | VISUALIZADOR | Pode apenas visualizar |
| **1** | COLABORADOR | Pode ver própria presença |

### Sistema ABS
- **Nível mínimo**: 5 (Supervisor)
- **Quem pode acessar**: Supervisores, Gerentes, Admins (níveis 5+)

### Admin ABS
- **Nível mínimo**: 10 (Admin)
- **Quem pode acessar**: Apenas Administradores (nível 10)

---

## ✅ VERIFICAÇÃO

Após adicionar as linhas:

1. **Salve a planilha** (Ctrl+S)
2. **Aguarde 30 segundos** para sincronização
3. **Faça logout** do portal
4. **Faça login novamente**
5. **Verifique se os cards aparecem**:
   - 👤 Card "Sistema ABS" (ícone 📊)
   - ⚙️ Card "Admin ABS" (ícone ⚙️)

---

## 🎨 EXEMPLO VISUAL DO RESULTADO

Após adicionar as linhas, os usuários verão:

### Card 1: Sistema ABS
```
┌─────────────────────────────────┐
│  📊  Sistema ABS                │
│                                 │
│  Controle de Absenteísmo -      │
│  Marcação de presença e gestão  │
│  de colaboradores               │
│                                 │
│  Setor: RH                      │
│  Nível: 5+ (Supervisor)         │
└─────────────────────────────────┘
```

### Card 2: Admin ABS
```
┌─────────────────────────────────┐
│  ⚙️  Admin ABS                  │
│                                 │
│  Painel administrativo do ABS - │
│  Gerenciar warehouses, links    │
│  Google Sheets e usuários       │
│                                 │
│  Setor: RH                      │
│  Nível: 10 (Admin)              │
└─────────────────────────────────┘
```

---

## 🚨 TROUBLESHOOTING

### Os cards não aparecem?

#### Problema 1: Usuário sem nível suficiente
- **Solução**: Verifique o nível do usuário na aba `usuarios`
- **Sistema ABS**: Precisa nível 5+
- **Admin ABS**: Precisa nível 10

#### Problema 2: Cache do navegador
- **Solução**: 
  1. Pressione `Ctrl+Shift+Del`
  2. Limpe cache e cookies
  3. Feche o navegador
  4. Abra novamente

#### Problema 3: Planilha não salvou
- **Solução**: 
  1. Verifique se salvou (Ctrl+S)
  2. Aguarde 1 minuto
  3. Recarregue a planilha
  4. Verifique se as linhas estão lá

#### Problema 4: Formato incorreto
- **Solução**:
  1. Verifique se cada valor está na coluna correta
  2. Verifique se não tem espaços extras
  3. Verifique se o nível é número (5, 10)
  4. Verifique se o status é "ATIVO"

---

## 📞 ONDE TESTAR

### Após adicionar os cards, teste em:

#### Desenvolvimento (Sandbox)
```
https://3000-i1bjjmhnruulfzj9cj1x7-5634da27.sandbox.novita.ai/
```

#### Produção (Railway)
```
https://portal-spxfulfillment.up.railway.app/
```

### Login
1. Clique em "Entrar com Google"
2. Faça login com sua conta @shopee.com
3. Os cards devem aparecer automaticamente

---

## 🎯 PRÓXIMOS PASSOS APÓS CONFIGURAR

### 1. Testar Sistema ABS
- Clicar no card "Sistema ABS"
- Escolher warehouse (PE, GO, SP)
- Escolher mês (Fevereiro 2026)
- Escolher supervisor
- Clicar em um dia
- Testar marcação de presença

### 2. Testar Painel Admin
- Clicar no card "Admin ABS"
- Fazer login (admin / admin123)
- Explorar as 4 tabs:
  - Gerenciar Warehouses
  - Links Google Sheets
  - Gerenciar Usuários
  - Logs de Auditoria

### 3. Configurar Warehouses Adicionais
No painel admin, você pode:
- Adicionar novos warehouses (RJ, DF, etc)
- Configurar links das planilhas
- Gerenciar usuários e permissões

---

## 📊 ESTRUTURA DE DADOS REQUERIDA

Para cada warehouse, você precisa configurar 4 abas no Google Sheets:

### 1. ABS - Marcações de Presença
```
Colunas: Dia | Mês | Ano | Colaborador | WFM User | Sigla | Supervisor | Warehouse | Tipo
```

### 2. raw_scan - Batidas de Ponto
```
Colunas: WH | WFM User | Data Primeira Batida | Data Última Batida
```

### 3. raw_hr - Horas Extras
```
Colunas: WH | Nome | WFM User | Data | Hora Início | Hora Fim | Total Horas | Dia Inteiro
```

### 4. raw_sinergia - Sinergias
```
Colunas: WH | Nome | WFM User | Setor Atual | Setor Destino | Horário
```

---

## 🔧 CONFIGURAÇÃO TÉCNICA

### Spreadsheet ID Atual
```
1pm0dtDn6x9k4Ct5u98pyD7FoAzl52GEzRazuFdPgU-w
```

### Abas Necessárias
- ✅ `portal_opcoes` - Cards do portal (você vai editar)
- ✅ `usuarios` - Usuários do sistema
- ✅ `config_sistema` - Configurações gerais
- ✅ `ABS` - Marcações de presença
- ✅ `raw_scan` - Batidas de ponto
- ✅ `raw_hr` - Horas extras
- ✅ `raw_sinergia` - Sinergias

---

## 🎊 CHECKLIST FINAL

- [ ] Abrir planilha do portal
- [ ] Ir na aba `portal_opcoes`
- [ ] Adicionar linha do Sistema ABS (nível 5)
- [ ] Adicionar linha do Admin ABS (nível 10)
- [ ] Salvar planilha (Ctrl+S)
- [ ] Aguardar 30 segundos
- [ ] Fazer logout do portal
- [ ] Fazer login novamente
- [ ] Verificar se os cards aparecem
- [ ] Testar clique no Sistema ABS
- [ ] Testar clique no Admin ABS

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **README_ABS.md**: Documentação completa do sistema
- **DEPLOY_RAILWAY_SUCESSO.md**: Status do deploy
- **INTEGRACAO_ABS.md**: Detalhes técnicos
- **ABS_RESUMO_COMPLETO.md**: Resumo do sistema
- **ABS_PAINEL_ADMIN.md**: Painel administrativo

---

## 🚀 TUDO PRONTO!

Após adicionar as 2 linhas no Google Sheets:

✅ Sistema ABS estará visível no portal  
✅ Supervisores (nível 5+) poderão marcar presença  
✅ Admins (nível 10) poderão gerenciar o sistema  
✅ Integração com Google Sheets funcionando  
✅ Presença automática operacional  

**Tempo estimado**: 5 minutos para configurar  
**Resultado**: Sistema ABS 100% operacional! 🎉
