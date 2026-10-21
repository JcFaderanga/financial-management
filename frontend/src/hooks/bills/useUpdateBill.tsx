import { useState } from 'react';
import api from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';
import type { BillRecord, BillUpdate } from './types';

const useUpdateBill = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useUserStore();

    const updateBill = async (billIds: number[], updates: BillUpdate): Promise<BillRecord[]> => {
        try {
            setLoading(true);
            setError('');

            if (!user?.id) {
                throw new Error('User is not authenticated.');
            }

            if (Object.keys(updates).length === 0) {
                throw new Error('At least one bill field must be provided for update.');
            }

            if (billIds.length === 0) {
                throw new Error('At least one bill must be provided for update.');
            }

            const { data } = await api.patch<BillRecord[]>('/api/bills', {
                ids: billIds,
                updates,
            });
            return data;
        } catch (cause) {
            const message = cause instanceof Error ? cause.message : 'Failed to update bill.';
            setError(message);
            console.error('Error updating bill:', cause);
            throw cause instanceof Error ? cause : new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, updateBill };
};

export default useUpdateBill;
