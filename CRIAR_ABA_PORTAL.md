# 📚 GUIA RÁPIDO - CRIAR ABA portal_opcoes NO GOOGLE SHEETS

## 📝 **PASSO A PASSO:**

### **1. Abrir a Planilha**
```
https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg
```

### **2. Criar Nova Aba**
- Clique no **"+"** no canto inferior esquerdo
- Nome da aba: `portal_opcoes`

### **3. Adicionar Cabeçalho (Linha 1)**
Copie e cole na linha 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | Nome | Descricao | Link | Nivel_Minimo | Status | Icone |

### **4. Adicionar Opções de Exemplo (A partir da linha 2)**

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 1 | Planilha Base | Planilha principal de dados | https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg | 0 | ativo | 📊 |
| 2 | Dashboard Vendas | Dashboard de análise de vendas | https://lookerstudio.google.com/ | 1 | ativo | 📈 |
| 3 | Relatório Financeiro | Relatórios financeiros mensais | https://docs.google.com/spreadsheets/d/exemplo | 5 | ativo | 💰 |

### **5. Pronto!**
A aba está criada e o portal já pode buscar os dados.

---

## 📊 **ESTRUTURA DAS COLUNAS:**

- **A (ID):** Número sequencial (1, 2, 3...)
- **B (Nome):** Nome da opção (ex: "Planilha Base")
- **C (Descricao):** Descrição curta
- **D (Link):** URL completa (Google Sheets, Looker, etc.)
- **E (Nivel_Minimo):** Número (0, 1, 5, 10...)
- **F (Status):** "ativo" ou "inativo"
- **G (Icone):** Emoji (📊, 📈, 💰, ⚙️, 👥, etc.)

---

## ⚙️ **COMO ADICIONAR NOVAS OPÇÕES MANUALMENTE:**

1. Vá para a última linha com dados
2. Adicione uma nova linha abaixo
3. Preencha:
   - **ID:** Próximo número (ex: se último é 3, use 4)
   - **Nome:** Nome da opção
   - **Descricao:** Descrição
   - **Link:** URL completa
   - **Nivel_Minimo:** Nível necessário (0, 1, 5, 10)
   - **Status:** "ativo"
   - **Icone:** Emoji de sua escolha

---

## 🎯 **EXEMPLOS DE OPÇÕES:**

```
ID | Nome                    | Nivel | Icone
---+-------------------------+-------+-------
1  | Planilha Base           | 0     | 📊
2  | Dashboard Vendas        | 1     | 📈
3  | Relatório Financeiro    | 5     | 💰
4  | Configurações Sistema   | 10    | ⚙️
5  | Gerenciar Usuários      | 10    | 👥
6  | Logs do Sistema         | 10    | 📋
7  | Backup de Dados         | 10    | 💾
```

---

**Crie a aba agora e me confirme quando terminar!** ✅
