import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput, Checkbox, Text, Portal, Dialog } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { MoradorRepository } from '../../src/database/moradorRepository';
import { EncomendaRepository } from '../../src/database/encomendaRepository';
import { Morador } from '../../src/types/databaseTypes';

export default function EditMoradorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const moradorId = parseInt(id);
  const router = useRouter();
  
  const [morador, setMorador] = useState<Morador | null>(null);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [areaDificilAcesso, setAreaDificilAcesso] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [hasEncomendas, setHasEncomendas] = useState(false);

  useEffect(() => {
    loadMorador();
    checkEncomendas();
  }, [moradorId]);

  const loadMorador = async () => {
    try {
      setLoading(true);
      const data = await MoradorRepository.getById(moradorId);
      
      if (data) {
        setMorador(data);
        setNome(data.nome);
        setEndereco(data.endereco || '');
        setTelefone(data.telefone || '');
        setAreaDificilAcesso(!!data.area_dificil_acesso);
      } else {
        Alert.alert('Erro', 'Morador não encontrado');
        router.back();
      }
    } catch (error) {
      console.error('Error loading morador:', error);
      Alert.alert('Erro', 'Falha ao carregar dados do morador');
    } finally {
      setLoading(false);
    }
  };

  const checkEncomendas = async () => {
    try {
      const encomendas = await EncomendaRepository.getByDestinatario(moradorId);
      setHasEncomendas(encomendas.length > 0);
    } catch (error) {
      console.error('Error checking encomendas:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !morador) return;

    try {
      setSaving(true);
      const updatedMorador: Morador = {
        ...morador,
        nome: nome.trim(),
        endereco: endereco.trim() || undefined,
        telefone: telefone.trim() || undefined,
        area_dificil_acesso: areaDificilAcesso
      };
      
      await MoradorRepository.update(updatedMorador);
      router.back();
    } catch (error) {
      console.error('Error updating morador:', error);
      Alert.alert('Erro', 'Falha ao atualizar morador');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await MoradorRepository.delete(moradorId);
      router.back();
    } catch (error) {
      console.error('Error deleting morador:', error);
      Alert.alert('Erro', 'Falha ao excluir morador');
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Carregando dados do morador..." />;
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Editar Morador" 
        rightContent={
          <Button 
            icon="delete" 
            mode="contained" 
            buttonColor="#ff5252"
            onPress={() => setDialogVisible(true)}
            disabled={saving || hasEncomendas}
          >
            Excluir
          </Button>
        }
      />
      
      <ScrollView style={styles.formContainer}>
        <TextInput
          label="Nome *"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          error={!!errors.nome}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
        
        <TextInput
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
          style={styles.input}
        />
        
        <TextInput
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
          style={styles.input}
        />
        
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={areaDificilAcesso ? 'checked' : 'unchecked'}
            onPress={() => setAreaDificilAcesso(!areaDificilAcesso)}
          />
          <Text style={styles.checkboxLabel}>
            Reside em área de difícil acesso
          </Text>
        </View>
        
        {hasEncomendas && (
          <Text style={styles.warningText}>
            Este morador não pode ser excluído pois possui encomendas registradas.
          </Text>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.button}
          >
            Salvar
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

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Confirmar exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja excluir este morador? Esta ação não pode ser desfeita.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleDelete}>Excluir</Button>
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
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginTop: -8,
    marginLeft: 8,
  },
  warningText: {
    color: 'orange',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});