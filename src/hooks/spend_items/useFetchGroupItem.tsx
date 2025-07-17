import { useState,useEffect} from 'react'
import supabase from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'
const useFetchGroupItem = () => {
const [group, setGroup] = useState<any>(null)
const [error,setError] = useState<any>(null)
const [loading, setLoading] = useState<boolean>(false)
  const { user } = useUserStore();

const handleFetchGroup = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('grouped_item')
            .select('*')
            .eq('owner', user?.id)

        if (error) {
            console.error('Error fetching data:', error);
            setError(error)

        } else {
            setGroup(data)
        }

    } catch (error: any) {
        throw new Error(error);
    }
    finally{
        setLoading(false);
    }  
};
useEffect(()=>{
handleFetchGroup();
},[])
return {group,error,loading, handleFetchGroup}
}

export default useFetchGroupItem;