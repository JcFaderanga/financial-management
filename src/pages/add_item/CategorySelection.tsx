import {useState, useCallback} from 'react'
import OverviewDate from '@/hooks/OverviewDate'
import { itemCategory,CategoryIcon} from '@/utils/DropDownList'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '@/wrapper/PageWrapper'

const AddItem = () => {
const [category, setCategory] = useState<string | null>('');
const [isInputDisabled, setIsInputsDisabled] = useState<boolean>(true);
const {dateRange} = OverviewDate();
const navigate = useNavigate();


//for options in dropdown
const menu = useCallback( (val: string) =>{
  setIsInputsDisabled(false);
  setCategory(val);
  navigate(`/add/form/${val}`)
},[isInputDisabled , category])

  return (
    <PageWrapper>
      <section className=''>
        <header className={` flex justify-between item-center p-4 cursor-pointer`}>
            <strong className=' text-dark dark:text-white'>
              <span>{dateRange}</span>
            </strong> 
            <span className="dark:text-white" onClick={()=>navigate(-1)}>back</span>
        </header>

        <div className='lg:flex max-w-7xl mx-auto'>
            <div className="grid grid-cols-3 h-fit gap-2 p-4 w-full lg:w-1/2 cursor-pointer mx-auto">
                {
                  itemCategory?.map((item:any)=>{
                      return(
                          <span key={item} className={`
                                  text-center border border-gray-300 rounded-xl p-2 cursor-pointers
                                  dark:border-none dark:bg-light-dark dark:hover:bg-amber-500 dark:hover:text-light-dark dark:text-white
                                  ${category === item && '!bg-amber-500 dark:!text-light-dark' }
                                  `}
                              onClick={()=>menu(item  === category ? '' : item)}
                              >
                              <div className='flex justify-center text-2xl'>{CategoryIcon[item]}</div>
                              <p className='text-xs'>{item}</p>
                          </span>
                      )
                  })
                }
            </div>
            
        </div>
    </section>
  </PageWrapper>
  )
}

export default AddItem