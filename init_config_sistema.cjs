/**
 * Script para criar e inicializar a aba 'config_sistema' no Google Sheets
 * Gerencia cidades e cargos disponíveis no sistema
 * 
 * Execução: node init_config_sistema.cjs
 */

const { google } = require('googleapis');

// Credenciais da Service Account
const SERVICE_ACCOUNT = {
  type: 'service_account',
  project_id: 'solar-bebop-472002-k5',
  private_key_id: '4e260b24a103608510470ca3e27b824425fa8e1a',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCc4bY5s/A99+pe\nGF0cMpt4TdBG4QafrZQbGFf5RAathY7ojN4tJpQaijZNGDsCBa9462cNoRbYX0hL\nAMeeq3GpmKVVVnXE8iYBShpmUs8MMCBvU7qSzkb5Gyalg07SeY7frzIjDO7X3BrM\n1bmR2Doy26PaTgY9CZkCz8KtQGCG53SpYq+l0xZfxfonyeHhA+hJOYE27kEOiqMw\nqZJ+N6nIcwD20UEKuMTXZltdqE1psZo1DlJNzkS5ghjSfcdXkVD3OKmy05uSIQZz\nE2pEKRQXAGcjgH+kQt99aV4Wam4QDZ2YBIMYPD5a4otTeQQl5T6ZKwzd9Lf15hcP\n9yM1EqrVAgMBAAECggEAMCiBndkEyKEQCu6DtqI6Y4XPh9KQC/hm3KJubxBY1G+J\nXQ3RLh8Hm9YNsUDc7FP+d6obqm1m6+jj8lI89RJABAXdywKNiHWlAQRUclC9SkqD\nymjzfxlfZBzXkjtquOWj3DqVs3jG4PCqMXLyUjkENJSECgGlnJsTo29PnYuDliV/\n6a8WnDhkptxYfwaTWiP/dQcs67terZIzZ1AJTDm9+eWgypwZVHAMi7BiyvpFFNDE\nQgjKTeebbXiugNjgJ6/BAtI0quoHiWXbqJ6fCwSH5Ar2Q0DlN44biudl+bnogeEJ\ntNHx9v7QrT7/wzpsQ3/FQfEC+sbfVzCfuHjotU5fSQKBgQDPFUrhxShHQS65LRUq\neFeWcX4y8lvZrxmVKV+Z6jhsYeJJolJ/fODGO6CEpqSYYH3XxTPtdGthRNnkRZrx\nWnGdGGoQdG3NSHNDTlpLvWXUy+e96JJaYf/iTPWiBXozwW8wGmLQnP28G5AAZRx+\nmSLnfyAgS+LtEEoF/+BTseGMrwKBgQDB8KQui3/QLCSVwsDm8Kjwov3VEGvkmXtF\n8q6D/TGGs2dGZ/P0ELB1XF2KBGTZNjmS6XBqnhBWcyd0b3lVYi+zokwZKnYqETaX\nuE2fllFmBU1QGiLYn6VQMZxd6bI6nX5kQRdD91pn7nJrJC97XvLwl+oH+5YhWWgp\nrzGLGb1JuwKBgGNNf5oiVD1PGZu87bBvAvlmtTCzHa6Wk/r+WxTQx3vZuIy85Tiz\nZopI36Gc08MqSk5lB5CvyipbvO0FH9brGx5NLdd0LY9KVdOJyC0XxrQzj45272+e\nHPmlFAk8/SvCb5IupQIKtnY09WnrEq32u1EtmfdCzLAHpqeX2zfnThSLAoGAShBg\nYvYbRaDWB+tsR8W4fs2AKpIu4gpLLZdUVkunUk3JLvYcECUffnJbto2fBeTTb+t+\nZvkePCWV971qlNT+apecgC/bGI2iT6au3jdFtrRnpiOVEy1EsK+Bi8vnqMLktdy1\nydr4x6AkSg5zo6XLGV6qnYnS98FxKhohzYFy7GkCgYA/TJwa5YkQZTCVSsLaHu49\nx6F4r1zSZrNz+Yi8k2M7LKkxctgOe+X2x2HhTYpOi6myIfTKfrcmQbvivB0v6seu\nC1pd9xIo/r4VlmXuQpHHGpSLG3Y4sy9O+mGzJ8N2s1oQWH+VqGnBR7E9Y0chLR9/\nLjhmlIvUTLugy9IiY28HSQ==\n-----END PRIVATE KEY-----\n',
  client_email: 'sheets-bot@solar-bebop-472002-k5.iam.gserviceaccount.com',
  client_id: '117651985036264846421',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/sheets-bot%40solar-bebop-472002-k5.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
};

const SPREADSHEET_ID = '1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg';
const SHEET_NAME = 'config_sistema';

