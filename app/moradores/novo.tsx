import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Checkbox, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { MoradorRepository } from '../../src/database/moradorRepository';
import { Morador } from '../../src/types/databaseTypes';

export default function NovoMoradorScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [areaDificilAcesso, setAreaDificilAcesso] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const newMorador: Morador = {
        nome: nome.trim(),
        endereco: endereco.trim() || undefined,
        telefone: telefone.trim() || undefined,
        area_dificil_acesso: areaDificilAcesso
      };
      
      await MoradorRepository.insert(newMorador);
      router.back();
    } catch (error) {
      console.error('Error saving morador:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Novo Morador" />
      
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
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Salvar
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