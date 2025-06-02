import { executeQuery } from '../database/db';
import { Encomenda, ModelResponse } from '../types';

export const EncomendasModel = {
    // Cadastrar uma nova encomenda
    cadastrarEncomenda: async (
        destinatarioId: number,
        descricao: string | null
    ): Promise<ModelResponse<{ id: number }>> => {
        try {
            const dataRecebimento = new Date().toISOString();
            const result = await executeQuery(
                'INSERT INTO Encomendas (destinatario_id, descricao, status, data_recebimento) VALUES (?, ?, ?, ?)',
                [destinatarioId, descricao, 'pendente', dataRecebimento]
            );
            return { id: result.insertId as number, success: true };
        } catch (error) {
            console.error('Erro ao cadastrar encomenda:', error);
            return { success: false, error };
        }
    },

    // Listar todas as encomendas
    listarEncomendas: async (): Promise<ModelResponse<{ encomendas: Encomenda[] }>> => {
        try {
            const result = await executeQuery(`
        SELECT e.*, m.nome as nome_destinatario 
        FROM Encomendas e
        JOIN Moradores m ON e.destinatario_id = m.id
        ORDER BY e.data_recebimento DESC
      `);
            return { success: true, encomendas: result.rows._array as Encomenda[] };
        } catch (error) {
            console.error('Erro ao listar encomendas:', error);
            return { success: false, error };
        }
    },

    // Buscar encomenda por ID
    buscarEncomenda: async (id: number): Promise<ModelResponse<{ encomenda: Encomenda }>> => {
        try {
            const result = await executeQuery(`
        SELECT e.*, m.nome as nome_destinatario 
        FROM Encomendas e
        JOIN Moradores m ON e.destinatario_id = m.id
        WHERE e.id = ?
      `, [id]);
            if (result.rows.length > 0) {
                return { success: true, encomenda: result.rows._array[0] as Encomenda };
            }
            return { success: false, error: 'Encomenda não encontrada' };
        } catch (error) {
            console.error('Erro ao buscar encomenda:', error);
            return { success: false, error };
        }
    },

    // Marcar encomenda como entregue
    marcarComoEntregue: async (id: number): Promise<ModelResponse> => {
        try {
            const dataEntrega = new Date().toISOString();
            await executeQuery(
                'UPDATE Encomendas SET status = ?, data_entrega = ? WHERE id = ?',
                ['entregue', dataEntrega, id]
            );
            return { success: true };
        } catch (error) {
            console.error('Erro ao atualizar status da encomenda:', error);
            return { success: false, error };
        }
    },

    // Excluir encomenda
    excluirEncomenda: async (id: number): Promise<ModelResponse> => {
        try {
            await executeQuery('DELETE FROM Encomendas WHERE id = ?', [id]);
            return { success: true };
        } catch (error) {
            console.error('Erro ao excluir encomenda:', error);
            return { success: false, error };
        }
    },
};