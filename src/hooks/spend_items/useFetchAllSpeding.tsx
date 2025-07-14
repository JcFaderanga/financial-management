import { useState } from 'react'
import supabase from '@/lib/supabase'
import type { itemTypes } from '@/types/itemTypes';
import { useUserStore } from '@/store/useUserStore'

type TargetDate = {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
} | string;

const useFetchAllSpending = () => {
  const { user } = useUserStore();
  const [data, setData] = useState<itemTypes[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchAllSpendings = async (targetDate?: TargetDate) => {
    setLoading(true);

    try {
      let query = supabase
        .from('items')
        .select('*')
        .eq('owner', user?.id)
        .order('created_at', { ascending: false });

      const applyDateRange = (
        start: string,
        end: string,
        timeStart = 'T00:00:00',
        timeEnd = 'T23:59:59'
      ) => {
        return query
          .gte('created_at', `${start}${timeStart}`)
          .lte('created_at', `${end}${timeEnd}`);
      };

      if (typeof targetDate === 'object') {
        const { startDate, endDate, startTime, endTime } = targetDate;

        if(startDate && !endDate){
            query = applyDateRange(
                startDate,
                startDate,
            );
        }else if (startDate && endDate) {
            query = applyDateRange(
                startDate,
                endDate,
                startTime ? `T${startTime}:00` : 'T00:00:00',
                endTime ? `T${endTime}:00` : 'T23:59:59'
            );
        }

      } else if (typeof targetDate === 'string') {
        query = applyDateRange(targetDate, targetDate);
      }

      const { data: result, error } = await query;
      console.log(result);

      if (error) {
        console.error('Error fetching spending data:', error);
        setError(error);
        return;
      }

      if (!result?.length) return null;

      setData(result);
      return result;

    } catch (err: any) {
      setError(err);
      throw new Error(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, handleFetchAllSpendings };
};

export default useFetchAllSpending;
