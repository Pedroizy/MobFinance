import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Movements({ data, deleteItem }) {
  const isIncome = data.type === 1;

  return (
    <TouchableOpacity style={styles.container} onLongPress={deleteItem}>
      <View style={styles.content}>
        <Text style={styles.date}>
          {new Date(data.date).toLocaleDateString('pt-BR')}
        </Text>

        <View style={styles.description}>
          <Feather
            name={isIncome ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={isIncome ? '#2ecc71' : '#e74c3c'}
          />
          <Text style={styles.descriptionText}>{data.description}</Text>
        </View>

        <Text style={[styles.value, { color: isIncome ? '#2ecc71' : '#e74c3c' }]}>
          R$ {data.value.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
  },
  content: {
    paddingBottom: 10,
  },
  date: {
    color: '#DADADA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 16,
    marginLeft: 6,
    color: '#121212',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});