import supabase from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import { BankList } from '@/utils/BankList';
import { TransactionInfoType } from '@/types/AccountTypes';


const useTransactionHistory = () => {

    const {user} = useUserStore();

    const query = supabase.from('transaction');

    const getBankKey = (code: string | number) =>  BankList.find((d: any)=> d.code === code)?.key;

    const FetchAllHistory = async()=>{
        try{
            const {data, error} = await query
                .select('*')
                .eq('owner', user?.id);
            
            if(error) return {error: error.message, success: false}
            return {data: data, success: true};

        }catch(e){
            console.error(e)
        }
    }


const FetchBankHistory = async (bank_code: string | number) => {
    const BANK_KEY = bank_code && getBankKey(bank_code);

    try {
        const { data, error } = await query
            .select("*")
            .eq("bank_key", BANK_KEY)
            .eq("owner", user?.id);

        if (error) return { error: error.message, success: false };

        const enrichedData = await Promise.all(
            data.map(async (d: TransactionInfoType) => {
                if (!d.transaction_detail?.item_id) return d;

                const { data: itemData, error } = await supabase
                    .from("items")
                    .select("*")
                    .eq("id", d.transaction_detail.item_id)
                    .single();

                if (error) return d;

                return {
                    ...d,
                    transaction_detail: {
                        ...d.transaction_detail,
                        item_details: itemData,
                    },
                };
            })
        );

        return { data: enrichedData, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Unexpected error", success: false };
    }
};

type TargetDate = {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
} | string;

function baseQuery(){
    return supabase
      .from('transaction')
      .select('*')
      .eq('owner', user?.id)
      .order('created_at', { ascending: false });
}


async function enrichItems(data: TransactionInfoType[]) {
    return Promise.all(
        data?.map(async (d) => {
            if (!d.transaction_detail?.item_id) return d;

            const { data: itemData } = await supabase
                .from('items')
                .select('*')
                .eq('id', d.transaction_detail.item_id)
                .single();

            return {
                ...d,
                transaction_detail: {
                    ...d.transaction_detail,
                    item_details: itemData,
                },
            };
        })
    );
}
const FetchDailyHistory = async (targetDate: TargetDate) => {
   
    try {
        let query = supabase
        .from('transaction')
        .select('*')
        .eq('owner', user?.id)
        .order('created_at', { ascending: false });

        const applyDateRange = (
            start: string,
            end: string,
            timeStart = 'T00:00:00+00',
            timeEnd = 'T23:59:59+00'
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

        const { data, error } = await query;

        if (error) return { error: error.message, success: false };

        const enrichedData = await Promise.all(
            data.map(async (d: TransactionInfoType) => {
                if (!d.transaction_detail?.item_id) return d;

                const { data: itemData, error } = await supabase
                    .from("items")
                    .select("*")
                    .eq("id", d.transaction_detail.item_id)
                    .single();

                if (error) return d;

                return {
                    ...d,
                    transaction_detail: {
                        ...d.transaction_detail,
                        item_details: itemData,
                    },
                };
            })
        );

        return { data: enrichedData, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Unexpected error", success: false };
    }
};


function applyDateRange(
    query: any,
    start: string | Date,
    end: string | Date,
  ) {
    return query
      .gte('created_at', `${start}`)
      .lte('created_at', `${end}`);
}

const FetchMonthlyHistory = async (monthStart: Date | string, monthEnd: Date | string) => {
    let query = baseQuery();

    query = applyDateRange(query, monthStart, monthEnd);

    const { data, error } = await query;
    if (error) throw error;

    return enrichItems(data);
  }

    return {
        FetchAllHistory,
        FetchBankHistory,
        FetchDailyHistory,
        FetchMonthlyHistory
    }
}

export default useTransactionHistory
