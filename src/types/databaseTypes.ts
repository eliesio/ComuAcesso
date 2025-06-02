// Database types
export interface Morador {
    id?: number;
    nome: string;
    endereco?: string;
    telefone?: string;
    area_dificil_acesso?: boolean;
}

export interface Encomenda {
    id?: number;
    destinatario_id: number;
    descricao?: string;
    status: 'pendente' | 'entregue';
    data_recebimento: string;
    data_entrega?: string;
}

export interface Aviso {
    id?: number;
    mensagem: string;
    data_criacao: string;
}