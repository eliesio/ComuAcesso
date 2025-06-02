import { executeQuery } from './db';
import { Encomenda } from '../types/databaseTypes';

export class EncomendaRepository {
    // Get all encomendas
    static getAll = (): Promise<Encomenda[]> => {
        return executeQuery<Encomenda>('SELECT * FROM Encomendas ORDER BY data_recebimento DESC');
    };

    // Get encomendas by destinatario_id
    static getByDestinatario = (destinatarioId: number): Promise<Encomenda[]> => {
        return executeQuery<Encomenda>(
            'SELECT * FROM Encomendas WHERE destinatario_id = ? ORDER BY data_recebimento DESC',
            [destinatarioId]
        );
    };

    // Get encomenda by ID
    static getById = (id: number): Promise<Encomenda | null> => {
        return executeQuery<Encomenda>('SELECT * FROM Encomendas WHERE id = ?', [id])
            .then(result => result.length > 0 ? result[0] : null);
    };

    // Insert new encomenda
    static insert = (encomenda: Encomenda): Promise<number> => {
        return new Promise((resolve, reject) => {
            executeQuery(
                'INSERT INTO Encomendas (destinatario_id, descricao, status, data_recebimento, data_entrega) VALUES (?, ?, ?, ?, ?)',
                [
                    encomenda.destinatario_id,
                    encomenda.descricao || '',
                    encomenda.status,
                    encomenda.data_recebimento,
                    encomenda.data_entrega || null
                ]
            )
                .then(() => executeQuery<{ id: number }>('SELECT last_insert_rowid() as id'))
                .then(result => resolve(result[0].id))
                .catch(error => reject(error));
        });
    };

    // Update encomenda
    static update = (encomenda: Encomenda): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!encomenda.id) {
                reject(new Error('Encomenda ID is required for update'));
                return;
            }

            executeQuery(
                'UPDATE Encomendas SET destinatario_id = ?, descricao = ?, status = ?, data_recebimento = ?, data_entrega = ? WHERE id = ?',
                [
                    encomenda.destinatario_id,
                    encomenda.descricao || '',
                    encomenda.status,
                    encomenda.data_recebimento,
                    encomenda.data_entrega || null,
                    encomenda.id
                ]
            )
                .then(() => resolve())
                .catch(error => reject(error));
        });
    };

    // Mark encomenda as delivered
    static markAsDelivered = (id: number, dataEntrega: string): Promise<void> => {
        return executeQuery(
            'UPDATE Encomendas SET status = ?, data_entrega = ? WHERE id = ?',
            ['entregue', dataEntrega, id]
        ).then(() => { });
    };

    // Delete encomenda
    static delete = (id: number): Promise<void> => {
        return executeQuery('DELETE FROM Encomendas WHERE id = ?', [id])
            .then(() => { });
    };
}