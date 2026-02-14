const { google } = require('googleapis');

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

async function initSetoresNiveis() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Criar aba config_setores_niveis se não existir
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      sheet => sheet.properties?.title === 'config_setores_niveis'
    );

    if (!sheetExists) {
      console.log('Criando aba config_setores_niveis...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'config_setores_niveis'
              }
            }
          }]
        }
      });
      console.log('✓ Aba criada');
    } else {
      console.log('Aba config_setores_niveis já existe');
    }

    // 2. Criar cabeçalhos e dados iniciais
    console.log('Adicionando cabeçalhos e setores iniciais...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'config_setores_niveis!A1:C1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['SETORES', '', '']]
      }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'config_setores_niveis!A2:C2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['ID', 'Nome', 'Status']]
      }
    });

    // Setores iniciais
    const setoresIniciais = [
      [1, 'GERAL', 'ATIVO'],
      [2, 'INBOUND', 'ATIVO'],
      [3, 'OUTBOUND', 'ATIVO'],
      [4, 'INVENTÁRIO', 'ATIVO'],
      [5, 'TREINAMENTOS', 'ATIVO'],
      [6, 'QUALIDADE', 'ATIVO'],
      [7, 'MWH E EXCELENCIA OPERACIONAL', 'ATIVO'],
      [8, 'FLOW', 'ATIVO'],
      [9, 'SECURITY', 'ATIVO']
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'config_setores_niveis!A3:C11',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: setoresIniciais
      }
    });

    console.log('✓ Setores adicionados');

    // 3. Cabeçalhos de Níveis
    console.log('Adicionando cabeçalhos de níveis...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'config_setores_niveis!E1:G1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['NÍVEIS DE ACESSO', '', '']]
      }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'config_setores_niveis!E2:G2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['ID', 'Nível', 'Descrição']]
      }
    });

    // Níveis iniciais
    const niveisIniciais = [
      [1, 0, 'Básico'],
      [2, 1, 'Analista'],
      [3, 5, 'Supervisor'],
      [4, 10, 'Administrador']
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'config_setores_niveis!E3:G6',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: niveisIniciais
      }
    });

    console.log('✓ Níveis adicionados');

    // 4. Adicionar coluna Setor na aba portal_opcoes
    console.log('Verificando cabeçalho da aba portal_opcoes...');
    const portalOpcoes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'portal_opcoes!A1:I1'
    });

    const header = portalOpcoes.data.values?.[0] || [];
    
    if (header.length < 9) {
      console.log('Adicionando coluna Setor na aba portal_opcoes...');
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'portal_opcoes!I1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['Setor']]
        }
      });
      console.log('✓ Coluna Setor adicionada');
    } else {
      console.log('Coluna Setor já existe');
    }

    console.log('\n✅ Inicialização concluída com sucesso!');
    console.log('\nSetores criados:');
    setoresIniciais.forEach(s => console.log(`  - ${s[1]}`));
    console.log('\nNíveis criados:');
    niveisIniciais.forEach(n => console.log(`  - Nível ${n[1]}: ${n[2]}`));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

initSetoresNiveis();
