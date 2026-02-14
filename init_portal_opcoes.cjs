/**
 * Script para criar e inicializar a aba 'portal_opcoes' no Google Sheets
 * 
 * Execução: node init_portal_opcoes.cjs
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
const SHEET_NAME = 'portal_opcoes';

async function initPortalOpcoes() {
  console.log('🔧 Inicializando aba portal_opcoes...\n');
  
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
      console.log('➕ Criando aba portal_opcoes...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEET_NAME,
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 10
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
    
    // 2. Verificar se tem cabeçalho
    console.log('📝 Verificando cabeçalho...');
    const headerRange = `${SHEET_NAME}!A1:G1`;
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: headerRange
    });
    
    const hasHeader = headerResponse.data.values && 
                      headerResponse.data.values.length > 0 &&
                      headerResponse.data.values[0].length > 0;
    
    if (!hasHeader) {
      console.log('➕ Criando cabeçalho...');
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: headerRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            'ID',
            'Nome',
            'Descricao',
            'Link',
            'Nivel_Minimo',
            'Icone',
            'Status'
          ]]
        }
      });
      console.log('✅ Cabeçalho criado!\n');
    } else {
      console.log('✅ Cabeçalho já existe!\n');
    }
    
    // 3. Verificar se tem dados
    console.log('🔍 Verificando dados...');
    const dataRange = `${SHEET_NAME}!A2:G100`;
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: dataRange
    });
    
    const hasData = dataResponse.data.values && 
                    dataResponse.data.values.length > 0;
    
    if (!hasData) {
      console.log('➕ Inserindo dados de exemplo...');
      
      const exampleData = [
        // ID, Nome, Descrição, Link, Nível Mínimo, Ícone, Status
        [1, 'Planilha Base', 'Planilha principal de dados', 'https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg', 0, 'fa-table', 'ATIVO'],
        [2, 'Dashboard Vendas', 'Dashboard de análise de vendas', 'https://example.com/dashboard-vendas', 1, 'fa-chart-line', 'ATIVO'],
        [3, 'Relatório Financeiro', 'Relatórios financeiros completos', 'https://example.com/relatorio-financeiro', 5, 'fa-file-invoice-dollar', 'ATIVO'],
        [4, 'Configurações', 'Configurações do sistema', '/admin/config', 10, 'fa-cog', 'ATIVO'],
        [5, 'Gerenciar Usuários', 'Aprovar e gerenciar usuários', '/admin/users', 10, 'fa-users-cog', 'ATIVO'],
        [6, 'Relatório Mensal', 'Relatório mensal de performance', 'https://example.com/relatorio-mensal', 5, 'fa-calendar-alt', 'ATIVO'],
        [7, 'Analytics', 'Análise de dados e métricas', 'https://example.com/analytics', 1, 'fa-chart-bar', 'ATIVO'],
      ];
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:G${exampleData.length + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: exampleData
        }
      });
      
      console.log(`✅ ${exampleData.length} opções de exemplo inseridas!\n`);
    } else {
      console.log(`✅ Dados já existem (${dataResponse.data.values.length} linhas)!\n`);
    }
    
    console.log('🎉 SUCESSO! Aba portal_opcoes está pronta!\n');
    console.log('📊 Estrutura:');
    console.log('   - ID: Identificador único');
    console.log('   - Nome: Nome da opção');
    console.log('   - Descricao: Descrição breve');
    console.log('   - Link: URL de destino');
    console.log('   - Nivel_Minimo: Nível mínimo para acesso (0, 1, 5, 10)');
    console.log('   - Icone: Ícone Font Awesome (ex: fa-table)');
    console.log('   - Status: ATIVO ou INATIVO\n');
    console.log('🔗 Planilha: https://docs.google.com/spreadsheets/d/1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar
initPortalOpcoes();
