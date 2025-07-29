import { useState } from 'react'
import supabase from '@/lib/supabase'
import type { itemTypes } from '@/types/itemTypes';

const useUniqueItemList = () => {
   const [uniqueSpendings, setUniqueSpendings] = useState<itemTypes[] | null>(null)
//   const [error, setError] = useState<Error | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)


  const handleUniqueItem = async (item: itemTypes) => {

    const filteredItem: itemTypes = {
      owner: item.owner,
      title: item.title,
      price: item.price,
      location: item.location,
      category: item.category,
    };

    const query = supabase.from('unique_item_list');

    const {data, error} = await query.select('*');
    if(error) throw new Error(error.message);

    setUniqueSpendings(data);
    const ItemIsExisting = data?.some(
        (current)=> current.title === filteredItem.title 
        && current.price === filteredItem.price
    );
    
    if(!ItemIsExisting){
       let {error} = await query.insert(filteredItem)
       if(error) throw new Error(error.message)
    };
  }

  return {uniqueSpendings, handleUniqueItem }
}

export default useUniqueItemList;
