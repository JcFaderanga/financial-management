import {useState,useEffect} from 'react'
import CustomInput from '@/components/inputs/CustomInputs'
import { useSpendings } from '@/store/useSpendingStore'
import { SubmitButton } from '@/components/button/SubmitButton'
import UseSaveItem from '@/hooks/spend_items/useSaveItem'
import useFetchItem from '@/hooks/spend_items/useFetchItem'
import DotsLoading from '@/components/UI/DotsLoading'
import { useUserStore } from '@/store/useUserStore'
import CustomDropdown from '@/components/inputs/CustomDropdown'
import MatchItem from './MatchItem'
import useUniqueItemList from '@/hooks/spend_items/useUniqueList'
import AddGroup from './AddGroup'
import { itemTypes } from '@/types/itemTypes'
const AddItem = () => {
const {setSpendItems, spendings} =useSpendings();
const {user} = useUserStore();
const [title, setItem] = useState<string>('');
const [price, setPrice] = useState<string>('');
const [category, setCategory] = useState<string | null>('');
// const [subCategory, setSubCategory] = useState<string>('');
const [isInputDisabled, setIsInputsDisabled] = useState<boolean>(true);
const [priceError, setPriceError] = useState<boolean>(false);
const [categoryError, setCategoryError] = useState<boolean>(false);
const [btnDisable, setBtnDisable] = useState<boolean>(true);
const [isDelay, setDelay ] = useState<boolean>(false);
const [doneSelect, setDoneSelect] = useState<boolean>(false);
const {title: fetchedTitles, loading: fetchedLoading, handleFetchTitle} = useFetchItem();
const {handleSaveItem} = UseSaveItem();
const {handleUniqueItem} = useUniqueItemList()
const [isAddingGroup, setIsAddGroup] = useState<boolean>(false);
const [selectedGroup, setSelectedGroup] = useState<any>(null); // store checked item IDs
 
useEffect(()=>{
    setBtnDisable(true);

    //validation for price value
    if(price && isNaN(Number(price))){
      setBtnDisable(true);
      setPriceError(true);
      return;
    }

    //checkin if title and price is not empty
    if(title && price){
        setBtnDisable(false)
        setPriceError(false);
    }

    if(category !== 'Select Category') setCategoryError(false);

},[title,price, category])

const handleSave =async()=>{
  //check if category is null
  if(!category || category === 'Select Category' ) {
      setCategoryError(true);
      return;
  }
    
    //disable save button when submit
    setBtnDisable(true)

    //create obj for selected inputs 
    const spent: itemTypes = {
      owner: user.id,
      title: title.trim().toLowerCase(),
      price: Number(price),
      category: category,
      grouped_in:selectedGroup ? selectedGroup[0]?.id : null
    };

    //save item to db and fetch
    const spentRes = await handleSaveItem(spent);

    //save item as state using zustand
    setSpendItems([...spendings || [], spentRes?.[0]])

    //check if the item is exsisting then save to db if not.
    handleUniqueItem(spent);

    //reset fields
    setItem('')
    setPrice('')
    setCategory(null)
    setBtnDisable(false)
}

//listen on changes in title
useEffect(()=>{
    if(!title.trim()) return;
    setDelay(true);

    //fetch matched titles in db after 500 millisecond
    //prenventing multiple request
    const debounce = setTimeout(()=>{
        handleFetchTitle(title);
        setDelay(false);
    },500);

    setDoneSelect(false);
    return () => clearTimeout(debounce);
},[title]);

//set selected matched item to input fields
const getSelectedItemId = (item: any)=>{
  setItem(item?.title.trim())
  setPrice(item?.price)
  setDoneSelect(true)
}

//for options in dropdown
const menu = (val: string) =>{
  setIsInputsDisabled(false);
  setCategory(val);
}


  const handleCheckboxChange = (item: any) => {
    setSelectedGroup(
      selectedGroup?.some((group: any)=>group?.id === item?.id) || false
      ?selectedGroup?.filter((itemId:any) => itemId.id !== item?.id)
      :[item]
    )
  };

  return (
    <>
      <header className={` flex justify-between item-center border-b border-gray-300 py-4 px-4 cursor-pointer`}>
          <strong className='custom-black text-2xl'>
            <span>Add Item</span>
          </strong>
      </header>
      <div className={`${isAddingGroup && '!hidden'} w-full md:flex justify-between py-4 border-b border-gray-300`}>
        <section className='lg:max-w-1/2 w-full flex justify-center md:border-r border-gray-300 '>
            <div className='px-4 '>
              <CustomDropdown onChange={menu} isActive={category}/>
                {
                  categoryError ? <p className='text-red-600'>Category cannot be empty.</p> : ""
                }
                {/* <CustomInput 
                    disabled={isInputDisabled} 
                    value={subCategory} type='string' 
                    placeholder={'Sub category (Jeep, Lawson etc.)'} 
                    onChange={setSubCategory}
                /> */}
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
                {selectedGroup?.map((grouped:any, index: number)=>{
                  return <span key={index}>Add to <span  className='text-green-700'>{grouped?.title}</span></span>
                })}
                
                <div className='underline py-2' onClick={()=>setIsAddGroup(!isAddingGroup)}>Add in a group</div>
                

                <SubmitButton 
                    title='Save'
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
      <section className={`${!isAddingGroup ? '!hidden' : 'block'} pb-4`}>
          <AddGroup 
            handleCheckboxChange={handleCheckboxChange}
            selectedGroup={selectedGroup}
            setIsAddGroup={()=>setIsAddGroup(!isAddingGroup)}
          />
         
      </section>
        
  </>
  )
}

export default AddItem