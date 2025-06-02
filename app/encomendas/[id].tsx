import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Text, List, Card, Divider, Portal, Dialog } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '../../src/components/Header';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { EncomendaRepository } from '../../src/database/encomendaRepository';
import { MoradorRepository } from '../../src/database/moradorRepository';
import { Encomenda, Morador } from '../../src/types/databaseTypes';

export default function EncomendaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const encomendaId = parseInt(id);
  const router = useRouter();
  
  const [encomenda, setEncomenda] = useState<Encomenda | null>(null);
  const [morador, setMorador] = useState<Morador | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [entregaDialogVisible, setEntregaDialogVisible] = useState(false);

  useEffect(() => {
    loadEncomenda();
  }, [encomendaId]);

  const loadEncomenda = async () => {
    try {
      setLoading(true);
      const encomendaData = await EncomendaRepository.getById(encomendaId);
      
      if (encomendaData) {
        setEncomenda(encomendaData);
        const moradorData = await MoradorRepository.getById(encomendaData.destinatario_id);
        setMorador(moradorData);
      } else {
        Alert.alert('Erro', 'Encomenda não encontrada');
        router.back();
      }
    } catch (error) {
      console.error('Error loading encomenda:', error);
      Alert.alert('Erro', 'Falha ao carregar dados da encomenda');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setProcessing(true);
      await EncomendaRepository.delete(encomendaId);
      router.back();
    } catch (error) {
      console.error('Error deleting encomenda:', error);
      Alert.alert('Erro', 'Falha ao excluir encomenda');
    } finally {
      setProcessing(false);
      setDeleteDialogVisible(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      setProcessing(true);
      const dataEntrega = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      await EncomendaRepository.markAsDelivered(encomendaId, dataEntrega);
      
      // Reload encomenda data to show updated status
      await loadEncomenda();
    } catch (error) {
      console.error('Error marking encomenda as delivered:', error);
      Alert.alert('Erro', 'Falha ao marcar encomenda como entregue');
    } finally {
      setProcessing(false);
      setEntregaDialogVisible(false);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  if (loading) {
    return <LoadingScreen message="Carregando dados da encomenda..." />;
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Detalhes da Encomenda" 
        rightContent={
          <Button 
            icon="delete" 
            mode="contained" 
            buttonColor="#ff5252"
            onPress={() => setDeleteDialogVisible(true)}
            disabled={processing}
          >
            Excluir
          </Button>
        }
      />
      
      <ScrollView style={styles.formContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Informações da Encomenda</Text>
            
            {encomenda?.descricao ? (
              <Text variant="bodyLarge" style={styles.descricao}>
                {encomenda.descricao}
              </Text>
            ) : (
              <Text variant="bodyLarge" style={[styles.descricao, styles.noDescription]}>
                Sem descrição
              </Text>
            )}
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Status"
              description={encomenda?.status === 'pendente' ? 'Pendente' : 'Entregue'}
              left={props => <List.Icon {...props} icon={encomenda?.status === 'pendente' ? 'timer-sand' : 'check-circle'} />}
            />
            
            <List.Item
              title="Data de Recebimento"
              description={encomenda ? formatDate(encomenda.data_recebimento) : ''}
              left={props => <List.Icon {...props} icon="calendar" />}
            />
            
            {encomenda?.status === 'entregue' && encomenda.data_entrega && (
              <List.Item
                title="Data de Entrega"
                description={formatDate(encomenda.data_entrega)}
                left={props => <List.Icon {...props} icon="calendar-check" />}
              />
            )}
          </Card.Content>
        </Card>
        
        {morador && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">Destinatário</Text>
              
              <List.Item
                title={morador.nome}
                description={morador.endereco || 'Sem endereço cadastrado'}
                left={props => <List.Icon {...props} icon="account" />}
              />
              
              {morador.telefone && (
                <List.Item
                  title="Telefone"
                  description={morador.telefone}
                  left={props => <List.Icon {...props} icon="phone" />}
                />
              )}
              
              <List.Item
                title="Área de acesso"
                description={morador.area_dificil_acesso ? 'Difícil acesso' : 'Fácil acesso'}
                left={props => <List.Icon {...props} icon={morador.area_dificil_acesso ? 'map-marker-alert' : 'map-marker'} />}
              />
            </Card.Content>
          </Card>
        )}
        
        <View style={styles.buttonContainer}>
          {encomenda?.status === 'pendente' && (
            <Button
              mode="contained"
              icon="package-variant-closed-check"
              onPress={() => setEntregaDialogVisible(true)}
              loading={processing}
              disabled={processing}
              style={styles.button}
            >
              Marcar como Entregue
            </Button>
          )}
          
          <Button
            mode="outlined"
            onPress={() => router.back()}
            disabled={processing}
            style={styles.button}
          >
            Voltar
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Confirmar exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja excluir esta encomenda? Esta ação não pode ser desfeita.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleDelete} textColor="#ff5252">Excluir</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={entregaDialogVisible}
          onDismiss={() => setEntregaDialogVisible(false)}
        >
          <Dialog.Title>Confirmar entrega</Dialog.Title>
          <Dialog.Content>
            <Text>Confirmar que a encomenda foi entregue ao destinatário?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEntregaDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleMarkAsDelivered}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  descricao: {
    marginTop: 8,
  },
  noDescription: {
    fontStyle: 'italic',
    color: '#757575',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
  },
});