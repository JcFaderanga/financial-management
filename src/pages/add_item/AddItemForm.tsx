import {useState,useEffect, useCallback} from 'react'
import CustomInput from '@/components/inputs/CustomInputs'
import { useSpendingList } from '@/store/useSpendingStore'
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
import useFetchAllAccount from '@/hooks/accountHooks/useFetchAllAccount'
import { Link, useLocation } from 'react-router-dom'
import { usePaymentMethod } from '@/store/useAccountStore';
import PageWrapper from '@/wrapper/PageWrapper'
const AddItemForm = () => {
const { category } = useParams(); 
const {setSpendingTransactionList, transactions} =useSpendingList();
const {modeOfPayment} = usePaymentMethod();
const {user} = useUserStore();
const [title, setTitle] = useState<string | undefined>('');
const [price, setPrice] = useState<string>('');
const [subCategory, setSubCategory] = useState<string | undefined>('');
const [tempSub, setTemp] = useState<string | undefined>('');
const [tempTitle, setTempTitle] = useState<string | undefined>('');
const [isAddSubCategory, setAddSubCategory] = useState<boolean>(false)
const [isAddTitle, setAddTitle] = useState<boolean>(false)
const [priceError, setPriceError] = useState<boolean>(false);
const [btnDisable, setBtnDisable] = useState<boolean>(true);
const {handleSaveItem, loading: saveLoading} = UseSaveItem();
const {handleUniqueItem, fetchUniqueList, uniqueItem, loading} = useUniqueItemList()
const {dateRange} = OverviewDate();
const {fetchAccountData, account} = useFetchAllAccount();

const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
    fetchUniqueList(category);
    fetchAccountData();
}, [category]);

const uniqueSubcategory: string[] = [
  ...new Set(uniqueItem?.map((item: any) => item.sub_category))
];

const uniqueTitle: string[] = [
  ...new Set(uniqueItem?.map((item: any) => item.title))
];


// field validation
useEffect(()=>{
    setBtnDisable(true);

    //validation for price value
    if(price && isNaN(Number(price))){
      setBtnDisable(true);
      setPriceError(true);
      return;
    }

    //check if title and price is not empty
    if(title && price && subCategory && modeOfPayment){
        setBtnDisable(false)
        setPriceError(false);
    }
},[title,price, category, subCategory , modeOfPayment])