async function initConfigSistema() {
  console.log('🔧 Inicializando aba config_sistema...\n');
  
  try {
    // Autenticação
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // 1. Verificar se a aba já existe
    console.log('📋 Verificando se aba existe...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    
    const sheetExists = spreadsheet.data.sheets?.some(
      sheet => sheet.properties?.title === SHEET_NAME
    );
    
    if (!sheetExists) {
      console.log('➕ Criando aba config_sistema...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEET_NAME,
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 5
                }
              }
            }
          }]
        }
      });
      console.log('✅ Aba criada!\n');
    } else {
      console.log('✅ Aba já existe!\n');
    }
    
    // 2. Criar estrutura com duas seções: CIDADES e CARGOS
    console.log('📝 Criando estrutura...');
    
    const estrutura = [
      // Linha 1: Título Cidades
      ['CIDADES DISPONÍVEIS', '', '', '', ''],
      // Linha 2: Cabeçalho Cidades
      ['ID', 'Nome', 'Status', '', ''],
      // Linhas 3-7: Cidades iniciais
      [1, 'São Paulo', 'ATIVO', '', ''],
      [2, 'Pernambuco', 'ATIVO', '', ''],
      [3, 'Rio de Janeiro', 'ATIVO', '', ''],
      [4, 'Minas Gerais', 'ATIVO', '', ''],
      ['', '', '', '', ''],
      // Linha 8: Título Cargos
      ['CARGOS DISPONÍVEIS', '', '', '', ''],
      // Linha 9: Cabeçalho Cargos
      ['ID', 'Nome', 'Icone', 'Descricao', 'Status'],
      // Linhas 10-13: Cargos iniciais
      [1, 'Básico', 'fa-user', 'Acesso básico ao sistema', 'ATIVO'],
      [2, 'Analista', 'fa-chart-line', 'Análise e relatórios', 'ATIVO'],
      [3, 'Supervisor', 'fa-users', 'Supervisão de equipe', 'ATIVO'],
      [4, 'Gestor', 'fa-crown', 'Gestão completa', 'ATIVO']
    ];
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:E13`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: estrutura
      }
    });
    
    console.log('✅ Estrutura criada!\n');
    
    // 3. Atualizar aba raw_logins para incluir coluna Cidade
    console.log('📝 Atualizando aba raw_logins...');
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'raw_logins!A1:I1'
    });
    
    const currentHeader = headerResponse.data.values?.[0] || [];
    
    // Se não tem coluna Cidade (posição I), adiciona
    if (currentHeader.length < 9 || currentHeader[8] !== 'Cidade') {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'raw_logins!A1:I1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            'ID',
            'Email',
            'Nome',
            'Cargo_Solicitado',
            'Status',
            'Data_Cadastro',
            'Nivel',
            'Avatar_URL',
            'Cidade'
          ]]
        }
      });
      console.log('✅ Coluna Cidade adicionada em raw_logins!\n');
    } else {
      console.log('✅ Coluna Cidade já existe em raw_logins!\n');
    }
    
    // 4. Atualizar aba portal_opcoes para incluir coluna Cidade
    console.log('📝 Atualizando aba portal_opcoes...');
    const opcoesHeaderResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'portal_opcoes!A1:H1'
    });
    
    const currentOpcoesHeader = opcoesHeaderResponse.data.values?.[0] || [];
    
    // Se não tem coluna Cidade (posição H), adiciona
    if (currentOpcoesHeader.length < 8 || currentOpcoesHeader[7] !== 'Cidade') {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!A1:H1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            'ID',
            'Nome',
            'Descricao',
            'Link',
            'Nivel_Minimo',
            'Icone',
            'Status',
            'Cidade'
          ]]
        }
      });
      console.log('✅ Coluna Cidade adicionada em portal_opcoes!\n');
      
      // Atualizar opções existentes com cidade padrão "Todas"
      const opcoesData = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!A2:G100'
      });
      
      if (opcoesData.data.values && opcoesData.data.values.length > 0) {
        const updates = opcoesData.data.values.map((row, index) => {
          return [`portal_opcoes!H${index + 2}`, [['Todas']]];
        });
        
        for (const [range, values] of updates) {
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values }
          });
        }
        console.log(`✅ ${updates.length} opções atualizadas com cidade "Todas"!\n`);
      }
    } else {
      console.log('✅ Coluna Cidade já existe em portal_opcoes!\n');
    }
    
    console.log('🎉 SUCESSO! Aba config_sistema está pronta!\n');
    console.log('📊 Estrutura:');
    console.log('   CIDADES:');
    console.log('   - ID, Nome, Status');
    console.log('   ');
    console.log('   CARGOS:');
    console.log('   - ID, Nome, Icone, Descricao, Status\n');
    console.log('🔗 Planilha: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar
initConfigSistema();
