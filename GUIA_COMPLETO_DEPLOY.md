# 📚 Guia Completo de Deploy - Portal SPX Fulfillment
### Do Código ao Deploy: Um Guia para Iniciantes

---

## 📖 Índice

1. [Introdução](#1-introdução)
2. [Entendendo a Estrutura do Projeto](#2-entendendo-a-estrutura-do-projeto)
3. [Ferramentas Necessárias](#3-ferramentas-necessárias)
4. [Configurando o Ambiente Local](#4-configurando-o-ambiente-local)
5. [Como Editar o Código](#5-como-editar-o-código)
6. [Testando Localmente](#6-testando-localmente)
7. [Fazendo Deploy no Railway](#7-fazendo-deploy-no-railway)
8. [Troubleshooting (Resolvendo Problemas)](#8-troubleshooting-resolvendo-problemas)
9. [Boas Práticas](#9-boas-práticas)
10. [Exemplos Práticos](#10-exemplos-práticos)
11. [Glossário de Termos](#11-glossário-de-termos)
12. [Comandos Úteis](#12-comandos-úteis)

---

## 1. Introdução

### 1.1 O que é este guia?

Este guia foi criado para **iniciantes** que nunca trabalharam com desenvolvimento web e precisam fazer alterações no **Sistema ABS (Apontamento de Boleto e Sinistro)** do Portal SPX Fulfillment.

### 1.2 O que você vai aprender?

- ✅ Entender a estrutura do projeto
- ✅ Fazer alterações no código
- ✅ Testar suas alterações localmente
- ✅ Fazer deploy (publicar) no Railway
- ✅ Resolver problemas comuns

### 1.3 Pré-requisitos

**Não precisa saber programação!** Este guia assume que você:
- Sabe usar um computador básico
- Sabe abrir pastas e arquivos
- Sabe copiar e colar texto

---

## 2. Entendendo a Estrutura do Projeto

### 2.1 O que é um "projeto"?

Um **projeto** é uma pasta no seu computador que contém:
- **Código** (arquivos que dizem ao computador o que fazer)
- **Imagens** (fotos, ícones)
- **Configurações** (arquivos que dizem como o projeto funciona)

### 2.2 Estrutura de Pastas do Portal SPX

```
webapp/                          ← Pasta principal do projeto
│
├── public/                      ← Arquivos que o usuário vê (HTML, CSS, JS)
│   ├── abs.html                 ← Página principal do Sistema ABS (VOCÊ VAI EDITAR AQUI!)
│   ├── abs-fixed.html           ← Versão antiga (backup)
│   ├── abs-admin.html           ← Painel administrativo
│   ├── portal.html              ← Página inicial do portal
│   └── dashboard.html           ← Dashboard com gráficos
│
├── src/                         ← Código do servidor (backend)
│   ├── index.tsx                ← Arquivo principal do servidor
│   ├── routes/                  ← Rotas da API
│   └── config.ts                ← Configurações do Google Sheets
│
├── dist/                        ← Versão "compilada" do projeto (gerada automaticamente)
│   ├── index.js                 ← Servidor compilado
│   └── public/                  ← Cópia dos arquivos públicos
│       └── abs.html             ← Cópia do abs.html original
│
├── node_modules/                ← Bibliotecas de terceiros (NÃO EDITAR!)
│
├── package.json                 ← Lista de dependências e comandos
├── build.mjs                    ← Script que gera a pasta dist/
├── ecosystem.config.cjs         ← Configuração do PM2 (gerenciador de processos)
├── railway.json                 ← Configuração do Railway (plataforma de deploy)
└── .gitignore                   ← Lista de arquivos que o Git ignora
```

### 2.3 Principais Arquivos que Você Vai Usar

| Arquivo | Para que serve | Você vai editar? |
|---------|----------------|------------------|
| **public/abs.html** | Página principal do Sistema ABS | ✅ **SIM** (principal) |
| **src/index.tsx** | Define quais arquivos carregar nas rotas | 🟡 Às vezes |
| **package.json** | Lista de comandos e dependências | ❌ Raramente |
| **build.mjs** | Copia arquivos para dist/ | ❌ Não |

---

## 3. Ferramentas Necessárias

### 3.1 Editor de Código

**Recomendado: Visual Studio Code (VS Code)**

#### Como instalar:
1. Acesse: https://code.visualstudio.com/
2. Clique em **"Download"**
3. Instale normalmente (Next → Next → Finish)

#### Por que usar VS Code?
- ✅ Gratuito
- ✅ Fácil de usar
- ✅ Destaca o código com cores (mais fácil de ler)
- ✅ Mostra erros antes de você salvar

### 3.2 Node.js

**O que é?** Um programa que executa JavaScript no seu computador.

#### Como instalar:
1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendada)
3. Instale normalmente

#### Como verificar se instalou:
```bash
# Abra o Terminal (Windows: PowerShell ou CMD)
node --version
# Deve aparecer algo como: v20.11.0

npm --version
# Deve aparecer algo como: 10.2.4
```

### 3.3 Git

**O que é?** Um programa que "guarda versões" do seu código (como um histórico de alterações).

#### Como instalar (Windows):
1. Acesse: https://git-scm.com/download/win
2. Baixe e instale normalmente
3. Durante a instalação, deixe tudo **padrão** (Next → Next → Finish)

#### Como instalar (Mac):
```bash
# Abra o Terminal e digite:
brew install git
```

#### Como verificar se instalou:
```bash
git --version
# Deve aparecer algo como: git version 2.43.0
```

### 3.4 Conta no GitHub

**O que é?** Um site que guarda seu código online (como um Google Drive para código).

#### Como criar:
1. Acesse: https://github.com/
2. Clique em **"Sign up"**
3. Preencha seus dados
4. Confirme seu email

### 3.5 Conta no Railway

**O que é?** Um serviço que "publica" seu site na internet (faz o deploy).

#### Como criar:
1. Acesse: https://railway.app/
2. Clique em **"Start a New Project"**
3. Faça login com sua conta do **GitHub**

---

## 4. Configurando o Ambiente Local

### 4.1 Clonando o Projeto do GitHub

#### O que é "clonar"?
É **baixar** o código do GitHub para o seu computador.

#### Passo a passo:

**1. Abra o Terminal**
- **Windows**: Pressione `Win + R`, digite `powershell` e aperte Enter
- **Mac**: Pressione `Cmd + Espaço`, digite `terminal` e aperte Enter

**2. Escolha uma pasta para salvar o projeto**
```bash
# Exemplo: salvar na pasta Documentos
cd Documents

# Ou criar uma pasta específica
mkdir projetos
cd projetos
```

**3. Clone o repositório**
```bash
git clone https://github.com/RafaelFullstack12/portal-spxfulfillment.git
```

**4. Entre na pasta do projeto**
```bash
cd portal-spxfulfillment
```

### 4.2 Instalando Dependências

#### O que são "dependências"?
São **bibliotecas** (códigos prontos) que o projeto precisa para funcionar.

#### Como instalar:
```bash
npm install
```

**O que vai acontecer:**
- ⏱️ Vai demorar 1-3 minutos
- 📦 Vai criar uma pasta chamada `node_modules/` (NÃO EDITAR!)
- ✅ No final, vai aparecer algo como: "added 342 packages"

### 4.3 Configurando Variáveis de Ambiente

#### O que são "variáveis de ambiente"?
São **senhas e configurações secretas** que não ficam no código.

#### Como configurar:

**1. Crie um arquivo chamado `.dev.vars`** na pasta raiz do projeto:
```bash
# No Terminal (dentro da pasta do projeto):
# Windows PowerShell:
New-Item .dev.vars -ItemType File

# Mac/Linux:
touch .dev.vars
```

**2. Abra o arquivo `.dev.vars` no VS Code**

**3. Cole este conteúdo:**
```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-email-do-service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"

# Configurações do Portal
ADMIN_EMAIL=rafael@spxfulfillment.com
```

**⚠️ IMPORTANTE:**
- Substitua `seu-email-do-service-account@projeto.iam.gserviceaccount.com` pelo email real
- Substitua `SUA_CHAVE_AQUI` pela chave privada do Google Service Account

---

## 5. Como Editar o Código

### 5.1 Abrindo o Projeto no VS Code

**1. Abra o VS Code**

**2. Clique em `File` → `Open Folder...`**

**3. Selecione a pasta `portal-spxfulfillment`**

**4. Agora você verá a estrutura de pastas na lateral esquerda**

### 5.2 Editando o Sistema ABS

#### Onde está o código do Sistema ABS?
**Arquivo:** `public/abs.html`

#### Como abrir:
1. No VS Code, na lateral esquerda, clique em **`public`**
2. Clique em **`abs.html`**
3. O arquivo vai abrir no editor

### 5.3 Entendendo a Estrutura do abs.html

O arquivo `abs.html` tem **3 partes principais:**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- PARTE 1: CABEÇALHO (HEAD) -->
  <!-- Aqui ficam: título, links para CSS, configurações -->
  <title>Sistema ABS</title>
  <link href="https://cdn.tailwindcss.com" rel="stylesheet">
</head>

<body>
  <!-- PARTE 2: CONTEÚDO VISUAL (BODY) -->
  <!-- Aqui fica tudo que o usuário VÊ: botões, textos, tabelas -->
  <div id="tela-portal" class="tela active">
    <h1>Sistema ABS</h1>
    <!-- ... mais conteúdo ... -->
  </div>

  <!-- PARTE 3: LÓGICA (JAVASCRIPT) -->
  <script>
    // Aqui fica o código que faz as coisas FUNCIONAREM
    function salvarMarcacoes() {
      // Código que salva as marcações
    }
  </script>
</body>
</html>
```

### 5.4 Exemplo Prático: Removendo a Tela de Loading

#### Cenário:
Você quer **remover** a mensagem "Recarregando dados..." que aparece após salvar uma marcação.

#### Passo a passo:

**1. Abra `public/abs.html` no VS Code**

**2. Pressione `Ctrl + F` (ou `Cmd + F` no Mac) para abrir a busca**

**3. Digite:** `mostrarLoading('Recarregando dados...`

**4. Você vai encontrar algo assim (linha ~1794):**
```javascript
mostrarLoading('Recarregando dados...');
```

**5. Comente a linha adicionando `//` no início:**
```javascript
// mostrarLoading('Recarregando dados...'); // DESABILITADO
```

**6. Salve o arquivo:** `Ctrl + S` (ou `Cmd + S` no Mac)

#### Por que comentar ao invés de deletar?
- ✅ Se você quiser **voltar**, é só remover o `//`
- ✅ Você sabe **o que foi alterado** (boas práticas)

### 5.5 Exemplo Prático: Alterando um Texto

#### Cenário:
Você quer mudar o texto do botão "Salvar Todas as Marcações" para "Salvar".

#### Passo a passo:

**1. Pressione `Ctrl + F` e busque:** `Salvar Todas as Marcações`

**2. Você vai encontrar algo assim:**
```html
<button onclick="salvarMarcacoes()">
  <i class="fas fa-save"></i>
  Salvar Todas as Marcações
</button>
```

**3. Altere para:**
```html
<button onclick="salvarMarcacoes()">
  <i class="fas fa-save"></i>
  Salvar
</button>
```

**4. Salve o arquivo:** `Ctrl + S`

### 5.6 Exemplo Prático: Alterando a Rota no Backend

#### Cenário:
Você quer que a rota `/abs` carregue `abs.html` ao invés de `abs-fixed.html`.

#### Passo a passo:

**1. Abra `src/index.tsx` no VS Code**

**2. Pressione `Ctrl + F` e busque:** `abs-fixed.html`

**3. Você vai encontrar algo assim (linha ~1379):**
```typescript
const htmlPath = path.join(process.cwd(), 'public', 'abs-fixed.html')
```

**4. Altere para:**
```typescript
const htmlPath = path.join(process.cwd(), 'public', 'abs.html')
```

**5. Salve o arquivo:** `Ctrl + S`

---

## 6. Testando Localmente

### 6.1 O que é "testar localmente"?

É **executar o projeto no seu computador** antes de publicar na internet.

### 6.2 Como testar?

#### Passo 1: Build do Projeto

**O que é "build"?**
É **compilar** o código (transformar de TypeScript para JavaScript).

**Como fazer:**
```bash
# No Terminal, dentro da pasta do projeto:
npm run build
```

**O que vai acontecer:**
- ⏱️ Vai demorar 5-10 segundos
- 📁 Vai criar/atualizar a pasta `dist/`
- ✅ No final: "✅ Build concluído: dist/index.js"

#### Passo 2: Iniciar o Servidor

**Opção A: Usando PM2 (Recomendado para desenvolvimento)**

```bash
# Instalar PM2 globalmente (só precisa fazer 1 vez):
npm install -g pm2

# Iniciar o servidor:
pm2 start ecosystem.config.cjs

# Ver logs (para debug):
pm2 logs --nostream
```

**Opção B: Usando Node diretamente**

```bash
node dist/server.js
```

#### Passo 3: Abrir no Navegador

**1. Abra seu navegador (Chrome, Firefox, etc.)**

**2. Digite na barra de endereço:**
```
http://localhost:3000
```

**3. Você verá a página inicial do Portal**

**4. Para acessar o Sistema ABS:**
```
http://localhost:3000/abs
```

### 6.3 Como Parar o Servidor

**Se usou PM2:**
```bash
pm2 stop all
# ou
pm2 delete all
```

**Se usou Node diretamente:**
Pressione `Ctrl + C` no Terminal.

### 6.4 Testando Alterações

#### Fluxo completo:

**1. Faça uma alteração no código**
- Exemplo: Altere um texto em `public/abs.html`

**2. Salve o arquivo** (`Ctrl + S`)

**3. Rebuild do projeto**
```bash
npm run build
```

**4. Reinicie o servidor**
```bash
# Se usou PM2:
pm2 restart all

# Se usou Node diretamente:
# Pare (Ctrl+C) e inicie novamente:
node dist/server.js
```

**5. Recarregue a página no navegador**
- Pressione `Ctrl + Shift + R` (ou `Cmd + Shift + R` no Mac)
- Isso faz um **refresh forçado** (ignora cache)

**6. Veja se a alteração apareceu**

---

## 7. Fazendo Deploy no Railway

### 7.1 O que é "deploy"?

**Deploy** = **Publicar** seu código na internet para que outras pessoas possam acessar.

### 7.2 Como o Railway Funciona?

```
Seu Computador          GitHub              Railway                 Usuário Final
     (código local) → (código online) → (servidor na nuvem) → (acessa o site)
```

**Fluxo:**
1. Você **edita** o código no seu computador
2. Você **envia** (push) para o GitHub
3. O Railway **detecta** automaticamente a mudança
4. O Railway **faz o build** e **publica** automaticamente
5. Usuários acessam a nova versão

### 7.3 Configurando o Railway (Primeira Vez)

#### Passo 1: Criar Projeto no Railway

**1. Acesse:** https://railway.app/

**2. Clique em:** `New Project`

**3. Selecione:** `Deploy from GitHub repo`

**4. Escolha:** `RafaelFullstack12/portal-spxfulfillment`

**5. O Railway vai:**
- ✅ Conectar ao repositório
- ✅ Detectar automaticamente que é um projeto Node.js
- ✅ Fazer o primeiro deploy

#### Passo 2: Configurar Variáveis de Ambiente

**1. No painel do Railway, clique em:** `Variables`

**2. Adicione as seguintes variáveis:**

| Key | Value |
|-----|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `seu-email@projeto.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\nSUA_CHAVE\n-----END PRIVATE KEY-----` |
| `ADMIN_EMAIL` | `rafael@spxfulfillment.com` |
| `PORT` | `3000` |

**3. Clique em:** `Add Variable` para cada uma

**4. O Railway vai reiniciar automaticamente**

#### Passo 3: Obter a URL do Projeto

**1. No painel do Railway, clique em:** `Settings`

**2. Na seção `Domains`, clique em:** `Generate Domain`

**3. Você vai receber uma URL como:**
```
https://portal-spxfulfillment-production.up.railway.app
```

**4. Acesse essa URL no navegador**

### 7.4 Deploy Automático (Depois da Primeira Vez)

#### Como funciona:
Sempre que você fizer um **push** para o GitHub, o Railway **automaticamente**:
1. Detecta a mudança
2. Faz o build (`npm install` + `npm run build`)
3. Reinicia o servidor
4. Publica a nova versão

#### Passo a passo:

**1. Faça suas alterações no código**

**2. Salve todos os arquivos** (`Ctrl + S`)

**3. Abra o Terminal e execute:**

```bash
# 1. Veja o que foi alterado
git status

# 2. Adicione TODOS os arquivos alterados
git add -A

# 3. Crie um "commit" (salvar versão) com uma mensagem descritiva
git commit -m "fix(abs): Remover loading desnecessário após salvar marcação"

# 4. Envie para o GitHub
git push origin main
```

**4. Acompanhe o deploy no Railway:**
- Acesse: https://railway.app/dashboard
- Clique no seu projeto
- Clique na aba `Deployments`
- Você verá o status: `Building` → `Deploying` → `Success`

**5. Aguarde 3-5 minutos**

**6. Acesse sua URL do Railway:**
```
https://portal-spxfulfillment-production.up.railway.app/abs
```

**7. Force refresh** (`Ctrl + Shift + R`)

**8. Veja se suas alterações aparecem**

### 7.5 Como Escrever Boas Mensagens de Commit

#### Formato:
```
<tipo>(<escopo>): <descrição curta>

<descrição longa (opcional)>
```

#### Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `refactor`: Refatoração (melhoria de código sem mudar funcionalidade)
- `perf`: Melhoria de performance
- `style`: Mudanças de estilo (CSS, formatação)
- `docs`: Documentação
- `chore`: Tarefas gerais (atualização de dependências)

#### Exemplos:

**✅ BOM:**
```bash
git commit -m "fix(abs): Remover loading 'Recarregando dados' após salvar"
```

**✅ BOM:**
```bash
git commit -m "feat(abs): Adicionar botão de exportar para Excel"
```

**❌ RUIM:**
```bash
git commit -m "ajustes"
```

**❌ RUIM:**
```bash
git commit -m "fix"
```

---

## 8. Troubleshooting (Resolvendo Problemas)

### 8.1 Problema: "npm: command not found"

#### Causa:
Node.js não está instalado ou não está no PATH.

#### Solução:
```bash
# Reinstale o Node.js:
# https://nodejs.org/

# Verifique a instalação:
node --version
npm --version
```

### 8.2 Problema: "git: command not found"

#### Causa:
Git não está instalado ou não está no PATH.

#### Solução:
```bash
# Instale o Git:
# https://git-scm.com/downloads

# Verifique a instalação:
git --version
```

### 8.3 Problema: "Port 3000 already in use"

#### Causa:
Outro processo já está usando a porta 3000.

#### Solução A (Linux/Mac):
```bash
# Matar o processo na porta 3000:
lsof -ti:3000 | xargs kill -9
```

#### Solução B (Windows):
```bash
# Encontrar o processo:
netstat -ano | findstr :3000

# Matar o processo (substitua PID pelo número que apareceu):
taskkill /PID <PID> /F
```

#### Solução C (Qualquer SO):
```bash
# Se usou PM2:
pm2 delete all
```

### 8.4 Problema: Alterações não aparecem no Railway

#### Possíveis causas e soluções:

**Causa 1: Railway está servindo arquivo errado**

**Verificar:**
```bash
# Abra src/index.tsx e procure a rota /abs
# Veja qual arquivo está sendo carregado
```

**Solução:**
```typescript
// Certifique-se que está assim:
const htmlPath = path.join(process.cwd(), 'public', 'abs.html')
```

**Causa 2: Cache do navegador**

**Solução:**
- Pressione `Ctrl + Shift + R` (Windows/Linux)
- Pressione `Cmd + Shift + R` (Mac)
- Ou limpe o cache: `F12` → `Application` → `Clear storage` → `Clear site data`

**Causa 3: Build não foi feito**

**Solução:**
```bash
# 1. Faça o build localmente:
npm run build

# 2. Commit e push:
git add -A
git commit -m "chore: Force rebuild"
git push origin main
```

**Causa 4: Railway está usando cache antigo**

**Solução:**
```bash
# 1. Crie um arquivo railway.json na raiz:
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "node dist/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}

# 2. Commit e push:
git add railway.json
git commit -m "fix: Adicionar railway.json para forçar rebuild"
git push origin main
```

### 8.5 Problema: Erro "Cannot find module"

#### Causa:
Dependências não foram instaladas.

#### Solução:
```bash
# Reinstale as dependências:
rm -rf node_modules package-lock.json
npm install
```

### 8.6 Problema: Console mostra logs antigos

#### Causa:
Navegador está usando cache.

#### Solução:
```bash
# 1. Abra o DevTools (F12)
# 2. Clique com botão direito no ícone de refresh
# 3. Selecione "Empty Cache and Hard Reload"
```

---

## 9. Boas Práticas

### 9.1 Sempre Faça Backup

**Antes de fazer alterações grandes:**

```bash
# Crie uma branch de backup:
git checkout -b backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)

# Volte para a branch principal:
git checkout main
```

### 9.2 Teste Localmente Antes de Fazer Deploy

**Nunca faça:**
```bash
# ❌ ERRADO: Editar → Push direto
git add -A && git commit -m "alterações" && git push
```

**Sempre faça:**
```bash
# ✅ CORRETO: Editar → Build → Testar → Push
npm run build
pm2 restart all
# Teste no navegador: http://localhost:3000/abs
# Se tudo OK, então:
git add -A && git commit -m "fix: descrição" && git push
```

### 9.3 Use Mensagens de Commit Descritivas

**❌ Evite:**
- "ajustes"
- "fix"
- "update"
- "mudanças"

**✅ Prefira:**
- "fix(abs): Remover loading de 'Recarregando dados' após salvar marcação"
- "feat(portal): Adicionar filtro por supervisor na tela de marcação"
- "perf(abs): Otimizar carregamento de colaboradores com cache"

### 9.4 Comente Código Alterado (Não Delete)

**❌ Evite:**
```javascript
// Deletar código antigo completamente
function antiga() { ... } // DELETADO
```

**✅ Prefira:**
```javascript
// Versão antiga (mantida para referência)
// function antiga() {
//   console.log('versão antiga')
// }

// Nova versão otimizada
function nova() {
  console.log('versão nova')
}
```

### 9.5 Use o Console para Debug

**Como abrir o Console:**
- Pressione `F12` no navegador
- Ou clique com botão direito → `Inspecionar` → Aba `Console`

**Adicione logs no código:**
```javascript
function salvarMarcacoes() {
  console.log('[DEBUG] Iniciando salvamento...')
  
  const modificacoes = Object.keys(estado.marcacoesModificadas)
  console.log('[DEBUG] Total de modificações:', modificacoes.length)
  
  // ... resto do código
  
  console.log('[DEBUG] Salvamento concluído!')
}
```

### 9.6 Mantenha Seu Git Atualizado

**Sempre antes de começar a trabalhar:**
```bash
# Puxar as últimas mudanças do GitHub:
git pull origin main
```

### 9.7 Não Commite Arquivos Sensíveis

**❌ Nunca commit:**
- `.dev.vars` (senhas e tokens)
- `node_modules/` (dependências)
- `.env` (variáveis de ambiente)
- Arquivos de log

**✅ Sempre verifique o `.gitignore`:**
```bash
# .gitignore deve conter:
node_modules/
.dev.vars
.env
*.log
dist/
.wrangler/
```

---

## 10. Exemplos Práticos

### 10.1 Exemplo 1: Alterar Cor de um Botão

#### Objetivo:
Mudar a cor do botão "Salvar" de azul para verde.

#### Passo a passo:

**1. Abra `public/abs.html`**

**2. Busque o botão de salvar:**
```html
<!-- ANTES: -->
<button class="bg-blue-500 hover:bg-blue-600" onclick="salvarMarcacoes()">
  <i class="fas fa-save"></i>
  Salvar Todas as Marcações
</button>
```

**3. Altere as classes de cor:**
```html
<!-- DEPOIS: -->
<button class="bg-green-500 hover:bg-green-600" onclick="salvarMarcacoes()">
  <i class="fas fa-save"></i>
  Salvar Todas as Marcações
</button>
```

**4. Salve (`Ctrl + S`)**

**5. Build e teste:**
```bash
npm run build
pm2 restart all
# Abra: http://localhost:3000/abs
```

**6. Se estiver OK, commit e push:**
```bash
git add public/abs.html
git commit -m "style(abs): Alterar cor do botão Salvar para verde"
git push origin main
```

### 10.2 Exemplo 2: Adicionar um Novo Supervisor

#### Objetivo:
Adicionar "Carlos Silva" à lista de supervisores.

#### Passo a passo:

**1. Abra `public/abs.html`**

**2. Busque a lista de supervisores:**
```html
<!-- Procure por algo assim: -->
<div id="lista-supervisores" class="grid grid-cols-2 gap-4">
  <div class="supervisor-card" onclick="selecionarSupervisor('Pedro Costa Silva')">
    <i class="fas fa-user-tie"></i>
    <span>Pedro Costa Silva</span>
  </div>
  <div class="supervisor-card" onclick="selecionarSupervisor('Ana Paula Rocha')">
    <i class="fas fa-user-tie"></i>
    <span>Ana Paula Rocha</span>
  </div>
</div>
```

**3. Adicione o novo supervisor:**
```html
<div id="lista-supervisores" class="grid grid-cols-2 gap-4">
  <div class="supervisor-card" onclick="selecionarSupervisor('Pedro Costa Silva')">
    <i class="fas fa-user-tie"></i>
    <span>Pedro Costa Silva</span>
  </div>
  <div class="supervisor-card" onclick="selecionarSupervisor('Ana Paula Rocha')">
    <i class="fas fa-user-tie"></i>
    <span>Ana Paula Rocha</span>
  </div>
  <!-- NOVO SUPERVISOR: -->
  <div class="supervisor-card" onclick="selecionarSupervisor('Carlos Silva')">
    <i class="fas fa-user-tie"></i>
    <span>Carlos Silva</span>
  </div>
</div>
```

**4. Salve, build, teste, commit e push:**
```bash
npm run build
pm2 restart all
# Teste em: http://localhost:3000/abs

git add public/abs.html
git commit -m "feat(abs): Adicionar supervisor Carlos Silva"
git push origin main
```

### 10.3 Exemplo 3: Desabilitar uma Funcionalidade

#### Objetivo:
Desabilitar temporariamente o botão "Recarregar" (para testes).

#### Passo a passo:

**1. Abra `public/abs.html`**

**2. Busque o botão de recarregar:**
```html
<!-- ANTES: -->
<button onclick="recarregarManual()" class="btn-secondary">
  <i class="fas fa-sync-alt"></i>
  Recarregar
</button>
```

**3. Adicione o atributo `disabled`:**
```html
<!-- DEPOIS: -->
<button onclick="recarregarManual()" class="btn-secondary" disabled>
  <i class="fas fa-sync-alt"></i>
  Recarregar (Desabilitado)
</button>
```

**4. Salve, build, teste, commit e push:**
```bash
npm run build
pm2 restart all

git add public/abs.html
git commit -m "feat(abs): Desabilitar botão Recarregar temporariamente"
git push origin main
```

### 10.4 Exemplo 4: Adicionar um Log de Debug

#### Objetivo:
Adicionar logs para ver quantas marcações estão sendo salvas.

#### Passo a passo:

**1. Abra `public/abs.html`**

**2. Busque a função `salvarMarcacoes()`:**
```javascript
async function salvarMarcacoes() {
  // ANTES: (sem logs)
  
  const modificacoes = Object.keys(estado.marcacoesModificadas)
  
  if (modificacoes.length === 0) {
    alert('⚠️ Nenhuma marcação foi alterada!')
    return
  }
  
  // ... resto do código
}
```

**3. Adicione logs:**
```javascript
async function salvarMarcacoes() {
  console.log('[DEBUG] 🚀 Iniciando salvamento...')
  
  const modificacoes = Object.keys(estado.marcacoesModificadas)
  console.log('[DEBUG] 📊 Total de modificações:', modificacoes.length)
  console.log('[DEBUG] 👥 Colaboradores modificados:', modificacoes)
  
  if (modificacoes.length === 0) {
    console.log('[DEBUG] ⚠️ Nenhuma modificação encontrada. Abortando.')
    alert('⚠️ Nenhuma marcação foi alterada!')
    return
  }
  
  // ... resto do código
  
  console.log('[DEBUG] ✅ Salvamento concluído com sucesso!')
}
```

**4. Salve, build, teste:**
```bash
npm run build
pm2 restart all
```

**5. Abra o Console (F12) e salve uma marcação**

**6. Você verá:**
```
[DEBUG] 🚀 Iniciando salvamento...
[DEBUG] 📊 Total de modificações: 3
[DEBUG] 👥 Colaboradores modificados: ['S007450', 'S007451', 'S007452']
[DEBUG] ✅ Salvamento concluído com sucesso!
```

**7. Commit e push:**
```bash
git add public/abs.html
git commit -m "debug(abs): Adicionar logs detalhados em salvarMarcacoes"
git push origin main
```

### 10.5 Exemplo 5: Corrigir um Bug

#### Cenário:
Usuários reportam que depois de salvar, a tela fica "recarregando" por muito tempo.

#### Diagnóstico:

**1. Abra o Console (F12)**

**2. Salve uma marcação**

**3. Veja os logs:**
```
[ABS] 💾 SALVANDO MARCAÇÕES - INÍCIO
[ABS] 2 marcações a salvar: [...]
[ABS] ✅ SALVAMENTO CONCLUÍDO - SEM RELOAD/FETCH
[ABS] 🔄 carregarColaboradores() CHAMADO  ← ⚠️ PROBLEMA!
Stack trace:
  at carregarColaboradores (abs.html:1596)
  at window.irPara (abs.html:2051)
```

#### Solução:

**1. Abra `public/abs.html`**

**2. Busque `window.irPara` (linha ~2051):**
```javascript
// ANTES (COM BUG):
window.irPara = function(telaId) {
  irParaOriginal(telaId)
  
  // ⚠️ PROBLEMA: Sempre chama carregarColaboradores()
  if (telaId === 'tela-marcacao' && estado.warehouse) {
    carregarColaboradores(estado.warehouse, 'Fevereiro', 2026, 16)
  }
}
```

**3. Adicione uma verificação:**
```javascript
// DEPOIS (CORRIGIDO):
window.irPara = function(telaId) {
  // 🔥 FIX: Se já está na tela de marcação, NÃO recarregar
  const telaAtual = document.querySelector('.tela.active')?.id
  if (telaAtual === 'tela-marcacao' && telaId === 'tela-marcacao') {
    console.log('✅ JÁ NA TELA DE MARCAÇÃO - Ignorando reload')
    return
  }
  
  irParaOriginal(telaId)
  
  if (telaId === 'tela-marcacao' && estado.warehouse) {
    carregarColaboradores(estado.warehouse, 'Fevereiro', 2026, 16)
  }
}
```

**4. Salve, build, teste:**
```bash
npm run build
pm2 restart all
# Salve uma marcação e veja que NÃO recarrega mais
```

**5. Commit e push:**
```bash
git add public/abs.html
git commit -m "fix(abs): Evitar reload desnecessário ao salvar marcação"
git push origin main
```

---

## 11. Glossário de Termos

### Termos de Programação

| Termo | Significado | Exemplo |
|-------|-------------|---------|
| **API** | Application Programming Interface - "Ponte" para acessar dados de outros sistemas | Google Sheets API |
| **Backend** | Parte do código que roda no **servidor** (não vê no navegador) | `src/index.tsx` |
| **Build** | Compilar o código (transformar de TypeScript para JavaScript) | `npm run build` |
| **Cache** | Dados salvos temporariamente para carregar mais rápido | Cache do navegador |
| **Commit** | "Salvar" uma versão do código no Git | `git commit -m "fix"` |
| **Deploy** | Publicar o código na internet | Deploy no Railway |
| **Frontend** | Parte do código que roda no **navegador** (o que o usuário vê) | `public/abs.html` |
| **Git** | Sistema de controle de versão (histórico de alterações) | `git add`, `git commit` |
| **GitHub** | Site que guarda repositórios Git online | https://github.com |
| **HTML** | Linguagem que define a **estrutura** da página | `<div>`, `<button>` |
| **JavaScript (JS)** | Linguagem que adiciona **funcionalidade** à página | `function salvar()` |
| **JSON** | Formato de texto para trocar dados | `{"nome": "Rafael"}` |
| **Node.js** | Programa que executa JavaScript fora do navegador | Rodar servidor local |
| **npm** | Node Package Manager - gerenciador de pacotes | `npm install` |
| **Push** | Enviar commits para o GitHub | `git push origin main` |
| **Repository (Repo)** | Pasta que contém o código e o histórico Git | `portal-spxfulfillment` |
| **TypeScript (TS)** | JavaScript com tipos (mais seguro) | `const x: string = "ok"` |

### Termos do Projeto

| Termo | Significado |
|-------|-------------|
| **ABS** | Sistema de Apontamento de Boleto e Sinistro |
| **Colaborador** | Funcionário do warehouse |
| **Desligamento** | Quando um colaborador sai da empresa (códigos: DV, DP, DF) |
| **Marcação** | Registrar presença/falta de um colaborador |
| **Presença Automática** | Marcação gerada automaticamente pelo sistema |
| **Sinergia** | Registro de mudança de setor do colaborador |
| **Supervisor** | Gerente responsável por um grupo de colaboradores |
| **Warehouse** | Centro de distribuição (PE, GO, SP) |
| **WFM User** | Identificador único do colaborador |

### Comandos do Terminal

| Comando | O que faz | Exemplo |
|---------|-----------|---------|
| `cd` | Change Directory - Mudar de pasta | `cd Documents` |
| `ls` | List - Listar arquivos da pasta atual | `ls -la` |
| `pwd` | Print Working Directory - Mostrar pasta atual | `pwd` |
| `mkdir` | Make Directory - Criar pasta | `mkdir projetos` |
| `rm` | Remove - Deletar arquivo | `rm arquivo.txt` |
| `cat` | Mostrar conteúdo de arquivo | `cat package.json` |
| `grep` | Buscar texto em arquivos | `grep "função"` |

---

## 12. Comandos Úteis

### 12.1 Git (Controle de Versão)

```bash
# Ver status (arquivos alterados):
git status

# Ver diferenças (o que foi alterado):
git diff

# Adicionar TODOS os arquivos alterados:
git add -A

# Adicionar arquivo específico:
git add public/abs.html

# Criar commit:
git commit -m "fix: descrição"

# Enviar para GitHub:
git push origin main

# Puxar últimas mudanças do GitHub:
git pull origin main

# Ver histórico de commits:
git log --oneline

# Ver últimos 5 commits:
git log --oneline -5

# Ver todas as branches:
git branch -a

# Criar nova branch:
git checkout -b nome-da-branch

# Mudar para branch existente:
git checkout main

# Ver diferenças de um arquivo específico:
git diff public/abs.html

# Desfazer alterações (CUIDADO!):
git checkout -- public/abs.html

# Ver quem fez cada linha de código:
git blame public/abs.html
```

### 12.2 npm (Gerenciador de Pacotes)

```bash
# Instalar dependências:
npm install

# Instalar pacote específico:
npm install nome-do-pacote

# Desinstalar pacote:
npm uninstall nome-do-pacote

# Atualizar pacotes:
npm update

# Ver versão do npm:
npm --version

# Ver pacotes instalados:
npm list

# Limpar cache:
npm cache clean --force

# Reinstalar dependências (se der erro):
rm -rf node_modules package-lock.json
npm install
```

### 12.3 Build e Deploy

```bash
# Build do projeto:
npm run build

# Iniciar servidor localmente (desenvolvimento):
npm run dev

# Iniciar com PM2:
pm2 start ecosystem.config.cjs

# Ver status do PM2:
pm2 status

# Ver logs do PM2:
pm2 logs --nostream

# Reiniciar com PM2:
pm2 restart all

# Parar com PM2:
pm2 stop all

# Remover do PM2:
pm2 delete all

# Iniciar servidor diretamente (produção):
node dist/server.js
```

### 12.4 Debug e Testes

```bash
# Verificar se porta 3000 está em uso (Linux/Mac):
lsof -ti:3000

# Matar processo na porta 3000 (Linux/Mac):
lsof -ti:3000 | xargs kill -9

# Verificar porta (Windows):
netstat -ano | findstr :3000

# Testar rota com curl:
curl http://localhost:3000

# Testar com headers:
curl -H "user-email: rafael@spxfulfillment.com" http://localhost:3000/abs

# Buscar texto em arquivos:
grep -r "mostrarLoading" public/

# Buscar e mostrar número da linha:
grep -rn "mostrarLoading" public/

# Contar linhas de código:
wc -l public/abs.html

# Ver tamanho dos arquivos:
ls -lh public/
```

### 12.5 Railway CLI (Opcional)

```bash
# Instalar Railway CLI:
npm install -g @railway/cli

# Login:
railway login

# Conectar ao projeto:
railway link

# Ver variáveis de ambiente:
railway variables

# Adicionar variável:
railway variables set KEY=value

# Ver logs ao vivo:
railway logs

# Fazer deploy manual:
railway up

# Abrir projeto no navegador:
railway open
```

### 12.6 Atalhos do VS Code

| Atalho | Função |
|--------|--------|
| `Ctrl + S` | Salvar arquivo |
| `Ctrl + F` | Buscar no arquivo |
| `Ctrl + H` | Buscar e substituir |
| `Ctrl + Shift + F` | Buscar em todos os arquivos |
| `Ctrl + P` | Abrir arquivo rápido |
| `Ctrl + Shift + P` | Abrir Command Palette |
| `Ctrl + /` | Comentar/descomentar linha |
| `Ctrl + D` | Selecionar próxima ocorrência |
| `Alt + ↑/↓` | Mover linha para cima/baixo |
| `Ctrl + Shift + K` | Deletar linha |
| `Ctrl + B` | Abrir/fechar sidebar |
| `Ctrl + \`` | Abrir terminal integrado |

---

## 13. Checklist de Deploy

Antes de fazer push para produção, verifique:

### ✅ Checklist

- [ ] **Testei localmente** (`npm run build` + `pm2 restart all`)
- [ ] **Abri o navegador** e testei em `http://localhost:3000/abs`
- [ ] **Verifiquei o Console** (F12) - sem erros
- [ ] **Comentei código antigo** ao invés de deletar
- [ ] **Adicionei logs de debug** se necessário
- [ ] **Verifiquei o `.gitignore`** - não estou commitando arquivos sensíveis
- [ ] **Escrevi mensagem de commit descritiva** (`git commit -m "fix(abs): ..."`)
- [ ] **Fiz push** (`git push origin main`)
- [ ] **Acompanhei o deploy** no Railway (https://railway.app/dashboard)
- [ ] **Aguardei 3-5 minutos** para o deploy completar
- [ ] **Testei no Railway** (force refresh: `Ctrl + Shift + R`)
- [ ] **Verifiquei o Console de produção** - sem erros

---

## 14. Fluxo de Trabalho Completo (Resumo Visual)

```
┌─────────────────────────────────────────────────────────────┐
│                   1. PLANEJAMENTO                            │
│  "O que precisa ser alterado?"                              │
│  - Escreva no papel o que vai mudar                         │
│  - Identifique qual arquivo precisa editar                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   2. PREPARAÇÃO                              │
│  Atualize seu código local:                                 │
│  $ git pull origin main                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   3. DESENVOLVIMENTO                         │
│  - Abra VS Code                                             │
│  - Edite o arquivo (ex: public/abs.html)                    │
│  - Salve (Ctrl + S)                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   4. BUILD LOCAL                             │
│  $ npm run build                                            │
│  ✅ Build concluído: dist/index.js                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   5. TESTE LOCAL                             │
│  $ pm2 restart all                                          │
│  Abra: http://localhost:3000/abs                            │
│  Teste a funcionalidade                                     │
│  Abra Console (F12) - veja se tem erros                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              6. COMMIT & PUSH (se teste OK)                  │
│  $ git add -A                                               │
│  $ git commit -m "fix(abs): descrição da mudança"           │
│  $ git push origin main                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                7. ACOMPANHAR DEPLOY                          │
│  - Acesse: https://railway.app/dashboard                    │
│  - Clique no projeto                                        │
│  - Aba "Deployments"                                        │
│  - Status: Building → Deploying → Success                   │
│  - Aguarde 3-5 minutos                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                8. TESTE EM PRODUÇÃO                          │
│  - Abra: https://portal-spxfulfillment.up.railway.app/abs  │
│  - Force refresh (Ctrl + Shift + R)                         │
│  - Teste a funcionalidade                                   │
│  - Abra Console (F12) - veja se tem erros                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    9. SUCESSO! 🎉                            │
│  Alteração publicada com sucesso                            │
│  Usuários já podem ver a nova versão                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 15. Suporte e Contato

### Dúvidas Frequentes

**P: Quanto tempo leva um deploy no Railway?**
R: Normalmente 3-5 minutos. Se demorar mais de 10 minutos, verifique os logs.

**P: Como desfazer um commit?**
R: 
```bash
# Ver histórico:
git log --oneline

# Desfazer último commit (mantém alterações):
git reset --soft HEAD~1

# Desfazer último commit (descarta alterações):
git reset --hard HEAD~1
```

**P: Como voltar para uma versão anterior?**
R:
```bash
# Ver commits:
git log --oneline

# Voltar para commit específico:
git checkout <hash-do-commit>

# Voltar para a main:
git checkout main
```

**P: O que fazer se o Railway der erro?**
R:
1. Acesse o painel do Railway
2. Clique em `Deployments`
3. Clique no deploy com erro
4. Veja os logs (aba `Build Logs` ou `Deploy Logs`)
5. Copie o erro e pesquise no Google

### Recursos Úteis

- **Documentação do Git:** https://git-scm.com/doc
- **Documentação do Node.js:** https://nodejs.org/docs
- **Documentação do Railway:** https://docs.railway.app/
- **Tailwind CSS (usado no projeto):** https://tailwindcss.com/docs
- **Font Awesome (ícones):** https://fontawesome.com/icons

---

## 16. Conclusão

Parabéns! 🎉 Você chegou ao final do guia.

Agora você sabe:
- ✅ Estrutura do projeto
- ✅ Como editar código
- ✅ Como testar localmente
- ✅ Como fazer deploy no Railway
- ✅ Como resolver problemas comuns

### Próximos Passos

1. **Pratique!** Faça pequenas alterações e teste
2. **Documente!** Anote os problemas que encontrou
3. **Pergunte!** Se tiver dúvidas, pesquise ou peça ajuda
4. **Compartilhe!** Ajude outros iniciantes

### Lembre-se:

> **"O único erro é não tentar."**

Todos os desenvolvedores começaram como você. Com prática e paciência, você vai melhorar cada vez mais! 💪

---

**Versão do Guia:** 1.0  
**Última Atualização:** 24 de Fevereiro de 2026  
**Autor:** Sistema de Documentação Automatizada  
**Projeto:** Portal SPX Fulfillment  

---

