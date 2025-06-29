import { useState } from 'react'
import supabase from '@/lib/supabase'
import { itemTypes } from '@/types/itemTypes'
import { useUserStore } from '@/store/useUserStore'

const useFetchAllSpending = () => {
const {user} = useUserStore();
const [data, setData] = useState<itemTypes[] | []>([])
const [error,setError] = useState<any>(null)
const [loading, setLoading] = useState<boolean>(false)


const handleFetchAllSpendings = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('owner', user?.id)

        if (error) {
            console.error('Error fetching spending data:', error);
            setError(error)
        }

        if(!data?.length) return null;
        setData(data);
        return data;
        

    } catch (error: any) {
        throw new Error(error);
    }
    finally{
        setLoading(false);
    }  
};

return {data, error,loading, handleFetchAllSpendings}
}

export default useFetchAllSpending;