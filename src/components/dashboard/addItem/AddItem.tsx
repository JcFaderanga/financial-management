import React, {useState,useEffect} from 'react'
import CustomInput from '@/components/inputs/CustomInputs'
import { useSpendings } from '@/store/useSpendingStore'
import { SubmitButton } from '@/components/button/SubmitButton'
import UseSaveItem from '@/hooks/spend_items/useSaveItem'
import useFetchItem from '@/hooks/spend_items/useFetchItem'
import DotsLoading from '@/components/UI/DotsLoading'
import { useUserStore } from '@/store/useUserStore'
import CustomDropdown from '@/components/inputs/CustomDropdown'
import MatchItem from './MatchItem'

const AddItem = () => {
const {setSpendItems, spendings} =useSpendings();
const {user} = useUserStore();
const [title, setItem] = useState<string>('');
const [price, setPrice] = useState<string>('');
const [category, setCategory] = useState<string>('');
const [isInputDisabled, setIsInputsDisabled] = useState<boolean>(true);
const [priceError, setPriceError] = useState<boolean>(false);
const [categoryError, setCategoryError] = useState<boolean>(false);
const [btnDisable, setBtnDisable] = useState<boolean>(true);
const [isDelay, setDelay ] = useState<boolean>(false);
const [doneSelect, setDoneSelect] = useState<boolean>(false);
const {title: fetchedTitles, loading: fetchedLoading, handleFetchTitle} = useFetchItem();
const {handleSaveItem} = UseSaveItem();

useEffect(()=>{
    setBtnDisable(true)
    if(price && isNaN(Number(price))){
      setBtnDisable(true);
      setPriceError(true);
      return;
    }
    if(title && price){
        setBtnDisable(false)
        setPriceError(false);
    }

},[title,price])

const handleSave =async()=>{

  if(!category || category === 'Select Category' ) {
      setCategoryError(true);
      return;
  }
    
    setBtnDisable(true)
    const spent = {
      owner: user.id,
      title: title,
      price: Number(price),
      category: category,
    };

    const spentRes = await handleSaveItem(spent);
    setSpendItems([...spendings || [], spentRes?.[0]])

    setItem('')
    setPrice('')
    setCategory('Select Category')
    setBtnDisable(false)
}

useEffect(()=>{
    if(!title.trim()) return;
    setDelay(true);

    const debounce = setTimeout(()=>{
        handleFetchTitle(title);
        setDelay(false);
    },500);

    setDoneSelect(false);

    return () => clearTimeout(debounce);
},[title]);

const getSelectedItemId = (item: any)=>{
  setItem(item?.title.trim())
  setPrice(item?.price)
  setDoneSelect(true)
}

const menu = (val: string) =>{
  setIsInputsDisabled(false);
  setCategory(val);
}

  return (
    <>
      <header className='border-b border-gray-300 py-4'>
          <strong className='custom-black text-2xl px-3'>Add Item</strong>
      </header>
      <div className='w-full md:flex justify-between py-4 lg:h-[300px] border-b border-gray-300'>
        <section className='lg:max-w-1/2 w-full flex justify-center md:border-r border-gray-300'>
            <div className='px-4'>
              <CustomDropdown onChange={menu}/>
                {
                  categoryError ? <p className='text-red-600'>Category cannot be empty.</p> : ""
                }
                <CustomInput 
                    disabled={isInputDisabled} 
                    value={title} type='string' 
                    placeholder={'Enter Title'} 
                    onChange={setItem}
                />
                <CustomInput 
                    disabled={isInputDisabled} 
                    value={price} type='number' 
                    placeholder={'Enter Price'} 
                    onChange={setPrice}
                />
                {
                  priceError ? <p className='text-red-600'>Invalid price value.</p> : ""
                }
                <SubmitButton 
                    onClick={handleSave} 
                    disabled={btnDisable}
                />
            </div>
        </section>
        <section className="w-full lg:px-4">
            {isDelay && title && !doneSelect? ( 
                <DotsLoading />
            ) : fetchedTitles && title && !fetchedLoading && !doneSelect? (
                <MatchItem 
                    current={fetchedTitles} 
                    getSelectedItemId={getSelectedItemId}
                />
            ) : (
              ""
            )}
        </section>
      </div>
  </>
  )
}

export default AddItem