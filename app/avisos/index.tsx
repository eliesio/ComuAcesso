import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Searchbar, Text, IconButton, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '../../src/components/Header';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { EmptyState } from '../../src/components/EmptyState';
import { AvisoRepository } from '../../src/database/avisoRepository';
import { Aviso } from '../../src/types/databaseTypes';

export default function AvisosScreen() {
  const router = useRouter();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [filteredAvisos, setFilteredAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAvisos();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAvisos(avisos);
    } else {
      const filtered = avisos.filter(aviso => 
        aviso.mensagem.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAvisos(filtered);
    }
  }, [searchQuery, avisos]);

  const loadAvisos = async () => {
    try {
      setLoading(true);
      const data = await AvisoRepository.getAll();
      setAvisos(data);
      setFilteredAvisos(data);
    } catch (error) {
      console.error('Error loading avisos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAviso = () => {
    router.push('/avisos/novo');
  };

  const handleEditAviso = (id: number) => {
    router.push(`/avisos/${id}`);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const renderItem = ({ item }: { item: Aviso }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="bodySmall" style={styles.date}>
            {formatDate(item.data_criacao)}
          </Text>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEditAviso(item.id!)}
          />
        </View>
        <Divider style={styles.divider} />
        <Text variant="bodyLarge">{item.mensagem}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return <LoadingScreen message="Carregando avisos..." />;
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Avisos" 
        backButton={true} 
        rightContent={
          <Button 
            icon="plus" 
            mode="contained" 
            onPress={handleAddAviso}
          >
            Novo
          </Button>
        }
      />

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Pesquisar avisos"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {filteredAvisos.length === 0 ? (
        <EmptyState
          title="Nenhum aviso encontrado"
          message={searchQuery.trim() !== '' 
            ? "Tente uma pesquisa diferente" 
            : "Crie o primeiro aviso comunitário"
          }
          icon="bell-off-outline"
          buttonText="Adicionar Aviso"
          onButtonPress={handleAddAviso}
        />
      ) : (
        <FlatList
          data={filteredAvisos}
          keyExtractor={(item) => item.id?.toString() || `temp-${Math.random()}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchbar: {
    elevation: 2,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: '#666',
  },
  divider: {
    marginBottom: 8,
  },
});