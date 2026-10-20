import {useEffect, useState} from 'react'
import CustomInput from '@/components/inputs/CustomInputs'
import CustomDropdown from '@/components/inputs/CustomDropdown'
import useFetchGroupItem from '@/hooks/spend_items/useFetchGroupItem'
import supabase from '@/lib/supabase'
import SubmitButton from '@/components/button/SubmitButton'
import { useUserStore } from '@/store/useUserStore'
import { itemCategory } from '@/utils/DropDownList'
const AddGroup = ({
    handleCheckboxChange,
    setIsAddGroup,
    selectedGroup
}:{
    handleCheckboxChange: (item: any)=> any,
    setIsAddGroup:()=> void,
    selectedGroup: any
}) => {
    const [category, setCategory] = useState<string | null>('');
    const [title, setItem] = useState<string>('');
    const [btnDisable,setBtnDisable] = useState<boolean>(true)
    const [isAdding,setIsAdding] = useState<boolean>(false)
    const {group, handleFetchGroup} = useFetchGroupItem();
    const {user} = useUserStore();

    useEffect(()=>{
        setBtnDisable(true);
        if(title && category){
            setBtnDisable(false)
        }
        
    },[category,title])

    const saveGroup = async ()=>{
        setBtnDisable(!btnDisable)

        if(!category && !title)return;
            const grouped = {
                owner: user?.id,
                category: category,
                title: title
            }
            const {error} = await supabase
                .from('grouped_item')
                .insert(grouped);
            if(error) console.error(error)
            
            setBtnDisable(!btnDisable)
            setIsAdding(!isAdding)

            //refech grouplist
            handleFetchGroup();
        }

    if(isAdding){
        return(
            <div className='px-4 py-4 border-b border-slate-300'>
                <CustomDropdown onChange={(val)=>setCategory(val)} isActive={category} options={itemCategory}/>

                    <CustomInput 
                        value={title} type='string' 
                        placeholder={'Enter Title'} 
                        onChange={setItem}
                    />
                    <div className='flex gap-2'>
                        <SubmitButton
                            title='Save'
                            onClick={saveGroup} 
                            disabled={btnDisable}
                        />
                        <SubmitButton 
                            title='Cancel'
                            onClick={()=>setIsAdding(!isAdding)} 
                        />
                    </div>
            </div>
        )
    }
  return (
    <div>
        <div className='px-4 py-2 border-b border-slate-300'>
            <button 
                onClick={()=> setIsAdding(!isAdding)}
                className='px-4 py-1 rounded bg-slate-200'>
                    Create new group
            </button>
        </div>
        <div className='px-4'>
            <div className='py-2 my-2 '>
                {group?.map((item: any) => (
                    <div key={item.id} className="px-4 py-2 my-1 bg-slate-50" onClick={() => handleCheckboxChange(item)}>
                    <input
                        type="checkbox"
                        onChange={() => {}}
                        checked={(selectedGroup || [])?.some((group: any)=>group?.id === item.id)}
                    
                    />
                    <span className="px-2">
                        <span className="text-slate-600">[{item.category}]</span> {item.title}
                    </span>
                    </div>
                ))}
            </div>
            <button className='w-full py-1 rounded cursor-pointer bg-slate-200' onClick={setIsAddGroup}>Okay</button>
          </div>
    </div>
  )
}

export default AddGroup