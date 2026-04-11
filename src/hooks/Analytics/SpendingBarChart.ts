import { useState } from 'react'
import supabase from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'
import {CalendarTotalCalculator} from '@/utils/itemFormat'
const useFetchAllTransactions = () => {
    const { user } = useUserStore();
    const [data, setData] = useState<any>([]);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
        

// const GroupItemsByMonth = (data: any)=>{
//     return Object.values(
//         data?.reduce((acc: any, item: any) => {
//             const month = item.created_at.slice(0, 7);

//             if (!acc[month]) {
//             acc[month] = { month, total: item.price };
//             }
//             acc[month].total += item.price;

//             return acc;
//         }, {})
//     );
// } 

    const fetchYearlyRecordedSpendings = async (targetYear: number | string | Date = new Date().getFullYear()): Promise<any> => {
        setLoading(true)
        try {
            // let query_recorded = supabase
            // .from('items')
            // .select('*')
            // .eq('owner', user?.id)
            // .gte('created_at', `${targetYear}-01-01T00:00:00+00`)
            // .lte('created_at', `${targetYear}-12-31T23:59:59+00`)
            // .order('created_at', { ascending: false });

            // const { data: recorded_data, error: error_recorded_data } = await query_recorded;
            // if (error_recorded_data) {
            //     setError(error_recorded_data);
            //     throw new Error(error_recorded_data.message || 'Unknown error');
            // }

            let query = supabase
            .from('transaction')
            .select('*')
            .eq('owner', user?.id)
            .gte('created_at', `${targetYear}-01-01T00:00:00+00`)
            .lte('created_at', `${targetYear}-12-31T23:59:59+00`)
            .order('created_at', { ascending: false });

            const { data: data_transaction, error: error_transaction } = await query;
             if (error_transaction) {
                setError(error_transaction);
                throw new Error(error_transaction.message || 'Unknown error');
            }

            const calculate = new CalendarTotalCalculator();
            const MonthlyOutFlow = calculate.getMonthlyTotal(data_transaction);
            console.log("data_transaction", MonthlyOutFlow);
            setData(MonthlyOutFlow);
            setLoading(false);
        } catch (err: any) {
            setError(err);
            throw new Error(err.message || 'Unknown error');
        }
    };
    return { data, error, loading, fetchYearlyRecordedSpendings };
    
}
export default useFetchAllTransactions;
