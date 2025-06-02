import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Chip, Searchbar, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '../../src/components/Header';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { EmptyState } from '../../src/components/EmptyState';
import { EncomendaRepository } from '../../src/database/encomendaRepository';
import { MoradorRepository } from '../../src/database/moradorRepository';
import { Encomenda } from '../../src/types/databaseTypes';

// Extended encomenda type with morador name
interface EncomendaWithMorador extends Encomenda {
  moradorNome?: string;
}

export default function EncomendasScreen() {
  const router = useRouter();
  const [encomendas, setEncomendas] = useState<EncomendaWithMorador[]>([]);
  const [filteredEncomendas, setFilteredEncomendas] = useState<EncomendaWithMorador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'entregue'>('all');

  useEffect(() => {
    loadEncomendas();
  }, []);

  useEffect(() => {
    filterEncomendas();
  }, [searchQuery, statusFilter, encomendas]);

  const loadEncomendas = async () => {
    try {
      setLoading(true);
      const data = await EncomendaRepository.getAll();
      
      // Fetch morador names for each encomenda
      const encomendasWithMoradores = await Promise.all(
        data.map(async (encomenda) => {
          const morador = await MoradorRepository.getById(encomenda.destinatario_id);
          return {
            ...encomenda,
            moradorNome: morador?.nome || 'Morador não encontrado'
          };
        })
      );
      
      setEncomendas(encomendasWithMoradores);
    } catch (error) {
      console.error('Error loading encomendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEncomendas = () => {
    let filtered = [...encomendas];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(encomenda => encomenda.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(encomenda => 
        (encomenda.moradorNome && encomenda.moradorNome.toLowerCase().includes(query)) ||
        (encomenda.descricao && encomenda.descricao.toLowerCase().includes(query))
      );
    }
    
    setFilteredEncomendas(filtered);
  };

  const handleAddEncomenda = () => {
    router.push('/encomendas/nova');
  };

  const handleViewEncomenda = (id: number) => {
    router.push(`/encomendas/${id}`);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const renderItem = ({ item }: { item: EncomendaWithMorador }) => (
    <Card
      style={styles.card}
      onPress={() => handleViewEncomenda(item.id!)}
    >
      <Card.Content>
        <Text variant="titleMedium">{item.moradorNome}</Text>
        <Text variant="bodyMedium">
          {item.descricao || 'Sem descrição'}
        </Text>
        <Text variant="bodySmall">
          Recebida em: {formatDate(item.data_recebimento)}
        </Text>
        <View style={styles.statusContainer}>
          <Chip 
            style={[
              styles.statusChip, 
              { backgroundColor: item.status === 'pendente' ? '#ffca28' : '#66bb6a' }
            ]}
          >
            {item.status === 'pendente' ? 'Pendente' : 'Entregue'}
          </Chip>
          {item.status === 'entregue' && item.data_entrega && (
            <Text variant="bodySmall">
              Entregue em: {formatDate(item.data_entrega)}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return <LoadingScreen message="Carregando encomendas..." />;
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Encomendas" 
        backButton={true} 
        rightContent={
          <Button 
            icon="plus" 
            mode="contained" 
            onPress={handleAddEncomenda}
          >
            Nova
          </Button>
        }
      />

      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Pesquisar encomendas"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.chipContainer}>
          <Chip 
            selected={statusFilter === 'all'}
            onPress={() => setStatusFilter('all')}
            style={styles.chip}
          >
            Todas
          </Chip>
          <Chip 
            selected={statusFilter === 'pendente'}
            onPress={() => setStatusFilter('pendente')}
            style={styles.chip}
          >
            Pendentes
          </Chip>
          <Chip 
            selected={statusFilter === 'entregue'}
            onPress={() => setStatusFilter('entregue')}
            style={styles.chip}
          >
            Entregues
          </Chip>
        </View>
      </View>

      {filteredEncomendas.length === 0 ? (
        <EmptyState
          title="Nenhuma encomenda encontrada"
          message={searchQuery.trim() !== '' || statusFilter !== 'all' 
            ? "Tente uma pesquisa diferente ou altere o filtro" 
            : "Registre a primeira encomenda"
          }
          icon="package-variant"
          buttonText="Adicionar Encomenda"
          onButtonPress={handleAddEncomenda}
        />
      ) : (
        <FlatList
          data={filteredEncomendas}
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
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchbar: {
    elevation: 2,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  statusContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    marginRight: 8,
  },
});