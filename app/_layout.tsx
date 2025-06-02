import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { DatabaseProvider } from '../src/database/DatabaseContext';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useDatabaseContext } from '../src/database/DatabaseContext';
import { BottomNavigationBar } from '../src/components/BottomNavigationBar';
import { usePathname } from 'expo-router';

// Database loading component
function DatabaseInitializer() {
  const { isLoading, isReady, error } = useDatabaseContext();
  const pathname = usePathname();
  
  // Verificar se está em uma tela de edição/criação para não mostrar a barra de navegação
  const shouldShowNavBar = () => {
    // Não mostrar em telas de edição ou criação
    if (pathname.includes('/novo')) return false;
    if (pathname.match(/\/moradores\/\d+$/)) return false;
    if (pathname.match(/\/encomendas\/\d+$/)) return false;
    if (pathname.match(/\/avisos\/\d+$/)) return false;
    
    // Mostrar nas telas principais
    return true;
  };
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Inicializando banco de dados...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao inicializar banco de dados</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (isReady) {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.mainContent}>
          <Slot />
        </View>
        {shouldShowNavBar() && (
          <View style={styles.navBarContainer}>
            <BottomNavigationBar />
          </View>
        )}
      </View>
    );
  }

  return null;
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <DatabaseProvider>
          <DatabaseInitializer />
          <StatusBar style="auto" />
        </DatabaseProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
  },
  navBarContainer: {
    width: '100%',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 10,
  },
});