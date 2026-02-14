import { google } from 'googleapis'
import { SERVICE_ACCOUNT, SPREADSHEET_ID, SHEET_NAME } from '../config'

/**
 * Gerenciador do Google Sheets
 */
export class SheetsManager {
  private sheets
  
  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })
    
    this.sheets = google.sheets({ version: 'v4', auth })
  }
  
  /**
   * Inicializa a estrutura da aba raw_logins se não existir
   */
  async initializeSheet() {
    try {
      // Verifica se a aba existe
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
      })
      
      const sheetExists = spreadsheet.data.sheets?.some(
        (sheet) => sheet.properties?.title === SHEET_NAME
      )
      
      if (!sheetExists) {
        // Cria a aba
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: SHEET_NAME
                }
              }
            }]
          }
        })
      }
      
      // Verifica se tem cabeçalho
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:H1`
      })
      
      if (!response.data.values || response.data.values.length === 0) {
        // Cria cabeçalho
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1:H1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
              'ID',
              'Email',
              'Nome',
              'Cargo_Solicitado',
              'Status',
              'Data_Cadastro',
              'Nivel',
              'Avatar_URL'
            ]]
          }
        })
      }
      
      return true
    } catch (error) {
      console.error('Erro ao inicializar sheet:', error)
      return false
    }
  }
  
  /**
   * Busca usuário por email
   */
  async findUserByEmail(email: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:I1000` // Agora inclui coluna I (Cidade)
      })
      
      const rows = response.data.values || []
      
      for (const row of rows) {
        if (row[1] === email) { // Coluna B = Email
          return {
            id: row[0],
            email: row[1],
            nome: row[2],
            cargo_solicitado: row[3],
            status: row[4],
            data_cadastro: row[5],
            nivel: row[6],
            avatar_url: row[7],
            cidade: row[8] || '' // Nova coluna
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  }
  
  /**
   * Insere novo usuário no Google Sheets
   */
  async insertUser(data: {
    email: string
    nome: string
    cargo_solicitado: string
    status: string
    avatar?: string
    data_cadastro: string
    cidade: string
  }) {
    try {
      // Busca o último ID
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:A1000`
      })
      
      const rows = response.data.values || []
      const lastId = rows.length > 0 ? parseInt(rows[rows.length - 1][0] || '0') : 0
      const newId = lastId + 1
      
      // Prepara dados (agora com cidade na coluna I)
      const newRow = [
        newId,
        data.email,
        data.nome,
        data.cargo_solicitado,
        data.status,
        data.data_cadastro,
        '', // Nivel vazio
        data.avatar || '',
        data.cidade // Nova coluna
      ]
      
      // Insere na planilha
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [newRow]
        }
      })
      
      console.log('[SHEETS] Usuário inserido com sucesso:', data.email)
      
      return { success: true, id: newId }
    } catch (error) {
      console.error('[SHEETS] Erro ao inserir usuário:', error)
      throw error
    }
  }

  /**
   * Retorna label amigável para o nível
   */
  private getNivelLabel(nivel: number): string {
    if (nivel >= 10) return 'Admin'
    if (nivel >= 5) return 'Supervisor'
    if (nivel >= 1) return 'Analista'
    return 'Básico'
  }

  /**
   * Busca opções do portal filtradas por nível de acesso e cidade
   */
  async getPortalOpcoes(nivelUsuario: number, cidadeUsuario: string, setorFiltro?: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!A2:I1000'
      })

      const rows = response.data.values || []
      const opcoes = []

      for (const row of rows) {
        const nivelMinimo = parseInt(row[4] || '0')
        const status = (row[6] || 'INATIVO').toUpperCase()
        const cidade = row[7] || 'Todas'
        const setor = row[8] || 'GERAL'

        // Admin (nível 10) vê TODAS as opções de TODAS as cidades
        // Outros usuários vêem apenas opções da sua cidade ou "Todas"
        const isAdmin = nivelUsuario >= 10
        const cidadeMatch = isAdmin || cidade === 'Todas' || cidade === cidadeUsuario
        
        // Filtro por setor (se fornecido)
        const setorMatch = !setorFiltro || setorFiltro === 'TODOS' || setor === setorFiltro
        
        if (status === 'ATIVO' && nivelUsuario >= nivelMinimo && cidadeMatch && setorMatch) {
          opcoes.push({
            id: row[0],
            nome: row[1],
            descricao: row[2],
            link: row[3],
            nivel_minimo: nivelMinimo,
            nivel_minimo_label: this.getNivelLabel(nivelMinimo),
            icone: row[5] || 'fa-file',
            status: status,
            cidade: cidade,
            setor: setor
          })
        }
      }

      return opcoes
    } catch (error) {
      console.error('[SHEETS] Erro ao buscar opções do portal:', error)
      return []
    }
  }

  /**
   * Insere nova opção no portal
   */
  async insertPortalOpcao(data: {
    nome: string
    descricao: string
    link: string
    nivel_minimo: number
    icone?: string
    cidade?: string
    setor?: string
  }) {
    try {
      // Busca o último ID
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!A2:A1000'
      })

      const rows = response.data.values || []
      const lastId = rows.length > 0 ? parseInt(rows[rows.length - 1][0] || '0') : 0
      const newId = lastId + 1

      const newRow = [
        newId,
        data.nome,
        data.descricao,
        data.link,
        data.nivel_minimo,
        data.icone || 'fa-file',
        'ATIVO',
        data.cidade || 'Todas',
        data.setor || 'GERAL' // Nova coluna Setor
      ]

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!A2',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [newRow]
        }
      })

      console.log('[SHEETS] Opção do portal inserida:', data.nome)
      return { success: true, id: newId }
    } catch (error) {
      console.error('[SHEETS] Erro ao inserir opção:', error)
      throw error
    }
  }

  /**
   * Inicializa aba portal_opcoes se não existir
   */
  async initPortalOpcoes() {
    try {
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
      })

      const sheetExists = spreadsheet.data.sheets?.some(
        (sheet) => sheet.properties?.title === 'portal_opcoes'
      )

      if (!sheetExists) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: 'portal_opcoes'
                }
              }
            }]
          }
        })

        // Criar cabeçalho
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: 'portal_opcoes!A1:G1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
              'ID', 'Nome', 'Descricao', 'Link', 'Nivel_Minimo', 'Status', 'Icone'
            ]]
          }
        })

        // Adicionar opções de exemplo
        const opcoes = [
          [1, 'Planilha Base', 'Planilha principal de dados', 'https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg', 0, 'ativo', '📊'],
          [2, 'Dashboard Vendas', 'Dashboard de análise', 'https://lookerstudio.google.com/', 1, 'ativo', '📈']
        ]

        await this.sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: 'portal_opcoes!A2',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: opcoes
          }
        })

        console.log('[SHEETS] Aba portal_opcoes inicializada')
      }

      return true
    } catch (error) {
      console.error('[SHEETS] Erro ao inicializar portal_opcoes:', error)
      return false
    }
  }

  /**
   * Lista todos os usuários pendentes de aprovação
   */
  async getPendingUsers() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:I1000`
      })

      const rows = response.data.values || []
      const pendingUsers = []

      for (const row of rows) {
        if (row[4] === 'PENDENTE') {
          pendingUsers.push({
            id: row[0],
            email: row[1],
            nome: row[2],
            cargo_solicitado: row[3],
            status: row[4],
            data_cadastro: row[5],
            nivel: row[6],
            avatar_url: row[7],
            cidade: row[8] || ''
          })
        }
      }

      return pendingUsers
    } catch (error) {
      console.error('[SHEETS] Erro ao buscar usuários pendentes:', error)
      return []
    }
  }

  /**
   * Lista TODOS os usuários (independente do status)
   */
  async getAllUsers() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:I1000`
      })

      const rows = response.data.values || []
      const users = []

      for (const row of rows) {
        if (row[0]) { // Se tem ID
          users.push({
            id: row[0],
            email: row[1],
            nome: row[2],
            cargo_solicitado: row[3],
            status: row[4],
            data_cadastro: row[5],
            nivel: row[6] || '0',
            avatar_url: row[7],
            cidade: row[8] || 'Não informado'
          })
        }
      }

      return users
    } catch (error) {
      console.error('[SHEETS] Erro ao buscar todos os usuários:', error)
      return []
    }
  }

  /**
   * Atualiza o status de um usuário (aprovar/rejeitar)
   */
  async updateUserStatus(email: string, status: string, nivel?: number) {
    try {
      // Busca a linha do usuário
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:H1000`
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][1] === email) {
          rowIndex = i + 2 // +2 porque começa na linha 2
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Usuário não encontrado')
      }

      // Atualiza status
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!E${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[status]]
        }
      })

      // Se aprovar, atualiza nível também
      if (status === 'APROVADO' && nivel !== undefined) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!G${rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[nivel]]
          }
        })
      }

      console.log(`[SHEETS] Usuário ${email} atualizado para ${status}`)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao atualizar status:', error)
      throw error
    }
  }

  /**
   * Atualiza dados de um usuário (cidade, cargo, nível)
   */
  async updateUser(email: string, updates: { cidade?: string, cargo_solicitado?: string, nivel?: number }) {
    try {
      // Busca a linha do usuário
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:I1000`
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][1] === email) {
          rowIndex = i + 2 // +2 porque começa na linha 2
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Usuário não encontrado')
      }

      // Atualiza cidade (coluna I)
      if (updates.cidade !== undefined) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!I${rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[updates.cidade]]
          }
        })
      }

      // Atualiza cargo (coluna D)
      if (updates.cargo_solicitado !== undefined) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!D${rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[updates.cargo_solicitado]]
          }
        })
      }

      // Atualiza nível (coluna G)
      if (updates.nivel !== undefined) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!G${rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[updates.nivel]]
          }
        })
      }

      console.log(`[SHEETS] Usuário ${email} atualizado:`, updates)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao atualizar usuário:', error)
      throw error
    }
  }

  /**
   * Deleta um usuário da planilha
   */
  async deleteUser(email: string) {
    try {
      // Busca a linha do usuário
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:I1000`
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][1] === email) {
          rowIndex = i + 2 // +2 porque começa na linha 2
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Usuário não encontrado')
      }

      // Deleta a linha
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // ID da primeira aba (raw_logins)
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      })

      console.log(`[SHEETS] Usuário ${email} deletado`)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao deletar usuário:', error)
      throw error
    }
  }

  /**
   * Lista todas as opções do portal (para painel admin)
   */
  async getAllPortalOpcoes() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!A2:I1000'
      })

      const rows = response.data.values || []
      const opcoes = []

      for (const row of rows) {
        opcoes.push({
          id: row[0],
          nome: row[1],
          descricao: row[2],
          link: row[3],
          nivel_minimo: parseInt(row[4] || '0'),
          icone: row[5] || 'fa-file',
          status: (row[6] || 'INATIVO').toUpperCase(),
          cidade: row[7] || 'Todas',
          setor: row[8] || 'GERAL'
        })
      }

      return opcoes
    } catch (error) {
      console.error('[SHEETS] Erro ao buscar todas as opções:', error)
      return []
    }
  }

  /**
   * Busca cidades ativas do sistema
   */
  async getCidadesAtivas() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_sistema!A3:C100'
      })

      const rows = response.data.values || []
      const cidades = []

      for (const row of rows) {
        // Para quando encontrar linha vazia (fim da seção de cidades)
        if (!row[0] || row[0] === '') break
        
        const status = (row[2] || 'ATIVO').toUpperCase()
        if (status === 'ATIVO') {
          cidades.push({
            id: row[0],
            nome: row[1]
          })
        }
      }

      return cidades
    } catch (error) {
      console.error('[SHEETS] Erro ao buscar cidades:', error)
      return []
    }
  }

  /**
   * Busca cargos ativos do sistema
   */
  async getCargosAtivos() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_sistema!A10:E100'
      })

      const rows = response.data.values || []
      const cargos = []

      for (const row of rows) {
        if (!row[0] || row[0] === '') continue
        
        const status = (row[4] || 'ATIVO').toUpperCase()
        if (status === 'ATIVO') {
          cargos.push({
            id: row[0],
            nome: row[1],
            icone: row[2] || 'fa-user',
            descricao: row[3] || ''
          })
        }
      }

      return cargos
    } catch (error) {
      console.error('[SHEETS] Erro ao buscar cargos:', error)
      return []
    }
  }

  /**
   * Adiciona nova cidade
   */
  async addCidade(nome: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_sistema!A3:C100'
      })

      const rows = response.data.values || []
      let lastId = 0
      let lastRow = 2

      for (let i = 0; i < rows.length; i++) {
        if (!rows[i][0] || rows[i][0] === '') break
        lastId = parseInt(rows[i][0])
        lastRow = 3 + i
      }

      const newId = lastId + 1
      const newRow = lastRow + 1

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `config_sistema!A${newRow}:C${newRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[newId, nome, 'ATIVO']]
        }
      })

      console.log(`[SHEETS] Cidade ${nome} adicionada`)
      return { success: true, id: newId }
    } catch (error) {
      console.error('[SHEETS] Erro ao adicionar cidade:', error)
      throw error
    }
  }

  /**
   * Deleta uma cidade
   */
  async deleteCidade(id: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_sistema!A3:C100'
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === id) {
          rowIndex = i + 3 // +3 porque começa na linha 3
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Cidade não encontrada')
      }

      // Deleta a linha
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId('config_sistema'),
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      })

      console.log(`[SHEETS] Cidade ID ${id} deletada`)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao deletar cidade:', error)
      throw error
    }
  }

  /**
   * Adiciona novo cargo
   */
  async addCargo(nome: string, icone: string, descricao: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_sistema!A10:E100'
      })

      const rows = response.data.values || []
      let lastId = 0
      let lastRow = 9

      for (let i = 0; i < rows.length; i++) {
        if (!rows[i][0] || rows[i][0] === '') continue
        lastId = parseInt(rows[i][0])
        lastRow = 10 + i
      }

      const newId = lastId + 1
      const newRow = lastRow + 1

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `config_sistema!A${newRow}:E${newRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[newId, nome, icone, descricao, 'ATIVO']]
        }
      })

      console.log(`[SHEETS] Cargo ${nome} adicionado`)
      return { success: true, id: newId }
    } catch (error) {
      console.error('[SHEETS] Erro ao adicionar cargo:', error)
      throw error
    }
  }

  /**
   * Atualiza uma opção do portal
   */
  async updatePortalOpcao(id: string, data: {
    nome?: string
    descricao?: string
    link?: string
    nivel_minimo?: number
    icone?: string
    status?: string
    cidade?: string
    setor?: string
  }) {
    try {
      // Busca a linha da opção
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!A2:I1000'
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === id) {
          rowIndex = i + 2
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Opção não encontrada')
      }

      // Atualiza os campos fornecidos
      const updates = []
      if (data.nome !== undefined) {
        updates.push({
          range: `portal_opcoes!B${rowIndex}`,
          values: [[data.nome]]
        })
      }
      if (data.descricao !== undefined) {
        updates.push({
          range: `portal_opcoes!C${rowIndex}`,
          values: [[data.descricao]]
        })
      }
      if (data.link !== undefined) {
        updates.push({
          range: `portal_opcoes!D${rowIndex}`,
          values: [[data.link]]
        })
      }
      if (data.nivel_minimo !== undefined) {
        updates.push({
          range: `portal_opcoes!E${rowIndex}`,
          values: [[data.nivel_minimo]]
        })
      }
      if (data.icone !== undefined) {
        updates.push({
          range: `portal_opcoes!F${rowIndex}`,
          values: [[data.icone]]
        })
      }
      if (data.status !== undefined) {
        updates.push({
          range: `portal_opcoes!G${rowIndex}`,
          values: [[data.status.toUpperCase()]]
        })
      }
      if (data.cidade !== undefined) {
        updates.push({
          range: `portal_opcoes!H${rowIndex}`,
          values: [[data.cidade]]
        })
      }
      if (data.setor !== undefined) {
        updates.push({
          range: `portal_opcoes!I${rowIndex}`,
          values: [[data.setor]]
        })
      }

      // Executa todas as atualizações
      for (const update of updates) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: update.range,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: update.values
          }
        })
      }

      console.log(`[SHEETS] Opção ${id} atualizada`)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao atualizar opção:', error)
      throw error
    }
  }

  /**
   * Deleta uma opção do portal
   */
  async deletePortalOpcao(id: string) {
    try {
      // Busca a linha da opção
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!A2:I1000'
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === id) {
          rowIndex = i + 2 // +2 porque começa na linha 2
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Opção não encontrada')
      }

      // Deleta a linha
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId('portal_opcoes'),
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      })

      console.log(`[SHEETS] Opção ${id} deletada`)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao deletar opção:', error)
      throw error
    }
  }

  /**
   * Deleta um cargo
   */
  async deleteCargo(id: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_sistema!A10:E100'
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === id) {
          rowIndex = i + 10 // +10 porque começa na linha 10
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Cargo não encontrado')
      }

      // Deleta a linha
      const sheetId = await this.getSheetId('config_sistema')
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      })

      console.log(`[SHEETS] Cargo ID ${id} deletado`)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao deletar cargo:', error)
      throw error
    }
  }

  // ============ GERENCIAMENTO DE SETORES ============
  
  /**
   * Busca todos os setores ativos
   */
  async getSetoresAtivos() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_setores_niveis!A3:C100'
      })

      const rows = response.data.values || []
      const setores = rows
        .filter(row => row[0] && row[1] && row[2] === 'ATIVO')
        .map(row => ({
          id: parseInt(row[0]),
          nome: row[1],
          status: row[2]
        }))

      return setores
    } catch (error) {
      console.error('[SHEETS] Erro ao buscar setores:', error)
      return []
    }
  }

  /**
   * Adiciona novo setor
   */
  async addSetor(nome: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_setores_niveis!A3:C100'
      })

      const rows = response.data.values || []
      let lastId = 0
      let lastRow = 2

      for (let i = 0; i < rows.length; i++) {
        if (!rows[i][0] || rows[i][0] === '') break
        lastId = parseInt(rows[i][0])
        lastRow = 3 + i
      }

      const newId = lastId + 1
      const newRow = lastRow + 1

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `config_setores_niveis!A${newRow}:C${newRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[newId, nome, 'ATIVO']]
        }
      })

      console.log(`[SHEETS] Setor ${nome} adicionado`)
      return { success: true, id: newId }
    } catch (error) {
      console.error('[SHEETS] Erro ao adicionar setor:', error)
      throw error
    }
  }

  /**
   * Deleta um setor
   */
  async deleteSetor(id: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_setores_niveis!A3:C100'
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === id) {
          rowIndex = 3 + i
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Setor não encontrado')
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId('config_setores_niveis'),
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      })

      console.log(`[SHEETS] Setor ID ${id} deletado`)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao deletar setor:', error)
      throw error
    }
  }

  // ============ GERENCIAMENTO DE NÍVEIS CUSTOMIZADOS ============
  
  /**
   * Busca todos os níveis customizados
   */
  async getNiveisCustomizados() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_setores_niveis!F3:H100'
      })

      const rows = response.data.values || []
      const niveis = rows
        .filter(row => row[0] && row[1])
        .map(row => ({
          id: parseInt(row[0]),
          nivel: parseInt(row[1]),
          descricao: row[2] || ''
        }))

      return niveis
    } catch (error) {
      console.error('[SHEETS] Erro ao buscar níveis:', error)
      return []
    }
  }

  /**
   * Adiciona novo nível customizado
   */
  async addNivel(nivel: number, descricao: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_setores_niveis!F3:H100'
      })

      const rows = response.data.values || []
      let lastId = 0
      let lastRow = 2

      for (let i = 0; i < rows.length; i++) {
        if (!rows[i][0] || rows[i][0] === '') break
        lastId = parseInt(rows[i][0])
        lastRow = 3 + i
      }

      const newId = lastId + 1
      const newRow = lastRow + 1

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `config_setores_niveis!F${newRow}:H${newRow}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[newId, nivel, descricao]]
        }
      })

      console.log(`[SHEETS] Nível ${nivel} - ${descricao} adicionado`)
      return { success: true, id: newId }
    } catch (error) {
      console.error('[SHEETS] Erro ao adicionar nível:', error)
      throw error
    }
  }

  /**
   * Deleta um nível customizado
   */
  async deleteNivel(id: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'config_setores_niveis!F3:H100'
      })

      const rows = response.data.values || []
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === id) {
          rowIndex = 3 + i
          break
        }
      }

      if (rowIndex === -1) {
        throw new Error('Nível não encontrado')
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId('config_setores_niveis'),
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      })

      console.log(`[SHEETS] Nível ID ${id} deletado`)
      return { success: true }
    } catch (error) {
      console.error('[SHEETS] Erro ao deletar nível:', error)
      throw error
    }
  }

  /**
   * Helper: obtém o sheetId de uma aba pelo nome
   */
  private async getSheetId(sheetName: string): Promise<number> {
    const spreadsheet = await this.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    })

    const sheet = spreadsheet.data.sheets?.find(
      s => s.properties?.title === sheetName
    )

    return sheet?.properties?.sheetId || 0
  }
}

export const sheetsManager = new SheetsManager()
