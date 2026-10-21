import { useState } from 'react';
import api from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';
import type { BillInsert, BillRecord } from './types';

const useInsertBill = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useUserStore();

    const insertBill = async (bill: Omit<BillInsert, 'user_id'>): Promise<BillRecord> => {
        try {
            setLoading(true);
            setError('');

            if (!user?.id) {
                throw new Error('User is not authenticated.');
            }

            const { data } = await api.post<BillRecord>('/api/bills', bill);
            return data;
        } catch (cause) {
            const message = cause instanceof Error ? cause.message : 'Failed to create bill.';
            setError(message);
            console.error('Error creating bill:', cause);
            throw cause instanceof Error ? cause : new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, insertBill };
};

export default useInsertBill;
