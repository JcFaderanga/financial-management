import { useCallback, useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';

export type MonthlyBillTotals = {
    month: string;
    totalAmount: number;
    paid: number;
    unpaid: number;
};

type MonthlyBillTotalsRecord = {
    month_key: string;
    total_amount: number | string;
    paid: number | string;
    unpaid: number | string;
};

const useMonthlyBillTotals = () => {
    const [monthlyBillTotals, setMonthlyBillTotals] = useState<MonthlyBillTotals[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUserStore();

    const fetchMonthlyBillTotals = useCallback(async () => {
        if (!user?.id) {
            setMonthlyBillTotals([]);
            setError('User is not authenticated.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase.rpc('get_monthly_bill_totals');
            if (fetchError) {
                throw fetchError;
            }

            setMonthlyBillTotals(((data ?? []) as MonthlyBillTotalsRecord[]).map((record) => ({
                month: record.month_key,
                totalAmount: Number(record.total_amount) || 0,
                paid: Number(record.paid) || 0,
                unpaid: Number(record.unpaid) || 0,
            })));
        } catch (cause) {
            const message = cause instanceof Error ? cause.message : 'Failed to fetch monthly bill totals.';
            console.error('Error fetching monthly bill totals:', cause);
            setMonthlyBillTotals([]);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        void fetchMonthlyBillTotals();
    }, [fetchMonthlyBillTotals]);

    return {
        monthlyBillTotals,
        loading,
        error,
        refetch: fetchMonthlyBillTotals,
    };
};

export default useMonthlyBillTotals;
