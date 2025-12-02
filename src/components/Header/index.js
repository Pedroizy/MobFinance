import { Feather } from '@expo/vector-icons';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function Header({ name, onLogout }) {
  const handleLogoutPress = () => {
    console.log('🚪 Botão de sair clicado!');
    if (onLogout) {
      onLogout();
    } else {
      console.error('❌ onLogout não foi passado como prop!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.username}>Olá, {name}</Text>

        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.buttonUser} 
          onPress={handleLogoutPress}
        >
          <Feather name="log-out" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8000ff',
    paddingTop: statusBarHeight,
    flexDirection: 'row',
    paddingStart: 16,
    paddingEnd: 16,
    paddingBottom: 44,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonUser: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
});