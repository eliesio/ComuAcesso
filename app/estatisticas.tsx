import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, List, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Header } from '../src/components/Header';
import { LoadingScreen } from '../src/components/LoadingScreen';
import { MoradorRepository } from '../src/database/moradorRepository';
import { EncomendaRepository } from '../src/database/encomendaRepository';
import { formatDate, isToday } from '../src/utils/dateUtils';
import { executeQuery } from '../src/database/db';

interface EstatisticasData {
  totalMoradores: number;
  moradoresDificilAcesso: number;
  totalEncomendas: number;
  encomendasPendentes: number;
  encomendasEntregues: number;
  encomendasHoje: number;
  entregasHoje: number;
  tempoPendenciaMedia: number;
}

interface TopMorador {
  id: number;
  nome: string;
  total: number;
}

export default function EstatisticasScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EstatisticasData | null>(null);
  const [topMoradores, setTopMoradores] = useState<TopMorador[]>([]);
  
  useEffect(() => {
    loadEstatisticas();
  }, []);
  
  const loadEstatisticas = async () => {
    try {
      setLoading(true);
      
      // Carregar dados básicos
      const moradores = await MoradorRepository.getAll();
      const moradoresDificilAcesso = moradores.filter(m => m.area_dificil_acesso);
      
      const encomendas = await EncomendaRepository.getAll();
      const pendentes = encomendas.filter(e => e.status === 'pendente');
      const entregues = encomendas.filter(e => e.status === 'entregue');
      
      const encomendasHoje = encomendas.filter(e => isToday(e.data_recebimento));
      const entregasHoje = entregues.filter(e => e.data_entrega && isToday(e.data_entrega));
      
      // Calcular tempo médio de pendência
      let tempoTotal = 0;
      let contadorEntregas = 0;
      
      entregues.forEach(e => {
        if (e.data_entrega) {
          const recebimento = new Date(e.data_recebimento).getTime();
          const entrega = new Date(e.data_entrega).getTime();
          const diferencaDias = (entrega - recebimento) / (1000 * 60 * 60 * 24);
          tempoTotal += diferencaDias;
          contadorEntregas++;
        }
      });
      
      const tempoPendenciaMedia = contadorEntregas > 0 
        ? Math.round((tempoTotal / contadorEntregas) * 10) / 10 
        : 0;
      
      // Obter top moradores com mais encomendas
      const topMoradoresQuery = await executeQuery<{id: number, nome: string, total: number}>(
        `SELECT m.id, m.nome, COUNT(e.id) as total
         FROM Moradores m
         JOIN Encomendas e ON m.id = e.destinatario_id
         GROUP BY m.id
         ORDER BY total DESC
         LIMIT 5`
      );
      
      setStats({
        totalMoradores: moradores.length,
        moradoresDificilAcesso: moradoresDificilAcesso.length,
        totalEncomendas: encomendas.length,
        encomendasPendentes: pendentes.length,
        encomendasEntregues: entregues.length,
        encomendasHoje: encomendasHoje.length,
        entregasHoje: entregasHoje.length,
        tempoPendenciaMedia
      });
      
      setTopMoradores(topMoradoresQuery);
      
    } catch (error) {
      console.error('Error loading estatisticas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen message="Carregando estatísticas..." />;
  }
  
  return (
    <View style={styles.container}>
      <Header title="Estatísticas" />
      
      <ScrollView style={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Visão Geral</Title>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.totalMoradores || 0}</Text>
                <Text style={styles.statLabel}>Moradores</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.moradoresDificilAcesso || 0}</Text>
                <Text style={styles.statLabel}>Difícil Acesso</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {stats ? Math.round((stats.moradoresDificilAcesso / stats.totalMoradores) * 100) : 0}%
                </Text>
                <Text style={styles.statLabel}>Percentual</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Encomendas</Title>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.totalEncomendas || 0}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.encomendasPendentes || 0}</Text>
                <Text style={styles.statLabel}>Pendentes</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.encomendasEntregues || 0}</Text>
                <Text style={styles.statLabel}>Entregues</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.encomendasHoje || 0}</Text>
                <Text style={styles.statLabel}>Recebidas Hoje</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.entregasHoje || 0}</Text>
                <Text style={styles.statLabel}>Entregues Hoje</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.tempoPendenciaMedia || 0}</Text>
                <Text style={styles.statLabel}>Dias p/ Entrega</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Moradores com Mais Encomendas</Title>
            
            {topMoradores.length > 0 ? (
              topMoradores.map((morador, index) => (
                <List.Item
                  key={morador.id}
                  title={morador.nome}
                  description={`${morador.total} encomendas`}
                  left={() => <Text style={styles.rankNumber}>{index + 1}</Text>}
                  onPress={() => router.push(`/moradores/${morador.id}`)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhum dado disponível</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 24,
    textAlign: 'center',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#95a5a6',
    marginVertical: 10,
    textAlign: 'center',
  }
});