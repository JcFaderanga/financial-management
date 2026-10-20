import supabase from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import  { useState } from 'react'

const useFetchAllAccount = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('')
    const [account, setAccount] = useState<any>();
    const {user} = useUserStore();

    const fetchAccountData = async()=>{
        try{
            setLoading(true);
            const {data, error} = await supabase
                .from('accounts')
                .select('*')
                .eq('account_owner', user.id)
                // .order('amount', {ascending: false})
                .order('account_name', {ascending: true})
                ;
            
            if(error){
                setError(error?.message)
            }

            setAccount(data)
            setLoading(false);
            return data;

        }catch(e){
            console.error(e)
        }
    }

    return {loading,error,account,fetchAccountData}
}

export default useFetchAllAccount
