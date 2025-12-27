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
                .eq('owner', user.id);
            
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
            .eq("owner", user.id);

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


    return {
        FetchAllHistory,
        FetchBankHistory
    }
}

export default useTransactionHistory
