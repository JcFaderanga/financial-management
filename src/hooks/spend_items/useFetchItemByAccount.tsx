import { useState } from 'react'
import supabase from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore';

const useFetchItemByAccount = () => {
const [error,setError] = useState<any>(null)
const [loading, setLoading] = useState<boolean>(false)
const {user} = useUserStore();

const handleFetchItemByAccount = async (account_code: string | undefined) => {
    setLoading(true);

    try {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('owner', user.id)
            .eq('mode_of_payment', account_code)

        if (error) {
            setError(error)
            throw new Error(error.message)
        } 
        return data;

    } catch (error: any) {
        throw new Error(error);
    }
    finally{
        setLoading(false);
    }  
};

return {error,loading, handleFetchItemByAccount}
}

export default useFetchItemByAccount;