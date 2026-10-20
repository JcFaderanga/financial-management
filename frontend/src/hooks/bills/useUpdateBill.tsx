import { useState } from 'react';
import supabase from '@/lib/supabase';
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

            const { data, error: updateError } = await supabase
                .from('bills')
                .update(updates)
                .in('id', billIds)
                .eq('user_id', user.id)
                .select('*');

            if (updateError) {
                throw new Error(updateError.message);
            }

            if (!data || data.length !== billIds.length) {
                throw new Error('One or more bills could not be updated.');
            }

            return data as BillRecord[];
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
