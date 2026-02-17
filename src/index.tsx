import { Hono } from 'hono'
import { renderer } from './renderer'
import { authManager } from './services/auth'
import { sheetsManager } from './services/sheets'
import { ACCESS_RULES } from './config'
import { renderPortal } from './views/portal'
import { renderAdminUsers } from './views/admin-users'
import { renderAdminConfig } from './views/admin-config'
import { renderAdminOpcoes } from './views/admin-opcoes'

const app = new Hono()

app.use(renderer)

/**
 * Página inicial - Login
 */
app.get('/', (c) => {
  // Construir URL de callback dinamicamente
  // No Vercel, usar variáveis de ambiente ou detectar do request
  const forwardedHost = c.req.raw?.headers?.get?.('x-forwarded-host')
  const forwardedProto = c.req.raw?.headers?.get?.('x-forwarded-proto')
  
  const host = forwardedHost || 'portal-spxfulfillment.vercel.app'
  const protocol = forwardedProto || 'https'
  const redirectUri = `${protocol}://${host}/api/auth/callback`
  
  console.log('[LOGIN] Host:', host)
  console.log('[LOGIN] Protocol:', protocol)
  console.log('[LOGIN] Redirect URI:', redirectUri)
  
  const authUrl = authManager.getAuthUrl(redirectUri)
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - Portal Shopee</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            body {
                background: linear-gradient(135deg, #ee4d2d 0%, #f05d40 50%, #ff6347 100%);
                min-height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .login-card {
                background: white;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                transition: transform 0.3s ease;
            }
            .login-card:hover {
                transform: translateY(-5px);
            }
            .shopee-logo {
                width: 180px;
                height: auto;
                margin-bottom: 2rem;
            }
            .btn-google {
                background: white;
                border: 2px solid #dadce0;
                color: #3c4043;
                transition: all 0.3s ease;
            }
            .btn-google:hover {
                border-color: #ee4d2d;
                box-shadow: 0 2px 8px rgba(238, 77, 45, 0.2);
            }
            .info-box {
                background: #eff6ff;
                border-left: 4px solid #3b82f6;
                padding: 1rem;
                border-radius: 0.5rem;
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-slide-up {
                animation: slideUp 0.5s ease-out;
            }
        </style>
    </head>
    <body class="flex items-center justify-center p-4">
        <div class="login-card rounded-2xl p-8 md:p-12 max-w-md w-full animate-slide-up">
            <!-- Logo Shopee -->
            <div class="text-center mb-8">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/3840px-Shopee.svg.png" 
                    alt="Shopee Logo" 
                    class="shopee-logo mx-auto"
                />
                <h1 class="text-2xl font-bold text-gray-800 mt-4">Portal de Controle</h1>
                <p class="text-gray-600 mt-2">Faça login para continuar</p>
            </div>
            
            <!-- Botão Google Login -->
            <a href="${authUrl}" class="btn-google w-full py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 mb-4 block">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
            </a>
            
            <!-- Divider -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white text-gray-500">Primeiro acesso?</span>
                </div>
            </div>
            
            <!-- Info Box -->
            <div class="info-box">
                <div class="flex items-start gap-3">
                    <i class="fas fa-info-circle text-blue-500 text-xl mt-1"></i>
                    <div class="text-sm text-gray-700">
                        <p class="font-semibold mb-1">Como funciona:</p>
                        <ol class="list-decimal list-inside space-y-1">
                            <li>Clique em "Entrar com Google"</li>
                            <li>Autorize com sua conta Google</li>
                            <li>Seu cadastro será criado automaticamente</li>
                            <li>Seu acesso passará por aprovação</li>
                        </ol>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="mt-8 text-center text-sm text-gray-500">
                <p>Sistema seguro via Google OAuth</p>
                <p class="mt-2">
                    <i class="fas fa-shield-alt text-green-500"></i>
                    Seus dados estão protegidos
                </p>
            </div>
        </div>
    </body>
    </html>
  `)
})

/**
 * Callback do OAuth Google
 */
app.get('/api/auth/callback', async (c) => {
  const code = c.req.query('code')
  const error = c.req.query('error')
  
  console.log('[CALLBACK] Iniciando...')
  console.log('[CALLBACK] Code:', code ? 'Recebido' : 'NÃO recebido')
  console.log('[CALLBACK] Error:', error || 'Nenhum')
  
  // Se usuário cancelou
  if (error) {
    console.log('[CALLBACK] Usuário cancelou autorização')
    return c.html(`
      <h1>Login cancelado</h1>
      <p><a href="/">Voltar</a></p>
    `)
  }
  
  if (!code) {
    console.log('[CALLBACK] Código não fornecido')
    return c.json({ error: 'Código de autorização não fornecido' }, 400)
  }
  
  try {
    console.log('[CALLBACK] Validando código com Google...')
    
    // Construir URL de callback dinamicamente (mesma lógica da rota /)
    const forwardedHost = c.req.raw?.headers?.get?.('x-forwarded-host')
    const forwardedProto = c.req.raw?.headers?.get?.('x-forwarded-proto')
    
    const host = forwardedHost || 'portal-spxfulfillment.vercel.app'
    const protocol = forwardedProto || 'https'
    const redirectUri = `${protocol}://${host}/api/auth/callback`
    
    console.log('[CALLBACK] Host:', host)
    console.log('[CALLBACK] Protocol:', protocol)
    console.log('[CALLBACK] Redirect URI:', redirectUri)
    
    // Valida o código e pega dados do usuário
    const userData = await authManager.validateCode(code, redirectUri)
    
    console.log('[CALLBACK] userData:', userData ? 'OK' : 'FALHOU')
    
    if (!userData) {
      console.log('[CALLBACK] Falha na validação do token')
      return c.json({ error: 'Falha na autenticação' }, 401)
    }
    
    console.log('[CALLBACK] Email do usuário:', userData.email)
    console.log('[CALLBACK] Buscando usuário no Sheets...')
    
    // Busca usuário no Sheets
    const user = await sheetsManager.findUserByEmail(userData.email)
    
    console.log('[CALLBACK] Usuário encontrado no Sheets?', user ? 'SIM' : 'NÃO')
    if (user) {
      console.log('[CALLBACK] Status do usuário:', user.status)
    }
    
    // Verifica se é email Shopee
    const isShopeeEmail = userData.email.endsWith(ACCESS_RULES.SHOPEE_DOMAIN)
    
    console.log('[CALLBACK] É email Shopee?', isShopeeEmail)
    
    if (!user) {
      console.log('[CALLBACK] Exibindo tela de SELEÇÃO DE CARGO')
      // Primeiro acesso - Tela de seleção de cargo
      return c.html(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Seleção de Cargo - Portal Shopee</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
            <style>
                body {
                    background: linear-gradient(135deg, #ee4d2d 0%, #f05d40 50%, #ff6347 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .card {
                    background: white;
                    border-radius: 1rem;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                .cargo-card {
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid #e5e7eb;
                }
                .cargo-card:hover {
                    border-color: #ee4d2d;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(238, 77, 45, 0.2);
                }
                .cargo-card.selected {
                    border-color: #ee4d2d;
                    background: #fef2f2;
                }
                .shopee-logo {
                    width: 120px;
                    height: auto;
                }
            </style>
        </head>
        <body class="flex items-center justify-center p-4">
            <div class="card p-8 max-w-3xl w-full">
                <!-- Header -->
                <div class="text-center mb-8">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/3840px-Shopee.svg.png" 
                        alt="Shopee Logo" 
                        class="shopee-logo mx-auto mb-4"
                    />
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao Portal!</h1>
                    <p class="text-gray-600">Complete seu cadastro selecionando seu cargo</p>
                </div>

                <!-- User Info -->
                <div class="bg-gray-50 rounded-lg p-4 mb-6 flex items-center gap-4">
                    <img src="${userData.avatar}" class="w-16 h-16 rounded-full border-2 border-orange-500" />
                    <div>
                        <p class="font-semibold text-gray-800">${userData.nome}</p>
                        <p class="text-sm text-gray-600">${userData.email}</p>
                        <span class="inline-block mt-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            ⏱️ Pendente
                        </span>
                    </div>
                </div>

                <!-- Warning Box -->
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-info-circle text-yellow-500 text-xl mt-1"></i>
                        <div class="text-sm text-gray-700">
                            <p class="font-semibold mb-1">Importante:</p>
                            <p>Seu cadastro será criado e aguardará aprovação do administrador. Você receberá uma notificação por email quando seu acesso for liberado.</p>
                        </div>
                    </div>
                </div>

                <!-- Cidade Selection -->
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                        <i class="fas fa-map-marker-alt text-orange-500 mr-1"></i>
                        Selecione sua cidade:
                    </label>
                    <select id="selectCidade" class="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none">
                        <option value="">Selecione uma cidade...</option>
                    </select>
                </div>

                <!-- Cargo Selection -->
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                        <i class="fas fa-briefcase text-orange-500 mr-1"></i>
                        Selecione seu cargo:
                    </label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Básico -->
                        <div class="cargo-card p-4 rounded-lg" onclick="selectCargo('Basico', this)">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-user text-blue-600 text-xl"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">Básico</p>
                                    <p class="text-xs text-gray-500">Acesso básico ao sistema</p>
                                </div>
                            </div>
                        </div>

                        <!-- Analista -->
                        <div class="cargo-card p-4 rounded-lg" onclick="selectCargo('Analista', this)">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-chart-line text-green-600 text-xl"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">Analista</p>
                                    <p class="text-xs text-gray-500">Análise de dados e relatórios</p>
                                </div>
                            </div>
                        </div>

                        <!-- Supervisor -->
                        <div class="cargo-card p-4 rounded-lg" onclick="selectCargo('Supervisor', this)">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-users text-yellow-600 text-xl"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">Supervisor</p>
                                    <p class="text-xs text-orange-600">
                                        <i class="fas fa-lock text-xs mr-1"></i>
                                        Requer aprovação
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Gestor -->
                        <div class="cargo-card p-4 rounded-lg" onclick="selectCargo('Gestor', this)">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-crown text-purple-600 text-xl"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">Gestor</p>
                                    <p class="text-xs text-orange-600">
                                        <i class="fas fa-lock text-xs mr-1"></i>
                                        Requer aprovação
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Buttons -->
                <div class="flex gap-4">
                    <a href="/" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 text-center">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Voltar
                    </a>
                    <button 
                        id="btnContinuar" 
                        class="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onclick="submitCadastro()"
                        disabled
                    >
                        <i class="fas fa-check mr-2"></i>
                        Continuar
                    </button>
                </div>

                <!-- Loading -->
                <div id="loading" class="hidden mt-4 text-center">
                    <i class="fas fa-spinner fa-spin text-orange-500 text-2xl"></i>
                    <p class="text-gray-600 mt-2">Criando seu cadastro...</p>
                </div>
            </div>

            <script>
                let cidadeSelecionada = null;
                let cargoSelecionado = null;

                // Carregar cidades disponíveis
                async function loadCidades() {
                    try {
                        const response = await fetch('/api/cidades');
                        const data = await response.json();
                        const select = document.getElementById('selectCidade');
                        
                        data.cidades.forEach(cidade => {
                            const option = document.createElement('option');
                            option.value = cidade.nome;
                            option.textContent = cidade.nome;
                            select.appendChild(option);
                        });
                        
                        select.addEventListener('change', (e) => {
                            cidadeSelecionada = e.target.value;
                            checkFormValid();
                        });
                    } catch (error) {
                        console.error('Erro ao carregar cidades:', error);
                    }
                }

                function checkFormValid() {
                    const btnContinuar = document.getElementById('btnContinuar');
                    btnContinuar.disabled = !(cidadeSelecionada && cargoSelecionado);
                }

                function selectCargo(cargo, element) {
                    // Remove seleção anterior
                    document.querySelectorAll('.cargo-card').forEach(card => {
                        card.classList.remove('selected');
                    });

                    // Adiciona seleção atual
                    element.classList.add('selected');
                    cargoSelecionado = cargo;

                    // Habilita botão se cidade foi selecionada
                    checkFormValid();
                }

                // Carregar cidades ao iniciar
                loadCidades();

                async function submitCadastro() {
                    if (!cidadeSelecionada) {
                        alert('Por favor, selecione uma cidade');
                        return;
                    }
                    if (!cargoSelecionado) {
                        alert('Por favor, selecione um cargo');
                        return;
                    }

                    const btnContinuar = document.getElementById('btnContinuar');
                    const loading = document.getElementById('loading');

                    btnContinuar.disabled = true;
                    loading.classList.remove('hidden');

                    try {
                        const response = await fetch('/api/auth/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: '${userData.email}',
                                nome: '${userData.nome}',
                                cidade: cidadeSelecionada,
                                cargo: cargoSelecionado,
                                avatar: '${userData.avatar}',
                                isShopeeEmail: ${isShopeeEmail}
                            })
                        });

                        const data = await response.json();

                        if (data.success) {
                            window.location.href = '/api/auth/success?email=${encodeURIComponent(userData.email)}';
                        } else {
                            alert('Erro ao criar cadastro: ' + data.error);
                            btnContinuar.disabled = false;
                            loading.classList.add('hidden');
                        }
                    } catch (error) {
                        alert('Erro ao criar cadastro. Tente novamente.');
                        console.error(error);
                        btnContinuar.disabled = false;
                        loading.classList.add('hidden');
                    }
                }
            </script>
        </body>
        </html>
      `)
    }
    
    // Usuário existe - verifica status
    console.log('[CALLBACK] Verificando status do usuário...')
    
    if (user.status === ACCESS_RULES.STATUS.PENDENTE) {
      console.log('[CALLBACK] Exibindo tela de PENDENTE')
      return c.html(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aguardando Aprovação</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 p-8">
            <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-clock text-yellow-500 text-4xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Aguardando Aprovação</h1>
                <p class="text-gray-600 mb-6">Seu cadastro está pendente</p>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-left">
                    <p class="text-sm text-gray-700">
                        <strong>Email:</strong> ${user.email}<br>
                        <strong>Nome:</strong> ${user.nome}<br>
                        <strong>Cargo Solicitado:</strong> ${user.cargo_solicitado || 'Não informado'}<br>
                        <strong>Status:</strong> <span class="text-yellow-600 font-semibold">⏱️ PENDENTE</span><br>
                        <strong>Data do Cadastro:</strong> ${user.data_cadastro}
                    </p>
                </div>
                
                <p class="text-gray-600 text-sm mb-6">
                    <i class="fas fa-info-circle mr-1"></i>
                    O administrador será notificado e você receberá um email quando seu acesso for liberado.
                </p>
                
                <a href="/" class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 inline-block">
                    ← Voltar ao Login
                </a>
            </div>
        </body>
        </html>
      `)
    }
    
    if (user.status === ACCESS_RULES.STATUS.APROVADO) {
      console.log('[CALLBACK] Usuário aprovado - redirecionando pro portal')
      // Redireciona direto pro portal
      return c.redirect(`/portal?email=${encodeURIComponent(user.email)}`)
    }
    
    // Status REJEITADO ou outro
    console.log('[CALLBACK] Exibindo tela de ACESSO NEGADO. Status:', user.status)
    return c.html(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Acesso Negado</title>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 p-8">
          <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
              <h1 class="text-2xl font-bold text-red-600 mb-4">🚫 Acesso Negado</h1>
              <p class="text-gray-600 mb-6">Entre em contato com o administrador</p>
              <a href="/" class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 inline-block">
                  ← Voltar
              </a>
          </div>
      </body>
      </html>
    `)
    
  } catch (error) {
    console.error('Erro no callback:', error)
    return c.json({ error: 'Erro no processamento' }, 500)
  }
})

/**
 * Endpoint para cadastrar novo usuário
 */
app.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json()
    const { email, nome, cidade, cargo, avatar, isShopeeEmail } = body
    
    console.log('[REGISTER] Iniciando cadastro:', email, 'Cidade:', cidade)
    
    // Valida dados
    if (!email || !nome || !cidade || !cargo) {
      return c.json({ error: 'Dados incompletos' }, 400)
    }
    
    // Verifica se já existe
    const existing = await sheetsManager.findUserByEmail(email)
    if (existing) {
      return c.json({ error: 'Usuário já cadastrado' }, 400)
    }
    
    // Cria cadastro no Sheets
    const result = await sheetsManager.insertUser({
      email,
      nome,
      cidade,
      cargo_solicitado: cargo,
      status: 'PENDENTE',
      avatar,
      data_cadastro: new Date().toISOString()
    })
    
    console.log('[REGISTER] Cadastro criado com sucesso:', email)
    
    return c.json({ 
      success: true, 
      message: 'Cadastro criado com sucesso!' 
    })
    
  } catch (error) {
    console.error('[REGISTER] Erro:', error)
    return c.json({ error: 'Erro ao criar cadastro' }, 500)
  }
})

/**
 * Endpoint para listar cidades ativas
 */
app.get('/api/cidades', async (c) => {
  try {
    const cidades = await sheetsManager.getCidadesAtivas()
    return c.json({ cidades })
  } catch (error) {
    console.error('Erro ao listar cidades:', error)
    return c.json({ error: 'Erro ao carregar cidades' }, 500)
  }
})

/**
 * Endpoint para listar cargos ativos
 */
app.get('/api/cargos', async (c) => {
  try {
    const cargos = await sheetsManager.getCargosAtivos()
    return c.json({ cargos })
  } catch (error) {
    console.error('Erro ao listar cargos:', error)
    return c.json({ error: 'Erro ao carregar cargos' }, 500)
  }
})

/**
 * Tela de sucesso após cadastro
 */
app.get('/api/auth/success', async (c) => {
  const email = c.req.query('email')
  
  if (!email) {
    return c.redirect('/')
  }
  
  // Busca usuário no Sheets
  const user = await sheetsManager.findUserByEmail(email)
  
  if (!user) {
    return c.redirect('/')
  }
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro Realizado - Portal Shopee</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            body {
                background: linear-gradient(135deg, #ee4d2d 0%, #f05d40 50%, #ff6347 100%);
                min-height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .card {
                background: white;
                border-radius: 1rem;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.5s ease-out;
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .shopee-logo {
                width: 100px;
                height: auto;
            }
            .check-circle {
                animation: scaleIn 0.5s ease-out 0.2s both;
            }
            @keyframes scaleIn {
                from {
                    transform: scale(0);
                }
                to {
                    transform: scale(1);
                }
            }
        </style>
    </head>
    <body class="flex items-center justify-center p-4">
        <div class="card p-8 max-w-2xl w-full text-center">
            <!-- Logo -->
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/3840px-Shopee.svg.png" 
                alt="Shopee Logo" 
                class="shopee-logo mx-auto mb-6"
            />
            
            <!-- Success Icon -->
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 check-circle">
                <i class="fas fa-check text-green-500 text-5xl"></i>
            </div>
            
            <!-- Title -->
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Cadastro Realizado!</h1>
            <p class="text-gray-600 mb-8">Seu cadastro foi criado com sucesso</p>
            
            <!-- User Info -->
            <div class="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Email</p>
                        <p class="font-semibold text-gray-800">${user.email}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Nome</p>
                        <p class="font-semibold text-gray-800">${user.nome}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Cargo Solicitado</p>
                        <p class="font-semibold text-gray-800">${user.cargo_solicitado || 'Não informado'}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Status</p>
                        <span class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            ⏱️ ${user.status}
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Info Box -->
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
                <div class="flex items-start gap-3">
                    <i class="fas fa-info-circle text-blue-500 text-xl mt-1"></i>
                    <div class="text-sm text-gray-700">
                        <p class="font-semibold mb-2">Próximos passos:</p>
                        <ol class="list-decimal list-inside space-y-1">
                            <li>Seu cadastro está pendente de aprovação</li>
                            <li>O administrador será notificado</li>
                            <li>Você receberá um email quando for aprovado</li>
                            <li>Após aprovação, você poderá acessar o sistema</li>
                        </ol>
                    </div>
                </div>
            </div>
            
            <!-- Buttons -->
            <div class="flex gap-4">
                <a href="/" class="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold">
                    <i class="fas fa-home mr-2"></i>
                    Voltar ao Login
                </a>
            </div>
        </div>
    </body>
    </html>
  `)
})

/**
 * Rota de teste da conexão com Sheets
 */
app.get('/api/test/sheets', async (c) => {
  try {
    const initialized = await sheetsManager.initializeSheet()
    return c.json({ 
      success: true, 
      message: 'Conexão OK',
      initialized 
    })
  } catch (error) {
    return c.json({ 
      success: false, 
      error: String(error) 
    }, 500)
  }
})

/**
 * Portal Principal (após login aprovado)
 */
app.get('/portal', async (c) => {
  const email = c.req.query('email')
  const setorFiltro = c.req.query('setor') || 'TODOS'
  
  if (!email) {
    return c.redirect('/')
  }
  
  console.log('[PORTAL] Carregando portal para:', email, '| Setor:', setorFiltro)
  
  try {
    // Busca dados do usuário
    const user = await sheetsManager.findUserByEmail(email)
    
    if (!user || user.status !== 'APROVADO') {
      console.log('[PORTAL] Usuário não aprovado, redirecionando...')
      return c.redirect('/')
    }
    
    const nivelUsuario = parseInt(user.nivel || '0')
    const cidadeUsuario = user.cidade || 'Todas'
    console.log('[PORTAL] Usuário:', user.nome, '| Nível:', nivelUsuario, '| Cidade:', cidadeUsuario)
    
    // Busca opções disponíveis do Google Sheets (filtradas por nível, cidade e setor)
    const opcoes = await sheetsManager.getPortalOpcoes(nivelUsuario, cidadeUsuario, setorFiltro)
    console.log('[PORTAL] Opções carregadas:', opcoes.length)
    
    // Busca setores disponíveis para o filtro
    const setores = await sheetsManager.getSetoresAtivos()
    
    // Renderiza portal com dados dinâmicos
    return c.html(renderPortal(user, opcoes, setores, setorFiltro))
    
  } catch (error) {
    console.error('[PORTAL] Erro:', error)
    return c.html(`
      <h1>Erro ao carregar portal</h1>
      <p>${String(error)}</p>
      <p><a href="/">Voltar ao login</a></p>
    `)
  }
})

/**
 * Painel Admin: Gerenciar Usuários
 */
// ENDPOINTS ADMIN - COPIAR PARA index.tsx

/**
 * Painel Admin: Gerenciar Usuários
 */
app.get('/admin/users', async (c) => {
  const email = c.req.query('email')
  
  if (!email) {
    return c.redirect('/')
  }
  
  try {
    const user = await sheetsManager.findUserByEmail(email)
    
    if (!user || user.status !== 'APROVADO' || parseInt(user.nivel || '0') < 10) {
      return c.html(`
        <h1>Acesso Negado</h1>
        <p>Apenas administradores (Nível 10+) podem acessar esta página</p>
        <p><a href="/portal?email=${encodeURIComponent(email)}">Voltar ao portal</a></p>
      `)
    }
    
    // Buscar TODOS os usuários
    const allUsers = await sheetsManager.getAllUsers()
    const cidades = await sheetsManager.getCidadesAtivas()
    const cargos = await sheetsManager.getCargosAtivos()
    
    // Importar novo template
    const { renderAdminUsersComplete } = await import('./views/admin-users-complete')
    return c.html(renderAdminUsersComplete(allUsers, cidades, cargos, email))
    
  } catch (error) {
    console.error('[ADMIN] Erro:', error)
    return c.html(`<h1>Erro</h1><p>${String(error)}</p>`)
  }
})

/**
 * Painel Admin: Configurações do Sistema
 */
app.get('/admin/config', async (c) => {
  const email = c.req.query('email')
  
  if (!email) {
    return c.redirect('/')
  }
  
  try {
    const user = await sheetsManager.findUserByEmail(email)
    
    if (!user || user.status !== 'APROVADO' || parseInt(user.nivel || '0') < 10) {
      return c.html(`
        <h1>Acesso Negado</h1>
        <p>Apenas administradores (Nível 10+) podem acessar esta página</p>
        <p><a href="/portal?email=${encodeURIComponent(email)}">Voltar ao portal</a></p>
      `)
    }
    
    const cidades = await sheetsManager.getCidadesAtivas()
    const cargos = await sheetsManager.getCargosAtivos()
    const setores = await sheetsManager.getSetoresAtivos()
    const niveis = await sheetsManager.getNiveisCustomizados()
    
    return c.html(renderAdminConfig(cidades, cargos, setores, niveis, email))
    
  } catch (error) {
    console.error('[ADMIN] Erro:', error)
    return c.html(`<h1>Erro</h1><p>${String(error)}</p>`)
  }
})

/**
 * Painel Admin: Gerenciar Opções do Portal
 */
app.get('/admin/opcoes', async (c) => {
  const email = c.req.query('email')
  
  if (!email) {
    return c.redirect('/')
  }
  
  try {
    const user = await sheetsManager.findUserByEmail(email)
    
    if (!user || user.status !== 'APROVADO' || parseInt(user.nivel || '0') < 10) {
      return c.html(`
        <h1>Acesso Negado</h1>
        <p>Apenas administradores (Nível 10+) podem acessar esta página</p>
        <p><a href="/portal?email=${encodeURIComponent(email)}">Voltar ao portal</a></p>
      `)
    }
    
    const opcoes = await sheetsManager.getAllPortalOpcoes()
    const cidades = await sheetsManager.getCidadesAtivas()
    const setores = await sheetsManager.getSetoresAtivos()
    
    return c.html(renderAdminOpcoes(opcoes, cidades, setores, email))
    
  } catch (error) {
    console.error('[ADMIN] Erro:', error)
    return c.html(`<h1>Erro</h1><p>${String(error)}</p>`)
  }
})

/**
 * API: Adicionar cidade
 */
app.post('/api/admin/config/cidades', async (c) => {
  try {
    const { nome } = await c.req.json()
    
    if (!nome) {
      return c.json({ error: 'Nome da cidade é obrigatório' }, 400)
    }
    
    await sheetsManager.addCidade(nome)
    
    return c.json({ success: true, message: 'Cidade adicionada' })
  } catch (error) {
    console.error('[API] Erro ao adicionar cidade:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Deletar cidade
 */
app.delete('/api/admin/config/cidades/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    if (!id) {
      return c.json({ error: 'ID da cidade não fornecido' }, 400)
    }
    
    await sheetsManager.deleteCidade(id)
    
    return c.json({ success: true, message: 'Cidade deletada' })
  } catch (error) {
    console.error('[API] Erro ao deletar cidade:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Adicionar cargo
 */
app.post('/api/admin/config/cargos', async (c) => {
  try {
    const { nome, icone, descricao } = await c.req.json()
    
    if (!nome) {
      return c.json({ error: 'Nome do cargo é obrigatório' }, 400)
    }
    
    await sheetsManager.addCargo(nome, icone || 'fa-user', descricao || '')
    
    return c.json({ success: true, message: 'Cargo adicionado' })
  } catch (error) {
    console.error('[API] Erro ao adicionar cargo:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Deletar cargo
 */
app.delete('/api/admin/config/cargos/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    if (!id) {
      return c.json({ error: 'ID do cargo não fornecido' }, 400)
    }
    
    await sheetsManager.deleteCargo(id)
    
    return c.json({ success: true, message: 'Cargo deletado' })
  } catch (error) {
    console.error('[API] Erro ao deletar cargo:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Listar setores ativos
 */
app.get('/api/setores', async (c) => {
  try {
    const setores = await sheetsManager.getSetoresAtivos()
    return c.json(setores)
  } catch (error) {
    console.error('[API] Erro ao buscar setores:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Adicionar setor
 */
app.post('/api/admin/config/setores', async (c) => {
  try {
    const { nome } = await c.req.json()
    
    if (!nome) {
      return c.json({ error: 'Nome do setor é obrigatório' }, 400)
    }
    
    await sheetsManager.addSetor(nome)
    
    return c.json({ success: true, message: 'Setor adicionado' })
  } catch (error) {
    console.error('[API] Erro ao adicionar setor:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Deletar setor
 */
app.delete('/api/admin/config/setores/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    if (!id) {
      return c.json({ error: 'ID do setor não fornecido' }, 400)
    }
    
    await sheetsManager.deleteSetor(id)
    
    return c.json({ success: true, message: 'Setor deletado' })
  } catch (error) {
    console.error('[API] Erro ao deletar setor:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Listar níveis customizados
 */
app.get('/api/niveis', async (c) => {
  try {
    const niveis = await sheetsManager.getNiveisCustomizados()
    return c.json(niveis)
  } catch (error) {
    console.error('[API] Erro ao buscar níveis:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Adicionar nível customizado
 */
app.post('/api/admin/config/niveis', async (c) => {
  try {
    const { nivel, descricao } = await c.req.json()
    
    if (nivel === undefined || !descricao) {
      return c.json({ error: 'Nível e descrição são obrigatórios' }, 400)
    }
    
    await sheetsManager.addNivel(parseInt(nivel), descricao)
    
    return c.json({ success: true, message: 'Nível adicionado' })
  } catch (error) {
    console.error('[API] Erro ao adicionar nível:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Deletar nível customizado
 */
app.delete('/api/admin/config/niveis/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    if (!id) {
      return c.json({ error: 'ID do nível não fornecido' }, 400)
    }
    
    await sheetsManager.deleteNivel(id)
    
    return c.json({ success: true, message: 'Nível deletado' })
  } catch (error) {
    console.error('[API] Erro ao deletar nível:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Criar nova opção
 */
app.post('/api/admin/opcoes', async (c) => {
  try {
    const data = await c.req.json()
    
    if (!data.nome || !data.link) {
      return c.json({ error: 'Nome e Link são obrigatórios' }, 400)
    }
    
    await sheetsManager.insertPortalOpcao(data)
    
    return c.json({ success: true, message: 'Opção criada' })
  } catch (error) {
    console.error('[API] Erro ao criar opção:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Atualizar opção (ativar/desativar)
 */
app.patch('/api/admin/opcoes/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    
    await sheetsManager.updatePortalOpcao(id, data)
    
    return c.json({ success: true, message: 'Opção atualizada' })
  } catch (error) {
    console.error('[API] Erro ao atualizar opção:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Deletar opção
 */
app.delete('/api/admin/opcoes/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    await sheetsManager.deletePortalOpcao(id)
    
    return c.json({ success: true, message: 'Opção deletada' })
  } catch (error) {
    console.error('[API] Erro ao deletar opção:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Aprovar usuário
 */
app.post('/api/admin/users/approve', async (c) => {
  try {
    const { email, nivel } = await c.req.json()
    
    if (!email || nivel === undefined) {
      return c.json({ error: 'Dados incompletos' }, 400)
    }
    
    await sheetsManager.updateUserStatus(email, 'APROVADO', nivel)
    
    return c.json({ success: true, message: 'Usuário aprovado' })
  } catch (error) {
    console.error('[API] Erro ao aprovar:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Rejeitar usuário
 */
app.post('/api/admin/users/reject', async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email) {
      return c.json({ error: 'Email não fornecido' }, 400)
    }
    
    await sheetsManager.updateUserStatus(email, 'REJEITADO')
    
    return c.json({ success: true, message: 'Usuário rejeitado' })
  } catch (error) {
    console.error('[API] Erro ao rejeitar:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Atualizar dados de usuário (cidade, cargo, nível, status)
 */
app.patch('/api/admin/users/:email', async (c) => {
  try {
    const email = c.req.param('email')
    const body = await c.req.json()
    const { cidade, cargo, nivel, status } = body
    
    if (!email) {
      return c.json({ error: 'Email não fornecido' }, 400)
    }
    
    // Buscar usuário
    const user = await sheetsManager.findUserByEmail(email)
    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404)
    }
    
    // Atualizar dados no Sheets
    await sheetsManager.updateUser(email, {
      cidade: cidade || user.cidade,
      cargo_solicitado: cargo || user.cargo_solicitado,
      nivel: nivel !== undefined ? nivel : user.nivel
    })
    
    // Se status foi alterado, usar updateUserStatus
    if (status && status !== user.status) {
      await sheetsManager.updateUserStatus(email, status, nivel)
    }
    
    return c.json({ success: true, message: 'Usuário atualizado com sucesso' })
  } catch (error) {
    console.error('[API] Erro ao atualizar usuário:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * API: Deletar usuário
 */
app.delete('/api/admin/users/:email', async (c) => {
  try {
    const email = c.req.param('email')
    
    if (!email) {
      return c.json({ error: 'Email não fornecido' }, 400)
    }
    
    await sheetsManager.deleteUser(email)
    
    return c.json({ success: true, message: 'Usuário deletado com sucesso' })
  } catch (error) {
    console.error('[API] Erro ao deletar usuário:', error)
    return c.json({ error: String(error) }, 500)
  }
})

/**
 * Sistema ABS - Rotas estáticas
 */
app.get('/abs', async (c) => {
  try {
    // Ler arquivo HTML estático
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

export default app
