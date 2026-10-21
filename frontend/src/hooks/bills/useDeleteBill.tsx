import { useState } from 'react';
import api from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';

const useDeleteBill = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useUserStore();

    const deleteBill = async (billIds: number[]): Promise<number[]> => {
        try {
            setLoading(true);
            setError('');

            if (!user?.id) {
                throw new Error('User is not authenticated.');
            }

            if (billIds.length === 0) {
                throw new Error('At least one bill must be provided for deletion.');
            }

            const { data } = await api.delete<number[]>('/api/bills', {
                data: { ids: billIds },
            });
            return data;
        } catch (cause) {
            const message = cause instanceof Error ? cause.message : 'Failed to delete bill.';
            setError(message);
            console.error('Error deleting bill:', cause);
            throw cause instanceof Error ? cause : new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, deleteBill };
};

export default useDeleteBill;
