import api from '@/lib/api';
import { useUserStore } from '@/store/useUserStore';
import { useCallback, useRef, useState } from 'react';
import type { BillRecord } from './types';

const useFetchBills = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [bills, setBills] = useState<BillRecord[]>([]);

    const { user } = useUserStore();
    const requestId = useRef(0);

    const fetchAccountData = useCallback(async (date: Date) => {
        const currentRequestId = ++requestId.current;
        try {
            setLoading(true);
            setError('');

            if (!user?.id) {
                throw new Error('User is not authenticated.');
            }

            // Use a half-open date range to include every timestamp on the month's final day.
            const year = date.getFullYear();
            const month = date.getMonth();

            // Format dates using local calendar values
            const formatDate = (year: number, month: number, day: number) => {
                return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            };

            const startDate = formatDate(year, month, 1);
            const nextMonth = new Date(year, month + 1, 1);
            const nextMonthStart = formatDate(
                nextMonth.getFullYear(),
                nextMonth.getMonth(),
                nextMonth.getDate(),
            );

            const { data } = await api.get<BillRecord[]>('/api/bills', {
                params: { startDate, endDate: nextMonthStart },
            });

            if (currentRequestId === requestId.current) {
                setBills(data);
            }

            return data;
        } catch (e) {
            const message = e instanceof Error
                ? e.message
                : 'Failed to fetch bills.';

            if (currentRequestId === requestId.current) {
                setError(message);
                console.error('Error fetching bills:', e);
            }

            return null;
        } finally {
            if (currentRequestId === requestId.current) {
                setLoading(false);
            }
        }
    }, [user?.id]);

    return {
        loading,
        error,
        bills,
        fetchAccountData,
    };
};

export default useFetchBills;
