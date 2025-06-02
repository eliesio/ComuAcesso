import { executeQuery } from './db';
import { Aviso } from '../types/databaseTypes';

export class AvisoRepository {
    // Get all avisos
    static getAll = (): Promise<Aviso[]> => {
        return executeQuery<Aviso>('SELECT * FROM Avisos ORDER BY data_criacao DESC');
    };

    // Get aviso by ID
    static getById = (id: number): Promise<Aviso | null> => {
        return executeQuery<Aviso>('SELECT * FROM Avisos WHERE id = ?', [id])
            .then(result => result.length > 0 ? result[0] : null);
    };

    // Insert new aviso
    static insert = (aviso: Aviso): Promise<number> => {
        return new Promise((resolve, reject) => {
            executeQuery(
                'INSERT INTO Avisos (mensagem, data_criacao) VALUES (?, ?)',
                [aviso.mensagem, aviso.data_criacao]
            )
                .then(() => executeQuery<{ id: number }>('SELECT last_insert_rowid() as id'))
                .then(result => resolve(result[0].id))
                .catch(error => reject(error));
        });
    };

    // Update aviso
    static update = (aviso: Aviso): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!aviso.id) {
                reject(new Error('Aviso ID is required for update'));
                return;
            }

            executeQuery(
                'UPDATE Avisos SET mensagem = ?, data_criacao = ? WHERE id = ?',
                [aviso.mensagem, aviso.data_criacao, aviso.id]
            )
                .then(() => resolve())
                .catch(error => reject(error));
        });
    };

    // Delete aviso
    static delete = (id: number): Promise<void> => {
        return executeQuery('DELETE FROM Avisos WHERE id = ?', [id])
            .then(() => { });
    };
}