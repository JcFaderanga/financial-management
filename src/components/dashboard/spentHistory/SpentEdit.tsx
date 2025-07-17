import {useState,useEffect} from 'react'
import CustomInput from '@/components/inputs/CustomInputs'
import { itemTypes } from '@/types/itemTypes';

const SpentEdit = ({itemProps}:{itemProps: itemTypes}) => {

    const [item, setItem] = useState<itemTypes | null>(null)

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

  return (
    <section className=' w-full flex justify-center'>
        <div className='px-4'>
            <CustomInput 
                value={item?.title || ''} 
                type='string' 
                placeholder={'Enter Title'} 
                onChange={(val) => setItem(prev => ({ ...prev, title: val }))}
            />
            <CustomInput 
                value={item?.price || 0} 
                type='number' 
                placeholder={'Enter Price'} 
                onChange={(val) => setItem(prev => ({ ...prev, price: Number(val) }))}
            />
          
            {/* <SubmitButton 
                onClick={handleSave} 
                disabled={btnDisable}
            /> */}
        </div>
    </section>
  )
}

export default SpentEdit