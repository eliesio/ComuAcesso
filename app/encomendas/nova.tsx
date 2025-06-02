import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput, Text, HelperText, List } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Header } from '../../src/components/Header';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { EmptyState } from '../../src/components/EmptyState';
import { EncomendaRepository } from '../../src/database/encomendaRepository';
import { MoradorRepository } from '../../src/database/moradorRepository';
import { Encomenda, Morador } from '../../src/types/databaseTypes';

export default function NovaEncomendaScreen() {
  const router = useRouter();
  const [descricao, setDescricao] = useState('');
  const [moradoresList, setMoradoresList] = useState<Morador[]>([]);
  const [selectedMorador, setSelectedMorador] = useState<Morador | null>(null);
  const [moradorSearchQuery, setMoradorSearchQuery] = useState('');
  const [showMoradorList, setShowMoradorList] = useState(false);
  const [filteredMoradores, setFilteredMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadMoradores();
  }, []);

  useEffect(() => {
    if (moradorSearchQuery.trim() === '') {
      setFilteredMoradores(moradoresList);
    } else {
      const filtered = moradoresList.filter(morador => 
        morador.nome.toLowerCase().includes(moradorSearchQuery.toLowerCase())
      );
      setFilteredMoradores(filtered);
    }
  }, [moradorSearchQuery, moradoresList]);

  const loadMoradores = async () => {
    try {
      setLoading(true);
      const data = await MoradorRepository.getAll();
      setMoradoresList(data);
      setFilteredMoradores(data);
    } catch (error) {
      console.error('Error loading moradores:', error);
      Alert.alert('Erro', 'Falha ao carregar lista de moradores');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedMorador) {
      newErrors.destinatario = 'Selecione um destinatário';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectMorador = (morador: Morador) => {
    setSelectedMorador(morador);
    setMoradorSearchQuery(morador.nome);
    setShowMoradorList(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const newEncomenda: Encomenda = {
        destinatario_id: selectedMorador!.id!,
        descricao: descricao.trim() || undefined,
        status: 'pendente',
        data_recebimento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      };
      
      await EncomendaRepository.insert(newEncomenda);
      router.back();
    } catch (error) {
      console.error('Error saving encomenda:', error);
      Alert.alert('Erro', 'Falha ao salvar encomenda');
    } finally {
      setSaving(false);
    }
  };

  const handleFocusMoradorInput = () => {
    setShowMoradorList(true);
  };

  if (loading) {
    return <LoadingScreen message="Carregando dados..." />;
  }

  if (moradoresList.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Nova Encomenda" />
        <EmptyState
          title="Nenhum morador cadastrado"
          message="É necessário cadastrar pelo menos um morador antes de registrar encomendas."
          icon="account-alert"
          buttonText="Cadastrar Morador"
          onButtonPress={() => router.push('/moradores/novo')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Nova Encomenda" />
      
      <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <TextInput
            label="Destinatário *"
            value={moradorSearchQuery}
            onChangeText={setMoradorSearchQuery}
            onFocus={handleFocusMoradorInput}
            style={styles.input}
            error={!!errors.destinatario}
          />
          {errors.destinatario && (
            <HelperText type="error">{errors.destinatario}</HelperText>
          )}
          
          {showMoradorList && (
            <View style={styles.dropdownList}>
              {filteredMoradores.length > 0 ? (
                filteredMoradores.map((morador) => (
                  <List.Item
                    key={morador.id}
                    title={morador.nome}
                    description={morador.endereco || 'Sem endereço'}
                    onPress={() => handleSelectMorador(morador)}
                    style={styles.listItem}
                  />
                ))
              ) : (
                <List.Item
                  title="Nenhum morador encontrado"
                  description="Tente outro termo de busca"
                  style={styles.listItem}
                />
              )}
            </View>
          )}
        </View>
        
        <TextInput
          label="Descrição da encomenda"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.button}
          >
            Registrar Encomenda
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => router.back()}
            disabled={saving}
            style={styles.button}
          >
            Cancelar
          </Button>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 1,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    maxHeight: 200,
    marginTop: -12,
    marginBottom: 16,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});