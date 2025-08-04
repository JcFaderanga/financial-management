import {useState,useEffect} from 'react'
import CustomInput from '@/components/inputs/CustomInputs'
import { itemTypes } from '@/types/itemTypes';
import AddGroup from '../addItem/AddGroup';
import { SubmitButton } from '@/components/button/SubmitButton';
import supabase from '@/lib/supabase';
import { useSpendings } from '@/store/useSpendingStore';

const SpentEdit = ({itemProps}:{itemProps: itemTypes}) => {

    const [item, setItem] = useState<itemTypes | null>(null)
    const [isAddingGroup, setIsAddGroup] = useState<boolean>(false);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [btnDisable, setBtnDisable] = useState<boolean>(true);
    const { spendings, setSpendItems } = useSpendings();

    useEffect(() => {
        if (itemProps) {
            setItem({
            id: itemProps.id,
            owner: itemProps.owner,
            title: itemProps.title,
            price: itemProps.price,
            category: itemProps.category,
            location: itemProps.location,
            created_at: itemProps.created_at,
            });
        }
    }, [itemProps]);


    const handleCheckboxChange = (item: any) => {
    setSelectedGroup(
      selectedGroup?.some((group: any)=>group?.id === item?.id) || false
      ?selectedGroup?.filter((itemId:any) => itemId.id !== item?.id)
      :[item]
    )
  };
    useEffect(()=>{
        setBtnDisable(true);
        if(item?.title && item?.category){
            setBtnDisable(false)
        }
        
    },[item?.category,item?.title])
    const handleSave=async()=>{
    //check if category is null

    //disable save button when submit
    setBtnDisable(true)
    
    const updated = { 
        title: item?.title,
        price: item?.price,
        category: item?.category,
        grouped_in: selectedGroup ? selectedGroup[0]?.id : null 
    }
    const { error, data } = await supabase
        .from('items')
        .update(updated)
        .eq('id', item?.id)
        .select(); 

        if (error) {
        console.error(error);
        } else if (data && data.length > 0) {
        // Replace the updated item in the local state
        const updatedItem = data[0];

        const updatedSpendings = spendings.map((spending: itemTypes) =>
            spending.id === updatedItem.id ? updatedItem : spending
        );

        setSpendItems(updatedSpendings);
        setBtnDisable(false)
    }
        
  }

  return (
    <div className='p-4'>
        <section className='w-full '>
            <div className=''>
                <CustomInput 
                    value={item?.title || ''} 
                    type='string' 
                    placeholder={'Enter Title'} 
                    onChange={(val) => setItem(prev => ({ ...prev, title: val }))}
                />
                <CustomInput 
                    value={item?.price || ''} 
                    type='number' 
                    placeholder={'Enter Price'} 
                    onChange={(val) => setItem(prev => ({ ...prev, price: Number(val) }))}
                />
                <div onClick={()=>setIsAddGroup(!isAddingGroup)}>
                {
                    selectedGroup?.length > 0
                    ?selectedGroup?.map((grouped:any, index: number)=>{
                        return <span key={index}>Add to <span  className='text-green-700 '>{grouped?.title}</span></span>
                    })
                    : <div className='underline' >Add in a group</div>
                }
                </div>       
                
                
            </div>
            <section className={`${!isAddingGroup ? '!hidden' : 'block'} pb-4 border border-slate-300 mb-4 rounded-xl `}>
                <AddGroup 
                    handleCheckboxChange={handleCheckboxChange}
                    selectedGroup={selectedGroup}
                    setIsAddGroup={()=>setIsAddGroup(!isAddingGroup)}
                />
            </section>
            <SubmitButton 
                title='Update'
                onClick={handleSave} 
                disabled={btnDisable}
            />
        </section>
        
        
    </div>
  )
}

export default SpentEdit