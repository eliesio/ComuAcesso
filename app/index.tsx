import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Badge, Divider } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoradorRepository } from '../src/database/moradorRepository';
import { EncomendaRepository } from '../src/database/encomendaRepository';
import { AvisoRepository } from '../src/database/avisoRepository';
import { Aviso, Morador } from '../src/types/databaseTypes';

export default function HomeScreen() {
  const router = useRouter();
  const [moradoresCount, setMoradoresCount] = useState<number>(0);
  const [encomendasPendentes, setEncomendasPendentes] = useState<number>(0);
  const [areaDificilCount, setAreaDificilCount] = useState<number>(0);
  const [encomendasHoje, setEncomendasHoje] = useState<number>(0);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados dos moradores
      const moradores = await MoradorRepository.getAll();
      setMoradoresCount(moradores.length);
      
      // Contar moradores em área de difícil acesso
      const dificilAcesso = moradores.filter(m => m.area_dificil_acesso).length;
      setAreaDificilCount(dificilAcesso);
      
      // Carregar encomendas pendentes
      const encomendas = await EncomendaRepository.getAll();
      const pendentes = encomendas.filter(e => e.status === 'pendente');
      setEncomendasPendentes(pendentes.length);
      
      // Calcular encomendas recebidas hoje
      const hoje = format(new Date(), 'yyyy-MM-dd');
      const encomendasDeHoje = encomendas.filter(e => 
        e.data_recebimento.startsWith(hoje)
      );
      setEncomendasHoje(encomendasDeHoje.length);
      
      // Carregar últimos avisos
      const latestAvisos = await AvisoRepository.getAll();
      setAvisos(latestAvisos.slice(0, 3)); // Últimos 3 avisos
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ComuAcesso</Text>
        <Text style={styles.subtitle}>Gerenciamento Comunitário</Text>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={[styles.statCard, styles.statMoradores]} 
          onPress={() => router.push('/moradores')}
        >
          <Text style={styles.statNumber}>{moradoresCount}</Text>
          <Text style={styles.statLabel}>Moradores</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, styles.statEncomendas]}
          onPress={() => router.push('/encomendas')}
        >
          <Text style={styles.statNumber}>{encomendasPendentes}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, styles.statDificil]}
        >
          <Text style={styles.statNumber}>{areaDificilCount}</Text>
          <Text style={styles.statLabel}>Difícil Acesso</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, styles.statHoje]}
        >
          <Text style={styles.statNumber}>{encomendasHoje}</Text>
          <Text style={styles.statLabel}>Hoje</Text>
        </TouchableOpacity>
      </View>
      
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title>Ações Rápidas</Title>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/encomendas/nova')}
            >
              <Text style={styles.actionButtonText}>Nova Encomenda</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/moradores/novo')}
            >
              <Text style={styles.actionButtonText}>Novo Morador</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/avisos/novo')}
            >
              <Text style={styles.actionButtonText}>Novo Aviso</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.avisosCard}>
        <Card.Content>
          <View style={styles.avisoHeaderContainer}>
            <Title>Avisos Recentes</Title>
            <TouchableOpacity onPress={() => router.push('/avisos')}>
              <Text style={styles.verTodos}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {avisos.length > 0 ? (
            avisos.map((aviso, index) => (
              <React.Fragment key={aviso.id}>
                <View style={styles.avisoItem}>
                  <Text style={styles.avisoDate}>{formatDate(aviso.data_criacao)}</Text>
                  <Text style={styles.avisoText}>{aviso.mensagem}</Text>
                </View>
                {index < avisos.length - 1 && <Divider style={styles.divider} />}
              </React.Fragment>
            ))
          ) : (
            <Text style={styles.noAvisos}>Nenhum aviso disponível</Text>
          )}
        </Card.Content>
        <Card.Actions>
          <TouchableOpacity 
            style={styles.novoAvisoButton}
            onPress={() => router.push('/avisos/novo')}
          >
            <Text style={styles.novoAvisoText}>Novo Aviso</Text>
          </TouchableOpacity>
        </Card.Actions>
      </Card>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>ComuAcesso v1.0</Text>
        <Text style={styles.footerSubtext}>Desenvolvido para comunidades</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  statMoradores: {
    backgroundColor: '#3498db',
  },
  statEncomendas: {
    backgroundColor: '#e74c3c',
  },
  statDificil: {
    backgroundColor: '#f39c12',
  },
  statHoje: {
    backgroundColor: '#2ecc71',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  avisosCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  avisoHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verTodos: {
    color: '#3498db',
    fontWeight: '500',
  },
  avisoItem: {
    marginVertical: 8,
  },
  avisoDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  avisoText: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 8,
  },
  noAvisos: {
    fontStyle: 'italic',
    color: '#95a5a6',
    marginVertical: 10,
  },
  novoAvisoButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 4,
  },
  novoAvisoText: {
    color: 'white',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#95a5a6',
  }
});