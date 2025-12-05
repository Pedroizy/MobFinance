import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Actions({ navigation, onRefresh }) {
  function handleAddIncome() {
    navigation.navigate('New', { type: 1, onRefresh });
  }

  function handleAddExpense() {
    navigation.navigate('New', { type: 0, onRefresh });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.actionButton, styles.incomeButton]}
        onPress={handleAddIncome}
      >
        <MaterialIcons name="attach-money" size={32} color="#4CAF50" />
        <Text style={styles.labelButton}>Adicionar Receita</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.expenseButton]}
        onPress={handleAddExpense}
      >
        <MaterialIcons name="money-off" size={32} color="#F44336" />
        <Text style={styles.labelButton}>Adicionar Despesa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  incomeButton: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  expenseButton: {
    borderColor: '#F44336',
    borderWidth: 1,
  },
  labelButton: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
