import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Header } from '../../src/components/Header';
import { AvisoRepository } from '../../src/database/avisoRepository';
import { Aviso } from '../../src/types/databaseTypes';

export default function NovoAvisoScreen() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!mensagem.trim()) {
      newErrors.mensagem = 'O texto do aviso é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const newAviso: Aviso = {
        mensagem: mensagem.trim(),
        data_criacao: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      };
      
      await AvisoRepository.insert(newAviso);
      router.back();
    } catch (error) {
      console.error('Error saving aviso:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Novo Aviso" />
      
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
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Publicar Aviso
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => router.back()}
            disabled={loading}
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
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});