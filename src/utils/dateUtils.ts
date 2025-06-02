import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatString: string = "dd 'de' MMMM 'de' yyyy"): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatString, { locale: ptBR });
};

export const getCurrentDate = (): string => {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
};

export const getCurrentDateFormatted = (): string => {
    return formatDate(new Date());
};

export const isToday = (dateString: string): boolean => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return dateString.startsWith(today);
};