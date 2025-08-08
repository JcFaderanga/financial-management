import { useEffect, useState, useCallback } from 'react'
import { FaAngleRight } from "react-icons/fa6"
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding"
import { FormatDate } from '@/utils/DateFormat'
import { useNavigate } from 'react-router-dom'
import { useSpendings } from '@/store/useSpendingStore'
import {
  startOfMonth,
  endOfMonth,
} from 'date-fns'
import DoughnutChart from "../../charts/Doughnut";
import { useOverviewDateStore } from '@/store/useOverviewDate'
import NumberFlowUI from '../../UI/NumberFlow'
import { CalulateTotal,TotalPerDayAndMonth } from '@/utils/itemFormat'
import { useAllSpendingData } from '@/store/useSpendingStore'
import Calendar from './Calendar'
import { useFetchLoader } from '@/store/useSpendingStore'
import { useThisMonth } from '@/store/useCalendarStore'
const SpentCalendar = () => {
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const {allSpentData: data} = useAllSpendingData();
  const { setSpendItems } = useSpendings()
  const [allTotal, setAllTotal] = useState<number>(0)
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0)
  const {currentMonth} = useThisMonth();
  const [averageDaily, SetAverageDaily] = useState<number>(0)
  const {setDate: setStoreDate} = useOverviewDateStore()
  const navigate = useNavigate()
 
  // console.log(JSON.stringify(spendingData,null,2))
  useEffect(() => {
    //Over all total
    const date = new TotalPerDayAndMonth( data, currentMonth );

    setMonthlyTotal(date.getTotalPerMonth())
    SetAverageDaily(date.getDailySpentAverage())

  }, [data, currentMonth])

  useEffect(() => {
  const total = CalulateTotal(data)
  setAllTotal(total)
}, [data])


   const setDate = useCallback(async(date: string | {})=>{

    const res = await handleFetchAllSpendings(date)
    setSpendItems(date === 'all' ? data : res || [])
    navigate(`/dashboard/overview`)
  },[handleFetchAllSpendings, setSpendItems, data, navigate])
 
  //handleMonthSelect function use to select current month data
  const handleMonthSelect = useCallback(()=>{
    const monthStart = FormatDate(startOfMonth(currentMonth))
    const monthEnd = FormatDate(endOfMonth(currentMonth))

    let date_range = {
        startDate: monthStart,
        endDate: monthEnd,
    }

    setStoreDate(date_range)
    setDate(date_range)
  },[currentMonth])

  //handleSelectAll function use to select all data
  const handleSelectAll = useCallback(()=>{

    //first item in the array is the most reccent or last item
    //data[0] select first index(most reccent or latest item inserted to DB)
    const lastItem= data[0];

    //last item in the array is the first item
    //data[data.length - 1] select last index(very first item inserted to DB)
    const firstItem= data[data.length - 1];

    //select created_at col to get item date timestamp
    //only need for displaying first and last date
    setStoreDate({
        startDate: firstItem.created_at,
        endDate:  lastItem.created_at,
    })

    //passing string arguments for conditional logic inside setDate
    //all means getting all data from DB
    setDate('all');
  },[]);


return(
    <div className='pt-4 transition lg:flex dark:bg-dark'>
      <div
          onClick={()=>handleMonthSelect()}
          className='flex items-center justify-between pb-5 mb-4 border-b border-gray-200 dark:border-light-dark cursor-pointer lg:ml-4 lg:hidden custom-black hover:bg-gray-50'>
          <div>
            <strong className='text-sm dark:text-white'>Total this month</strong>
            <div className="text-[#eb4b6d] text-2xl font-bold">
              <NumberFlowUI
                  value={monthlyTotal}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
          <div className='dark:text-white'>
            <strong className='text-sm dark:text-white'>Daily Spent Average</strong>
            <div className="text-[#eb4b6d] text-2xl font-bold">
              <NumberFlowUI
                  value={averageDaily}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
          <div className='dark:text-white'>
            <FaAngleRight size={18} />
          </div>
      </div>
      <div className='w-full lg:max-w-2/3'>
          <Calendar/>
      </div>
      
      <div className="mt-1 text-sm font-semibold text-gray-600 lg:pt-11 lg:w-2/6">
        <div
          onClick={()=>handleMonthSelect()} 
          className='border dark:border-none border-gray-300 px-4 py-7 lg:ml-4 rounded-xl custom-black mb-4 hidden lg:flex dark:bg-medium-dark
          justify-between items-center hover:bg-gray-50 dark:hover:!bg-light-dark cursor-pointer '>
          <div className='dark:text-white'>
            Total this month
            <div className="text-[#eb4b6d] text-2xl font-bold">
              <NumberFlowUI
                  value={monthlyTotal}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
          <div className='dark:text-white'>
            Daily Spent Average
            <div className="text-[#eb4b6d] text-2xl font-bold">
              <NumberFlowUI
                  value={averageDaily}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
          <div className='dark:text-white'>
            <FaAngleRight size={18} />
          </div>
        </div>

        <div className='transition border-t border-gray-300 lg:ml-4 lg:border lg:rounded-xl dark:border-none dark:lg:bg-medium-dark'>
          <div 
            onClick={()=> handleSelectAll()}
            className=' px-4 py-4 custom-black flex justify-between items-center hover:bg-gray-50 dark:hover:!bg-light-dark cursor-pointer'>
            <div className='dark:text-white'>
              Over all total
              <div className="text-[#eb4b6d] text-2xl font-bold">
                <NumberFlowUI
                  value={allTotal}
                  currency='PHP'
                  style='currency'
                />
              </div>
            </div>
            <div className='dark:text-white'>
            <FaAngleRight size={18} />
          </div>
          </div>

          {
            data && data.length !== 0 && 
            <div className='flex justify-center pt-4 pb-10 max-h-2/3'> 
                <DoughnutChart data={data} />
            </div>
        
          }
          
        </div>

        
      </div>
    </div>
  )
}

export default SpentCalendar
