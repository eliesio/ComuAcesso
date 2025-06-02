import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Card, Searchbar, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { EmptyState } from '../../src/components/EmptyState';
import { MoradorRepository } from '../../src/database/moradorRepository';
import { Morador } from '../../src/types/databaseTypes';

export default function MoradoresScreen() {
    const router = useRouter();
    const [moradores, setMoradores] = useState<Morador[]>([]);
    const [filteredMoradores, setFilteredMoradores] = useState<Morador[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadMoradores();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMoradores(moradores);
        } else {
            const filtered = moradores.filter(morador =>
                morador.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (morador.endereco && morador.endereco.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (morador.telefone && morador.telefone.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredMoradores(filtered);
        }
    }, [searchQuery, moradores]);

    const loadMoradores = async () => {
        try {
            setLoading(true);
            const data = await MoradorRepository.getAll();
            setMoradores(data);
            setFilteredMoradores(data);
        } catch (error) {
            console.error('Error loading moradores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMorador = () => {
        router.push('/moradores/novo');
    };

    const handleEditMorador = (id: number) => {
        router.push(`/moradores/${id}`);
    };

    const renderItem = ({ item }: { item: Morador }) => (
        <Card
            style={styles.card}
            onPress={() => handleEditMorador(item.id!)}
        >
            <Card.Content>
                <Text variant="titleLarge">{item.nome}</Text>
                {item.endereco && <Text variant="bodyMedium">Endereço: {item.endereco}</Text>}
                {item.telefone && <Text variant="bodyMedium">Telefone: {item.telefone}</Text>}
                <Text variant="bodySmall">
                    {
                        item.area_dificil_acesso
                            ? "✓ Área de difícil acesso"
                            : "✗ Área de fácil acesso"
                    }
                </Text>
            </Card.Content>
        </Card>
    );

    if (loading) {
        return <LoadingScreen message="Carregando moradores..." />;
    }

    return (
        <View style={styles.container}>
            <Header 
                title="Moradores"
                backButton={true}
                rightContent={
                    <Button
                        icon="plus"
                        mode="contained"
                        onPress={handleAddMorador}
                    >
                        Novo
                    </Button>
                }
            />

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Pesquisar moradores"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </View>

            {
                filteredMoradores.length === 0 ? (
                    <EmptyState
                        title="Nenhum morador encontrado"
                        message={
                            searchQuery.trim() !== ''
                                ? "Tente uma pesquisa diferente"
                                : "Cadastre o primeiro morador"
                        }
                        icon="account-off-outline"
                        buttonText="Adicionar Morador"
                        onButtonPress={handleAddMorador}
                    />
                ) : (
                    <FlatList
                        data={filteredMoradores}
                        keyExtractor={(item) => item.id?.toString() || `temp-${Math.random()}`}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                    />
                )
            }
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
});