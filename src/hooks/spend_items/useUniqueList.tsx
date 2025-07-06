import { useState } from 'react'
import supabase from '@/lib/supabase'
import type { itemTypes } from '@/types/itemTypes';

const useUniqueItemList = () => {
   const [uniqueSpendings, setUniqueSpendings] = useState<itemTypes[] | null>(null)
//   const [error, setError] = useState<Error | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)

  const handleUniqueItem = async (item: itemTypes) => {
    const query = supabase.from('unique_item_list');

    const {data, error} = await query.select('*');
    if(error) throw new Error(error.message);

    setUniqueSpendings(data);
    const ItemIsExisting = data?.some(
        (current)=> current.title === item.title 
        && current.price === item.price
    );
    
    if(!ItemIsExisting){
       let {error} = await query.insert(item)
       if(error) throw new Error(error.message)
    };
  }

  return {uniqueSpendings, handleUniqueItem }
}

export default useUniqueItemList;
