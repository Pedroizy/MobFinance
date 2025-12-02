// Configuração da API

// Defina como true para usar o backend real ou false para usar mock local
export const USE_BACKEND = true;

// URL do backend (ajuste conforme necessário)
export const API_CONFIG = {
  // Para desenvolvimento local:
  // - Web/iOS Simulator: http://localhost:3000/api
  // - Android Emulator: http://10.0.2.2:3000/api
  // - Dispositivo físico: http://SEU_IP_LOCAL:3000/api (ex: http://192.168.1.100:3000/api)
  
  BACKEND_URL: __DEV__ 
    ? 'http://10.10.35.63:3000/api'  // IP local - ajuste conforme sua rede
    : 'https://sua-api-producao.com/api',
  
  TIMEOUT: 10000, // 10 segundos
};

// Exporta as funções corretas baseado na configuração
export function getApiService() {
  if (USE_BACKEND) {
    return require('./apiBackend');
  } else {
    return require('./api');
  }
}
