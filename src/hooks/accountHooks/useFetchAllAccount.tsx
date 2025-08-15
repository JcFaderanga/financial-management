import supabase from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import  { useEffect, useState } from 'react'

const useFetchAllAccount = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('')
    const [account, setAccount] = useState<any>();
    const {user} = useUserStore();
<<<<<<< HEAD
=======

>>>>>>> develop
    const fetchAccountData = async()=>{
        try{
            setLoading(true);
            const {data, error} = await supabase
                .from('accounts')
                .select('*')
<<<<<<< HEAD
                .eq('account_owner', user.id)
                ;
=======
                .eq('account_owner', user?.id)
>>>>>>> develop
            
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
