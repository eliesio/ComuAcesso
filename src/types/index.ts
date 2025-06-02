export interface Morador {
    id: number;
    nome: string;
    endereco: string | null;
    telefone: string | null;
    area_dificil_acesso: number; // 0 ou 1 para representar boolean no SQLite
}

export interface Encomenda {
    id: number;
    destinatario_id: number;
    descricao: string | null;
    status: 'pendente' | 'entregue';
    data_recebimento: string;
    data_entrega: string | null;
    nome_destinatario?: string; // Para junções com a tabela Moradores
}

export interface Aviso {
    id: number;
    mensagem: string;
    data_criacao: string;
}

export interface QueryResult {
    insertId?: number;
    rowsAffected: number;
    rows: {
        _array: any[];
        length: number;
        item: (index: number) => any;
    };
}

export interface ModelResponse<T = any> {
    success: boolean;
    error?: string | Error;
    [key: string]: any;
}