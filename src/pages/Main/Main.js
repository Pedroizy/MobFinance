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
    View
} from 'react-native';
import Actions from '../../components/Actions';
import Balance from '../../components/Balance';
import Header from '../../components/Header';
import Movements from '../../components/Movements';
import { deleteTransaction, getBalance, getTransactions } from '../../services/apiBackend';

export default function Main({ navigation }) {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    
    // Carregar transações
    const transactionsResult = await getTransactions();
    if (!transactionsResult.error) {
      setTransactions(transactionsResult);
      
      // Debug: mostrar transações
      console.log('📊 Transações carregadas:', transactionsResult);
      const despesas = transactionsResult.filter(t => t.type === 0);
      const receitas = transactionsResult.filter(t => t.type === 1);
      console.log('💸 Despesas (type=0):', despesas);
      console.log('💰 Receitas (type=1):', receitas);
    }

    // Carregar saldo
    const balanceResult = await getBalance();
    if (!balanceResult.error) {
      setBalance(balanceResult.balance);
      console.log('💵 Saldo:', balanceResult.balance);
    }

    setLoading(false);
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
    
    // Confirmar logout
    const confirmLogout = window.confirm 
      ? window.confirm("Deseja realmente sair da sua conta?")
      : true;
    
    if (!confirmLogout) {
      console.log('❌ Logout cancelado');
      return;
    }

    console.log('✅ Fazendo logout...');
    try {
      await AsyncStorage.multiRemove(['@token', '@user']);
      console.log('✅ Dados removidos, navegando para Home...');
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8000ff" />
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

      <Balance 
        saldo={balance}
        gastos={Math.abs(transactions
          .filter(t => t.type === 0)
          .reduce((sum, t) => sum + t.value, 0))
        }
      />

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
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 14,
  },
  list: {
    marginStart: 14,
    marginEnd: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
});
