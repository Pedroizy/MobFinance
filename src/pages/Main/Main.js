import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Actions from '../../components/Actions';
import Header from '../../components/Header';
import Movements from '../../components/Movements';
import { deleteTransaction, getBalance, getTransactions, logoutUser } from '../../services/apiBackend2';

export default function Main({ navigation }) {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  // Recarrega transações sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  async function loadUserData() {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  async function loadTransactions() {
    setLoading(true);

    try {
      // Carregar transações
      const transactionsResult = await getTransactions();
      if (!transactionsResult.error) {
        setTransactions(transactionsResult);
        console.log('📊 Transações carregadas:', transactionsResult);
      }

      // Carregar saldo
      const balanceResult = await getBalance();
      if (!balanceResult.error) {
        setBalance(balanceResult.balance);
        console.log('💵 Saldo atualizado:', balanceResult.balance);
      }
    } catch (error) {
      console.error('Erro ao carregar transações ou saldo:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }

  async function handleDelete(id) {
    Alert.alert(
      "Confirmar",
      "Deseja realmente excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const result = await deleteTransaction(id);
            if (result.error) {
              Alert.alert("Erro", result.error);
            } else {
              Alert.alert("Sucesso", "Transação excluída!");
              loadTransactions();
            }
          }
        }
      ]
    );
  }

  async function handleLogout() {
    console.log('🚪 handleLogout chamado!');

    try {
      // Chama a função de logout do backend
      await logoutUser();

      console.log('✅ Logout bem-sucedido, navegando para Home...');

      // Redireciona para a tela de login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
    }
  }

  function toggleBalanceVisibility() {
    setShowBalance(!showBalance);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        name={user?.nome || 'Usuário'} 
        onLogout={handleLogout} 
      />

      <View style={styles.balanceContainer}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={styles.balanceValue}>
            {showBalance ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '***'}
          </Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Gastos</Text>
          <Text style={styles.balanceValue}>
            {showBalance ? `R$ ${transactions
              .filter(transaction => transaction.type === 0 && typeof transaction.value === 'number' && transaction.value >= 0)
              .reduce((total, transaction) => total + transaction.value, 0)
              .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '***'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleBalanceVisibility}>
        <Icon 
          name={showBalance ? 'visibility-off' : 'visibility'} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>

      <Actions navigation={navigation} onRefresh={loadTransactions} />

      <Text style={styles.title}>Últimas movimentações</Text>

      <FlatList
        style={styles.list}
        data={transactions}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({ item }) => (
          <Movements 
            data={item} 
            deleteItem={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
            <Text style={styles.emptySubtext}>
              Adicione uma nova transação usando os botões acima
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
    height: 500,
    width: '100%',
  },

  loadingContainer: {
    paddingTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ea',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#888',
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
    textAlign: 'center',
  },
  list: {
    marginHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
  toggleButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Torna o botão transparente
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
