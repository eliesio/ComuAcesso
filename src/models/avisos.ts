import { executeQuery } from '../database/db';
import { Aviso, ModelResponse } from '../types';

export const AvisosModel = {
    // Cadastrar um novo aviso
    cadastrarAviso: async (mensagem: string): Promise<ModelResponse<{ id: number }>> => {
        try {
            const dataCriacao = new Date().toISOString();
            const result = await executeQuery(
                'INSERT INTO Avisos (mensagem, data_criacao) VALUES (?, ?)',
                [mensagem, dataCriacao]
            );
            return { id: result.insertId as number, success: true };
        } catch (error) {
            console.error('Erro ao cadastrar aviso:', error);
            return { success: false, error };
        }
    },

    // Listar todos os avisos
    listarAvisos: async (): Promise<ModelResponse<{ avisos: Aviso[] }>> => {
        try {
            const result = await executeQuery('SELECT * FROM Avisos ORDER BY data_criacao DESC');
            return { success: true, avisos: result.rows._array as Aviso[] };
        } catch (error) {
            console.error('Erro ao listar avisos:', error);
            return { success: false, error };
        }
    },

    // Buscar aviso por ID
    buscarAviso: async (id: number): Promise<ModelResponse<{ aviso: Aviso }>> => {
        try {
            const result = await executeQuery('SELECT * FROM Avisos WHERE id = ?', [id]);
            if (result.rows.length > 0) {
                return { success: true, aviso: result.rows._array[0] as Aviso };
            }
            return { success: false, error: 'Aviso não encontrado' };
        } catch (error) {
            console.error('Erro ao buscar aviso:', error);
            return { success: false, error };
        }
    },

    // Excluir aviso
    excluirAviso: async (id: number): Promise<ModelResponse> => {
        try {
            await executeQuery('DELETE FROM Avisos WHERE id = ?', [id]);
            return { success: true };
        } catch (error) {
            console.error('Erro ao excluir aviso:', error);
            return { success: false, error };
        }
    },
};