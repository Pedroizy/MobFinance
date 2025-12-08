import AsyncStorage from '@react-native-async-storage/async-storage';

// CONFIGURAÇÃO DA API
// Troque para o IP da sua máquina se estiver testando em dispositivo físico
const API_URL = __DEV__ 
  ? 'http://192.168.1.43:3000/api'  // Desenvolvimento
  : 'https://sua-api-producao.com/api';  // Produção

// Função auxiliar para requisições
async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = false) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Adiciona token JWT se necessário
    if (requiresAuth) {
      const token = await AsyncStorage.getItem('@token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const url = `${API_URL}${endpoint}`;
    
    // Log para debug
    console.log('🔵 API Request:', {
      url,
      method,
      body,
      headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined }
    });

    const response = await fetch(url, config);
    const data = await response.json();

    // Log da resposta
    console.log('🟢 API Response:', {
      status: response.status,
      ok: response.ok,
      data
    });

    if (!response.ok) {
      console.error('❌ API Error:', data);
      return { error: data.error || `Erro ${response.status}: ${response.statusText}` };
    }

    return data;
  } catch (error) {
    console.error('❌ Erro na API:', error);
    return { error: 'Erro de conexão. Verifique se o backend está rodando.' };
  }
}

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========== AUTENTICAÇÃO ==========

// Login
export async function loginUser(email, password) {
  if (!isValidEmail(email)) {
    return { error: 'Email inválido' };
  }

  const result = await apiRequest('/auth/login', 'POST', {
    email: email.toLowerCase(),
    senha: password,
  });

  // Salva token se login bem sucedido
  if (result.token) {
    await AsyncStorage.setItem('@token', result.token);
    await AsyncStorage.setItem('@user', JSON.stringify(result.user));
    return { data: result.user };
  }

  return result;
}

// Cadastro
export async function signupUser(nome, sobrenome, email, password) {
  if (!isValidEmail(email)) {
    return { error: 'Email inválido' };
  }

  const result = await apiRequest('/auth/signup', 'POST', {
    nome,
    sobrenome,
    email: email.toLowerCase(),
    senha: password,
  });

  // Salva token se cadastro bem sucedido
  if (result.token) {
    await AsyncStorage.setItem('@token', result.token);
    await AsyncStorage.setItem('@user', JSON.stringify(result.user));
    return { data: result.user };
  }

  return result;
}

// Logout
export async function logoutUser() {
  await AsyncStorage.removeItem('@token');
  await AsyncStorage.removeItem('@user');
}

// Verificar se está logado
export async function isLoggedIn() {
  const token = await AsyncStorage.getItem('@token');
  return !!token;
}

// Obter usuário atual
export async function getCurrentUser() {
  const userStr = await AsyncStorage.getItem('@user');
  return userStr ? JSON.parse(userStr) : null;
}

// Recuperar senha
export async function forgotPassword(email, code, newPassword) {
  const body = { email };
  
  if (code && newPassword) {
    body.code = code;
    body.newPassword = newPassword;
  }

  const result = await apiRequest('/auth/forgot-password', 'POST', body);
  return result;
}

// ========== TRANSAÇÕES ==========

// Buscar todas as transações
export async function getTransactions() {
  const result = await apiRequest('/transactions', 'GET', null, true);
  
  if (result.error) {
    return [];
  }
  
  return result.transactions || [];
}

// Criar transação
export async function createTransaction({ description, value, type }) {
  const result = await apiRequest('/transactions', 'POST', {
    description,
    value: parseFloat(value),
    type: parseInt(type),
  }, true);

  return result;
}

// Deletar transação
export async function deleteTransaction(transactionId) {
  const result = await apiRequest(`/transactions/${transactionId}`, 'DELETE', null, true);
  return result;
}

// Obter saldo
export async function getBalance() {
  const result = await apiRequest('/transactions/balance', 'GET', null, true);
  
  if (result.error) {
    return { balance: 0 };
  }
  
  return { balance: result.balance || 0 };
}
