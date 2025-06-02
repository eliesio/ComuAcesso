import * as SQLite from 'expo-sqlite';
import { Morador, Encomenda, Aviso } from '../types/databaseTypes';

// Open the database using the new API
const db = SQLite.openDatabaseSync('ComuAcesso.db');

// Setup database tables
export const setupDatabase = async (): Promise<void> => {
    try {
        // Enable foreign keys
        await db.execAsync('PRAGMA foreign_keys = ON;');

        // Create Moradores table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Moradores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                endereco TEXT,
                telefone TEXT,
                area_dificil_acesso INTEGER CHECK (area_dificil_acesso IN (0, 1)) DEFAULT 0
            );
        `);

        // Create Encomendas table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Encomendas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                destinatario_id INTEGER NOT NULL,
                descricao TEXT,
                status TEXT CHECK (status IN ('pendente', 'entregue', 'cancelado')) NOT NULL,
                data_recebimento TEXT NOT NULL,
                data_entrega TEXT,
                FOREIGN KEY(destinatario_id) REFERENCES Moradores(id) ON DELETE CASCADE
            );
        `);

        // Create Avisos table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Avisos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mensagem TEXT NOT NULL,
                data_criacao TEXT NOT NULL DEFAULT (datetime('now'))
            );
        `);

        console.log('Database setup complete');
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    }
};

// Generic function to execute SELECT queries
export const executeQuery = async <T>(
    sql: string,
    params: any[] = []
): Promise<T[]> => {
    try {
        const result = await db.getAllAsync<T>(sql, params);
        return result;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
};

// Function to execute INSERT/UPDATE/DELETE queries
export const executeNonQuery = async (
    sql: string,
    params: any[] = []
): Promise<SQLite.SQLiteRunResult> => {
    try {
        const result = await db.runAsync(sql, params);
        return result;
    } catch (error) {
        console.error('Non-query execution error:', error);
        throw error;
    }
};

// Function to get a single row
export const getFirstAsync = async <T>(
    sql: string,
    params: any[] = []
): Promise<T | null> => {
    try {
        const result = await db.getFirstAsync<T>(sql, params);
        return result;
    } catch (error) {
        console.error('Get first query error:', error);
        throw error;
    }
};

// Function to execute raw SQL (for complex operations)
export const execAsync = async (sql: string): Promise<void> => {
    try {
        await db.execAsync(sql);
    } catch (error) {
        console.error('Exec async error:', error);
        throw error;
    }
};