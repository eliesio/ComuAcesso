import { executeQuery } from './db';
import { Morador } from '../types/databaseTypes';

export class MoradorRepository {
    // Get all moradores
    static getAll = (): Promise<Morador[]> => {
        return executeQuery<Morador>('SELECT * FROM Moradores ORDER BY nome');
    };

    // Get morador by ID
    static getById = (id: number): Promise<Morador | null> => {
        return executeQuery<Morador>('SELECT * FROM Moradores WHERE id = ?', [id])
            .then(result => result.length > 0 ? result[0] : null);
    };

    // Insert new morador
    static insert = (morador: Morador): Promise<number> => {
        return new Promise((resolve, reject) => {
            executeQuery(
                'INSERT INTO Moradores (nome, endereco, telefone, area_dificil_acesso) VALUES (?, ?, ?, ?)',
                [morador.nome, morador.endereco || '', morador.telefone || '', morador.area_dificil_acesso ? 1 : 0]
            )
                .then(() => executeQuery<{ id: number }>('SELECT last_insert_rowid() as id'))
                .then(result => resolve(result[0].id))
                .catch(error => reject(error));
        });
    };

    // Update morador
    static update = (morador: Morador): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!morador.id) {
                reject(new Error('Morador ID is required for update'));
                return;
            }

            executeQuery(
                'UPDATE Moradores SET nome = ?, endereco = ?, telefone = ?, area_dificil_acesso = ? WHERE id = ?',
                [morador.nome, morador.endereco || '', morador.telefone || '', morador.area_dificil_acesso ? 1 : 0, morador.id]
            )
                .then(() => resolve())
                .catch(error => reject(error));
        });
    };

    // Delete morador
    static delete = (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            executeQuery('DELETE FROM Moradores WHERE id = ?', [id])
                .then(() => resolve())
                .catch(error => reject(error));
        });
    };
}