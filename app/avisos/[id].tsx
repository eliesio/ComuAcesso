import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput, Text, Portal, Dialog } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Header } from '../../src/components/Header';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { AvisoRepository } from '../../src/database/avisoRepository';
import { Aviso } from '../../src/types/databaseTypes';

export default function EditAvisoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const avisoId = parseInt(id);
  const router = useRouter();
  
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    loadAviso();
  }, [avisoId]);

  const loadAviso = async () => {
    try {
      setLoading(true);
      const data = await AvisoRepository.getById(avisoId);
      
      if (data) {
        setAviso(data);
        setMensagem(data.mensagem);
      } else {
        Alert.alert('Erro', 'Aviso não encontrado');
        router.back();
      }
    } catch (error) {
      console.error('Error loading aviso:', error);
      Alert.alert('Erro', 'Falha ao carregar aviso');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!mensagem.trim()) {
      newErrors.mensagem = 'O texto do aviso é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !aviso) return;

    try {
      setSaving(true);
      const updatedAviso: Aviso = {
        ...aviso,
        mensagem: mensagem.trim()
      };
      
      await AvisoRepository.update(updatedAviso);
      router.back();
    } catch (error) {
      console.error('Error updating aviso:', error);
      Alert.alert('Erro', 'Falha ao atualizar aviso');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await AvisoRepository.delete(avisoId);
      router.back();
    } catch (error) {
      console.error('Error deleting aviso:', error);
      Alert.alert('Erro', 'Falha ao excluir aviso');
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Carregando aviso..." />;
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Editar Aviso" 
        rightContent={
          <Button 
            icon="delete" 
            mode="contained" 
            buttonColor="#ff5252"
            onPress={() => setDialogVisible(true)}
            disabled={saving}
          >
            Excluir
          </Button>
        }
      />
      
      <ScrollView style={styles.formContainer}>
        <TextInput
          label="Texto do Aviso *"
          value={mensagem}
          onChangeText={setMensagem}
          multiline
          numberOfLines={6}
          style={styles.input}
          error={!!errors.mensagem}
        />
        {errors.mensagem && <Text style={styles.errorText}>{errors.mensagem}</Text>}
        
        {aviso && (
          <Text style={styles.dateInfo}>
            Publicado em: {format(new Date(aviso.data_criacao), 'dd/MM/yyyy HH:mm')}
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
            Atualizar Aviso
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
            <Text>Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita.</Text>
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
  dateInfo: {
    marginTop: 8,
    marginBottom: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});