import { useState } from 'react';
import supabase from '@/lib/supabase';
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

            const { data, error: insertError } = await supabase
                .from('bills')
                .insert({ ...bill, user_id: user.id })
                .select('*')
                .single();

            if (insertError) {
                throw new Error(insertError.message);
            }

            return data as BillRecord;
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
