import { useState } from 'react'
import supabase from '@/lib/supabase'

const useFetchSpecificItem = () => {
const [data, setData] = useState<any | null>(null)
const [error,setError] = useState<any>(null)
const [loading, setLoading] = useState<boolean>(false)


const getRecord = async (transaction_id: string | number | undefined) => {
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('id', transaction_id)

        if (error) {
            console.error('Error fetching data:', error);
            setError(error)
        } 

        setData(data)
        
    } catch (error: any) {
        throw new Error(error);
    }
    finally{
        setLoading(false);
    }  
};

return {data,error,loading, getRecord}
}

export default useFetchSpecificItem;