import { useState } from 'react'
import supabase from '@/lib/supabase'
import type { itemTypes } from '@/types/itemTypes';
import { useUserStore } from '@/store/useUserStore';

const useUniqueItemList = () => {
    const {user} = useUserStore();
   const [uniqueSpendings, setUniqueSpendings] = useState<itemTypes[] | null>(null)
   const [uniqueItem, setUniqueItem] = useState<itemTypes[] | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<Error | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)

const query = supabase.from('unique_item_list');

  const handleUniqueItem = async (item: itemTypes) => {

    const filteredItem: itemTypes = {
      owner: item.owner,
      title: item.title,
      price: item.price,
      location: item.location,
      category: item.category,
      sub_category: item.sub_category,
    };

    const {data, error} = await query.select('*');

    if(error) throw new Error(error.message);
    setUniqueSpendings(data);

    const ItemIsExisting = data?.some(
        (current)=> current.title === filteredItem.title 
        && current.sub_category === filteredItem.sub_category
    );
    
    if(!ItemIsExisting){
       let {error} = await query.insert(filteredItem)
       if(error) throw new Error(error.message)
    };
  }

  const fetchUniqueList =async(category: string = '')=>{ 

    try{
    setLoading(true);
      const {data, error} = await query
          .select('*')
          .eq('owner', user?.id)
          .eq('category', category);

      
      if(error) console.log(error);
      setUniqueItem(data);
    setLoading(false);
     return data;
    }catch(e){ console.error(e);}
    
  }
  
  return {
    uniqueSpendings,
    uniqueItem,
    loading,
    handleUniqueItem,
    fetchUniqueList 
  }
}

export default useUniqueItemList;
