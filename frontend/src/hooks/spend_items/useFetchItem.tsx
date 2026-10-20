import { useState } from 'react'
import supabase from '@/lib/supabase'
import type { itemTypes } from '@/types/itemTypes';

const useFetchItem = () => {
const [title, setTitle] = useState<itemTypes[] | null>(null)
const [error,setError] = useState<any>(null)
const [loading, setLoading] = useState<boolean>(false)


const handleFetchTitle = async (title: string) => {
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('unique_item_list')
            .select('*')
            .ilike('title', `%${title}%`);

        if (error) {
            console.error('Error fetching data:', error);
            setError(error)

        } else {
            setTitle(data)
        }

    } catch (error: any) {
        throw new Error(error);
    }
    finally{
        setLoading(false);
    }  
};

return {title,error,loading, handleFetchTitle}
}

export default useFetchItem;