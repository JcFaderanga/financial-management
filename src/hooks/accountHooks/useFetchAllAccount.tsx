import supabase from '@/lib/supabase';
import  { useEffect, useState } from 'react'

const useFetchAllAccount = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('')
    const [account, setAccount] = useState<any>();

    const fetchAccountData = async()=>{
        try{
            setLoading(true);
            const {data, error} = await supabase
                .from('accounts')
                .select('*');
            
            if(error){
                setError(error?.message)
            }

            if(data){
                setAccount(data)
            }   
            setLoading(false);
        }catch(e){
            console.error(e)
        }
    }
    
    useEffect(()=>{
        fetchAccountData();
    },[])

    return {loading,error,account,fetchAccountData}
}

export default useFetchAllAccount
