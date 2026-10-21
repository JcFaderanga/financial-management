import { useCallback, useState } from 'react';
import api from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';

type BillMonthOption = {
    month_key: string;
    custom_payment_method: string | null;
};

const useFetchBillMonths = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [months, setMonths] = useState<string[]>([]);
    const [customPaymentMethods, setCustomPaymentMethods] = useState<string[]>([]);
    const { user } = useUserStore();

    const fetchBillMonths = useCallback(async (): Promise<string[] | null> => {
        try {
            setLoading(true);
            setError('');

            if (!user?.id) {
                throw new Error('User is not authenticated.');
            }

            const { data: options } = await api.get<BillMonthOption[]>('/api/bills/month-options');
            const availableMonths = Array.from(new Set<string>(
                options
                    .map((bill) => bill.month_key)
                    .filter((month) => /^\d{4}-\d{2}$/.test(month)),
            )).sort((first, second) => second.localeCompare(first));
            const methods = Array.from(new Set<string>(
                options
                    .map((bill) => bill.custom_payment_method?.trim())
                    .filter((method): method is string => Boolean(method)),
            ));

            setMonths(availableMonths);
            setCustomPaymentMethods(methods);
            return availableMonths;
        } catch (cause) {
            const message = cause instanceof Error ? cause.message : 'Failed to fetch bill months.';
            setError(message);
            console.error('Error fetching bill months:', cause);
            return null;
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    return { loading, error, months, customPaymentMethods, fetchBillMonths };
};

export default useFetchBillMonths;
