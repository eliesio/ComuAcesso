import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { useRouter, usePathname } from 'expo-router';

export const BottomNavigationBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determinar o índice ativo com base no pathname atual
  const getActiveIndex = () => {
    if (pathname === '/' || pathname === '/index') {
      return 0;
    } else if (pathname.startsWith('/moradores')) {
      return 1;
    } else if (pathname.startsWith('/encomendas')) {
      return 2;
    } else if (pathname.startsWith('/avisos')) {
      return 3;
    } else if (pathname.startsWith('/estatisticas')) {
      return 4;
    }
    return 0; // Padrão para a página inicial
  };

  const handleIndexChange = (index: number) => {
    switch (index) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/moradores');
        break;
      case 2:
        router.push('/encomendas');
        break;
      case 3:
        router.push('/avisos');
        break;
      case 4:
        router.push('/estatisticas');
        break;
    }
  };

  // Renderizar cenas vazias, já que estamos usando Expo Router para navegação
  const renderScene = () => <View />;

  return (
    <View style={styles.container}>
      <BottomNavigation
        navigationState={{
          index: getActiveIndex(),
          routes: [
            { key: 'home', title: 'Início', icon: 'home' },
            { key: 'moradores', title: 'Moradores', icon: 'account-group' },
            { key: 'encomendas', title: 'Encomendas', icon: 'package-variant-closed' },
            { key: 'avisos', title: 'Avisos', icon: 'bell' },
            { key: 'estatisticas', title: 'Stats', icon: 'chart-bar' }
          ]
        }}
        onIndexChange={handleIndexChange}
        renderScene={renderScene}
        barStyle={styles.barStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 8,
  },
  barStyle: {
    backgroundColor: 'white',
    height: 60,
  }
});