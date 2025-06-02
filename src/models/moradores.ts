import { executeQuery } from '../database/db';
import { Morador, ModelResponse } from '../types';

export const MoradoresModel = {
    // Cadastrar um novo morador
    cadastrarMorador: async (
        nome: string,
        endereco: string | null,
        telefone: string | null,
        areaDificilAcesso: boolean
    ): Promise<ModelResponse<{ id: number }>> => {
        try {
            const result = await executeQuery(
                'INSERT INTO Moradores (nome, endereco, telefone, area_dificil_acesso) VALUES (?, ?, ?, ?)',
                [nome, endereco, telefone, areaDificilAcesso ? 1 : 0]
            );
            return { id: result.insertId as number, success: true };
        } catch (error) {
            console.error('Erro ao cadastrar morador:', error);
            return { success: false, error };
        }
    },

    // Listar todos os moradores
    listarMoradores: async (): Promise<ModelResponse<{ moradores: Morador[] }>> => {
        try {
            const result = await executeQuery('SELECT * FROM Moradores ORDER BY nome');
            return { success: true, moradores: result.rows._array as Morador[] };
        } catch (error) {
            console.error('Erro ao listar moradores:', error);
            return { success: false, error };
        }
    },

    // Buscar morador por ID
    buscarMorador: async (id: number): Promise<ModelResponse<{ morador: Morador }>> => {
        try {
            const result = await executeQuery('SELECT * FROM Moradores WHERE id = ?', [id]);
            if (result.rows.length > 0) {
                return { success: true, morador: result.rows._array[0] as Morador };
            }
            return { success: false, error: 'Morador não encontrado' };
        } catch (error) {
            console.error('Erro ao buscar morador:', error);
            return { success: false, error };
        }
    },

    // Atualizar morador
    atualizarMorador: async (
        id: number,
        nome: string,
        endereco: string | null,
        telefone: string | null,
        areaDificilAcesso: boolean
    ): Promise<ModelResponse> => {
        try {
            await executeQuery(
                'UPDATE Moradores SET nome = ?, endereco = ?, telefone = ?, area_dificil_acesso = ? WHERE id = ?',
                [nome, endereco, telefone, areaDificilAcesso ? 1 : 0, id]
            );
            return { success: true };
        } catch (error) {
            console.error('Erro ao atualizar morador:', error);
            return { success: false, error };
        }
    },

    // Excluir morador
    excluirMorador: async (id: number): Promise<ModelResponse> => {
        try {
            await executeQuery('DELETE FROM Moradores WHERE id = ?', [id]);
            return { success: true };
        } catch (error) {
            console.error('Erro ao excluir morador:', error);
            return { success: false, error };
        }
    },
};