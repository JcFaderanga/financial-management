import {useState,useEffect, useCallback} from 'react'
import CustomInput from '@/components/inputs/CustomInputs'
import { useSpendings } from '@/store/useSpendingStore'
import SubmitButton from '@/components/button/SubmitButton'
import UseSaveItem from '@/hooks/spend_items/useSaveItem'
import { useUserStore } from '@/store/useUserStore'
import useUniqueItemList from '@/hooks/spend_items/useUniqueList'
import { itemTypes } from '@/types/itemTypes'
import OverviewDate from '@/hooks/OverviewDate'
import { getCurrentLocalTime } from '@/utils/DateFormat'
import {format} from "date-fns"
import { useNavigate, useParams } from 'react-router-dom'

import { IoCheckmark ,IoCloseOutline  } from "react-icons/io5";

const AddItemForm = () => {
const { category } = useParams(); 
const {setSpendItems, spendings} =useSpendings();
const {user} = useUserStore();
const [title, setItem] = useState<string | undefined>('');
const [price, setPrice] = useState<string>('');
const [subCategory, setSubCategory] = useState<string | undefined>('');
const [tempSub, setTemp] = useState<string | undefined>('');
const [isAddSubCategory, setAddSubCategory] = useState<boolean>(false)
const [priceError, setPriceError] = useState<boolean>(false);
const [btnDisable, setBtnDisable] = useState<boolean>(true);
const {handleSaveItem} = UseSaveItem();
const {handleUniqueItem, fetchUniqueList, uniqueItem, loading} = useUniqueItemList()
const {dateRange} = OverviewDate();
const navigate = useNavigate();

console.log('uniqueItem',subCategory)
useEffect(() => {
    async function Fetch() {
        const res = await fetchUniqueList(category);
        console.log(res)
    }
  
  Fetch();
}, [category]);

// field validation
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
},[title,price, category])

const handleSave = useCallback(async()=>{

  //check if price is null
  if(Number(price) <= 0){
      setPriceError(true);
      return;
  }

  //check if date format is valid
  if(format(dateRange, "yyyy-MM-dd HH:mm:ss.SSS") + '000+00' === 'invalid date'){
      return;
  }
  
    //disable save button when submit
    setBtnDisable(true)
    const currentTime = getCurrentLocalTime();
    const createdDate =  `${format(dateRange,'yyyy-MM-dd')} ${currentTime}`;

    //create obj for selected inputs 
    const spent: itemTypes = {
      owner: user.id,
      title: title?.trim().toLowerCase(),
      price: Number(price),
      category: category,
      sub_category: subCategory,
      created_at: createdDate
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
    setBtnDisable(false)

    //navifate back to records
    navigate('/')
},[category, price])

 if(loading) return 'Loading...';
    return (
        <div className="w-screen dark:text-white h-screen box-shadow border-t border-light-dark"> 
            <header className={` flex justify-between item-center p-4 cursor-pointer`}>
                <p className=' text-dark dark:text-white'>
                    <span>{category}</span>
                </p> 
                <span className="dark:text-white" onClick={()=>navigate(-1)}>back</span>
            </header>
            
            <div className=' px-4 max-w-7xl mx-auto'>
                <div className=' text-dark font-semibold text-center dark:text-white pb-4'>
                    <span>{dateRange}</span>
                </div>
                <div className='py-1'>
                    <strong>Specification</strong>
                    <div className=' p-1 flex flex-wrap gap-2'>
                        {/* If a subcategory is selected, show it */}
                        {subCategory ? (
                            <div className="py-2 px-4 rounded-xl bg-yellow-500 text-dark w-fit">{subCategory}</div>
                        ) : (
                            <>
                                {uniqueItem?.map((item: itemTypes) => {
                                if (!item?.sub_category) return null
                                return (
                                    <div
                                        key={item.sub_category}
                                        className={`
                                            ${subCategory === item.sub_category && 'bg-yellow-500 text-dark font-semibold' }
                                            py-2 px-4 rounded-xl bg-gray-200 dark:bg-light-dark w-fit cursor-pointer`}
                                        onClick={() => setSubCategory(item.sub_category)}
                                    >
                                        {item.sub_category}
                                    </div>
                                )
                                })}
                            </>
                        )}
                        <div className='py-2 px-4 rounded-xl bg-gray-200 dark:bg-light-dark w-fit cursor-pointer'
                            onClick={()=>setAddSubCategory(!isAddSubCategory)}>
                                +
                        </div> 
                    </div>
                </div>
                {
                    isAddSubCategory && 
                        <div className='flex gap-1 items-center'>
                            <CustomInput 
                                value={tempSub} type='string' 
                                placeholder={'Enter Sub category'} 
                                onChange={setTemp}
                            />
                            <div className='p-3 bg-gray-200 dark:bg-light-dark rounded-xl'
                            onClick={()=>{
                                setSubCategory(tempSub)
                                setAddSubCategory(!isAddSubCategory)
                            }}>
                                <IoCheckmark/>
                            </div>
                                <div className='p-3 bg-gray-200 dark:bg-light-dark rounded-xl'
                                onClick={()=>setAddSubCategory(!isAddSubCategory)}>
                                <IoCloseOutline/>
                            </div>
                        </div>
                        
                }
                
                    <div className='py-1'>
                    <strong>Typically use</strong>
                    <div className=' p-1 flex flex-wrap gap-2'>
                        <div className=' p-1 flex flex-wrap gap-2'>
                            {
                            uniqueItem?.map((item: itemTypes)=>{
                                return(
                                    <div key={item.category} 
                                        className={`
                                                ${title === item.title && '!bg-yellow-500 text-dark font-semibold' }
                                                py-2 px-4 rounded-xl bg-gray-200 dark:bg-light-dark w-fit cursor-pointer`}
                                        onClick={()=> setItem(item?.title)}>
                                        {item.title}
                                    </div>
                                )
                            })
                            }
                            {/* <div className='py-2 px-4 rounded-xl bg-gray-200 dark:bg-light-dark w-fit'>
                                +
                            </div>  */}
                        </div>
                    </div>
                </div>
                
                <div>
                
                    <CustomInput 
                        value={title} type='string' 
                        placeholder={'Enter Title'} 
                        onChange={setItem}
                    />
                    <CustomInput 
                        value={price} type='number' 
                        placeholder={'Enter Price'} 
                        onChange={setPrice}
                    />
                    
                    {
                    priceError ? <p className='text-red-600'>Invalid price value.</p> : ""
                    }
                    <SubmitButton 
                        title='Save'
                        onClick={handleSave} 
                        disabled={btnDisable}
                    />
                </div>
            </div>
        </div>

  )
}

export default AddItemForm