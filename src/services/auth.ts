import { OAuth2Client } from 'google-auth-library'
import { GOOGLE_OAUTH } from '../config'

/**
 * Gerenciador de autenticação OAuth Google
 */
export class AuthManager {
  private oauth2Client: OAuth2Client
  
  constructor() {
    // Não definir redirect_uri aqui - será passado dinamicamente
    this.oauth2Client = new OAuth2Client(
      GOOGLE_OAUTH.CLIENT_ID,
      GOOGLE_OAUTH.CLIENT_SECRET
    )
  }
  
  /**
   * Gera URL de autorização do Google
   * @param redirectUri - URL de callback (ex: https://seu-dominio.com/api/auth/callback)
   */
  getAuthUrl(redirectUri: string) {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      prompt: 'select_account',
      redirect_uri: redirectUri
    })
  }
  
  /**
   * Valida o código de autorização e retorna dados do usuário
   * @param code - Código de autorização do Google
   * @param redirectUri - Mesma URL de callback usada no getAuthUrl
   */
  async validateCode(code: string, redirectUri: string) {
    try {
      console.log('[AUTH] Iniciando validação do código...')
      console.log('[AUTH] Redirect URI:', redirectUri)
      
      // Troca o code por tokens
      console.log('[AUTH] Trocando code por tokens...')
      const { tokens } = await this.oauth2Client.getToken({
        code,
        redirect_uri: redirectUri
      })
      console.log('[AUTH] Tokens recebidos:', tokens.access_token ? 'OK' : 'FALHOU')
      
      this.oauth2Client.setCredentials(tokens)
      
      // Busca informações do usuário
      console.log('[AUTH] Buscando informações do usuário...')
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
      )
      
      console.log('[AUTH] Response status:', userInfoResponse.status)
      
      if (!userInfoResponse.ok) {
        throw new Error('Falha ao buscar informações do usuário')
      }
      
      const userInfo = await userInfoResponse.json()
      console.log('[AUTH] UserInfo recebido:', userInfo.email)
      
      return {
        email: userInfo.email,
        nome: userInfo.name,
        avatar: userInfo.picture,
        email_verified: userInfo.verified_email
      }
    } catch (error) {
      console.error('[AUTH] Erro ao validar código OAuth:', error)
      return null
    }
  }
}

// Inicialização defensiva - não quebra o servidor se falhar
let authManager: AuthManager

try {
  authManager = new AuthManager()
  console.log('✅ AuthManager inicializado com sucesso')
} catch (error) {
  console.error('⚠️ Erro ao inicializar AuthManager:', error)
  console.error('⚠️ Funcionalidades de autenticação podem não funcionar')
  // Criar um objeto mock para evitar crashes
  authManager = null as any
}

export { authManager }