const handleSave = useCallback(async()=>{

  //check if price is null or below 0
  if(Number(price) <= 0){
      setPriceError(true);
      return;
  }

  if(!modeOfPayment){
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
      mode_of_payment: modeOfPayment,
      created_at: createdDate,
    };

    //save item to db and fetch
    const spentRes = await handleSaveItem(spent);

    //save item as state using zustand
    setSpendingTransactionList([...transactions || [], spentRes].reverse())

    //check if the item is existing then save to db if not.
    handleUniqueItem(spent);

    //reset fields
    setTitle('')
    setPrice('')
    setBtnDisable(false)

    //navigate back to records
   navigate('/')
},[category, price, title ,subCategory, modeOfPayment])

 if(loading) return 'Loading...';
    return (
        <PageWrapper className=" dark:text-white h-screen"> 
            <header className={` flex justify-between item-center p-4 cursor-pointer`}>
                <p className=' text-dark dark:text-white'>
                    <span>{category}</span>
                </p> 
                <div className=' text-dark font-semibold text-center dark:text-white pb-4'>
                    <span>{dateRange}</span>
                </div>
                <span className="dark:text-white" onClick={()=>navigate(-1)}>back</span>
            </header>
            {/* Form Container */}
            <div className=' px-4 lg:flex'>

                {/* Details */}
                <div className='w-full lg:max-w-3/5'>
                    <div className='py-2 rounded-2xl'>
                        <strong>Specification</strong>
                        <div className=' p-1 flex flex-wrap gap-2'>
                            {/* If a subcategory is selected, show it */}
                            
                                <>
                                    {uniqueSubcategory?.map((item: string, index) => {
                                    if (!item) return null
                                    return (
                                        <div
                                            key={index}
                                            className={`
                                                ${subCategory === item && '!bg-yellow-500 text-dark font-semibold' }
                                                py-2 px-4 rounded-xl bg-gray-200 dark:bg-light-dark w-fit cursor-pointer`}
                                            onClick={() => setSubCategory(item === subCategory ? '' : item)}
                                        >
                                            {item}
                                        </div>
                                    )
                                    })}
                                </>
                            
                            <div className={`${(subCategory || isAddSubCategory) && 'hidden'} py-2 px-4 rounded-xl bg-gray-200 dark:bg-light-dark w-fit cursor-pointer`}
                                onClick={()=>setAddSubCategory(!isAddSubCategory)}>
                                    +
                            </div> 
                        </div>
                        {
                            isAddSubCategory && 
                            <>
                            { !subCategory && <span className='text-yellow-200'>unsave</span>}
                                <div className='flex gap-1 items-center'>
                                    <CustomInput 
                                        disabled = {!!subCategory }
                                        value={tempSub} type='string' 
                                        placeholder={'Enter Sub category'} 
                                        onChange={setTemp}
                                    />
                                    <div className={`${subCategory && 'hidden'} p-3 bg-gray-200 dark:bg-light-dark rounded-xl`}
                                    onClick={()=>{
                                        setSubCategory(tempSub)
                                        
                                    }}>
                                        <IoCheckmark/>
                                    </div>
                                    <div className='p-3 bg-gray-200 dark:bg-light-dark rounded-xl'
                                        onClick={()=>{
                                            setAddSubCategory(!isAddSubCategory);
                                            setSubCategory('');
                                            setTemp('');
                                            }}>
                                        <IoCloseOutline/>
                                    </div>
                                </div>
                            </>    
                        }
                    </div>

                    <div className='py-2'>
                        <strong>Typical title use</strong>
                        <div className=' p-1 flex flex-wrap gap-2'>
                            <div className=' p-1 flex flex-wrap gap-2'>
                                {
                                uniqueTitle?.map((item: string, index)=>{
                                    return(
                                        <div key={index} 
                                            className={`
                                                    ${title === item && '!bg-yellow-500 text-dark font-semibold' }
                                                    py-2 px-4 rounded-xl bg-gray-200 dark:bg-light-dark w-fit cursor-pointer`}
                                            onClick={()=> setTitle(item === title ? '' : item)}>
                                            {item}
                                        </div>
                                    )
                                })
                                }
                                <div className={`${(title || isAddTitle) && 'hidden'} py-2 px-4 rounded-xl bg-gray-200 dark:bg-light-dark w-fit cursor-pointer`}
                                    onClick={()=>setAddTitle(!isAddTitle)}>
                                    +
                                </div>  
                            </div>
                        </div>
                    
                    {
                    isAddTitle && 
                    <>
                        { !title && <span className='text-yellow-200'>unsave</span>}
                        <div className='flex gap-1 items-center'>
                            
                            <CustomInput 
                                disabled = {!!title }
                                value={tempTitle} type='string' 
                                placeholder={'Enter Sub category'} 
                                onChange={setTempTitle}
                            />
                            <div className={`${title && 'hidden'} p-3 bg-gray-200 dark:bg-light-dark rounded-xl`}
                            onClick={()=>{
                                setTitle(tempTitle)
                                
                            }}>
                                <IoCheckmark/>
                            </div>
                            <div className='p-3 bg-gray-200 dark:bg-light-dark rounded-xl'
                                onClick={()=>{
                                    setAddTitle(!isAddTitle);
                                    setTitle('');
                                    setTempTitle('');
                                    }}>
                                <IoCloseOutline/>
                            </div>
                        </div> 
                    </>
                    }
                </div>
                </div>
                <div className='flex flex-col w-full lg:max-w-2/5 py-4 lg:dark:bg-medium-dark rounded-2xl'>
                    <div className='mx-auto'>
                        {/* <CustomDropdown 
                            options={currentAccount?.map((i: string)=>i)}
                            onChange={(e)=>setModeOfpPayment(e)}
                            isActive={true}
                            initial='Mode of payment'
                        /> */}
                        <Link to={'/account list'} state={{backgroundLocation: location, account: account}}>
                            <div className='py-2 px-4 border border-gray-300 rounded-xl'>{ modeOfPayment ?? 'Mode of payment '}</div>
                        </Link>
                        
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
                            spinner = {saveLoading}
                            disabled={btnDisable}
                        />
                    </div>
                </div>
            </div>
        </PageWrapper>

  )
}

export default AddItemForm