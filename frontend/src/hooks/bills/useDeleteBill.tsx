import { useState } from 'react';
import supabase from '@/lib/supabase';
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

            const { data, error: deleteError } = await supabase
                .from('bills')
                .delete()
                .in('id', billIds)
                .eq('user_id', user.id)
                .select('id');

            if (deleteError) {
                throw new Error(deleteError.message);
            }

            if (!data || data.length !== billIds.length) {
                throw new Error('One or more bills could not be deleted.');
            }

            return data.map((bill: { id: number }) => bill.id);
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
