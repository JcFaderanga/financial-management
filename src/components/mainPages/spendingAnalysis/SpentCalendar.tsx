import { useEffect, useState, useCallback } from 'react'
import { FaAngleRight } from "react-icons/fa6"
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FormatDate } from '@/utils/DateFormat'
import { useNavigate } from 'react-router-dom'
import { useSpendingList } from '@/store/useSpendingStore'
import {
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns'
import DoughnutChart from "../../charts/Doughnut";
import { useOverviewDateStore } from '@/store/useOverviewDate'
import NumberFlowUI from '../../UI/NumberFlow'
import { CalculateTotal,CalendarTotalCalculator,TotalPerDayAndMonth } from '@/utils/itemFormat'
import { useAllSpendingData } from '@/store/useSpendingStore'
import Calendar from './Calendar'
import { useThisMonth } from '@/store/useCalendarStore'

const SpentCalendar = () => {
  const {setSpendingTransactionList} = useSpendingList();
  const {allSpentData: data} = useAllSpendingData();
  const [allTotal, setAllTotal] = useState<number>(0)
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0)
  const {currentMonth} = useThisMonth();
  const {transactions} = useSpendingList();

  // const [averageDaily, SetAverageDaily] = useState<number>(0)
  const {setDate: setStoreDate} = useOverviewDateStore()
  const navigate = useNavigate()

  useEffect(() => {
    //Over all total
    const date = new TotalPerDayAndMonth( data, currentMonth );

    setMonthlyTotal(date.getTotalPerMonth())
    // SetAverageDaily(date.getDailySpentAverage())

  }, [data, currentMonth])

  useEffect(() => {
  const total = CalculateTotal(data)
  setAllTotal(total)
}, [data])

 
  //handleMonthSelect function use to select current month data
  const handleMonthSelect = useCallback(()=>{
    setSpendingTransactionList(null);
    const monthStart = FormatDate(startOfMonth(currentMonth))
    const monthEnd = FormatDate(endOfMonth(currentMonth))

    let date_range = {
        startDate: monthStart,
        endDate: monthEnd,
    }

    setStoreDate(date_range)
    navigate(`/`)
  },[currentMonth])

  //handleSelectAll function use to select all data
  const handleSelectAll = useCallback(()=>{

    //set null to refresh spending list in records
    setSpendingTransactionList(null);
    
    //first item in the array is the most recent or last item
    //data[0] select first index(most recent or latest item inserted to DB)
    const lastItem= data[0];

    //last item in the array is the first item
    //data[data.length - 1] select last index(very first item inserted to DB)
    const firstItem= data[data.length - 1];

    //select created_at col to get item date timestamp
    //only need for displaying first and last date
    setStoreDate({
        startDate: format(firstItem.created_at, "yyyy-MM-dd"),
        endDate:  format(lastItem.created_at, "yyyy-MM-dd"),
    })

    //passing string arguments for conditional logic inside setDate
    //all means getting all data from DB
    navigate(`/`)
  },[]);

  const calculate = new CalendarTotalCalculator();
  const outFlow = calculate.getMonthlyTotalOutFlow(transactions);

  console.log("transactions", transactions)

  // NOTE: transaction is on reversed decs ex. 100 -> 0 
  // Reversion happened on "useTransactionHistory.tsx" 
  // useTransactionHistory.tsx / FetchDaily() / History.order('created_at', { ascending: false })
  const new_transactions_bal = transactions?.[0]?.transaction_detail?.new_available_balance;
  const prev_transactions_bal = transactions?.[transactions.length - 1]?.transaction_detail?.prev_available_balance;

  const saved = prev_transactions_bal < new_transactions_bal 
      ? new_transactions_bal - prev_transactions_bal
      : 0;

return(
    <div className='pt-4 transition lg:flex dark:bg-dark'>

        <div
          onClick={()=>handleMonthSelect()} 
          className='border dark:border-none border-gray-300 px-4 py-7 lg:ml-4 rounded-xl custom-black mb-4 lg:hidden flex dark:bg-medium-dark
          justify-around items-center hover:bg-gray-50 dark:hover:!bg-light-dark cursor-pointer '>
          <div className='dark:text-white'>
            <div className='flex items-center gap-1'><FaArrowUp className='text-[#eb4b6d]'/> Outflows</div>
            <div className="text-[#eb4b6d] text-lg font-bold flex">
              <NumberFlowUI
                  value={outFlow || 0}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
          <div className='dark:text-white'>
            <div className='flex items-center gap-1'><FaArrowDown className='text-green-500 '/> Saved</div>
            <div className={`${Number(saved)> 0 ? 'text-green-500' : "text-[#eb4b6d]"}  text-lg font-bold`}>
              <NumberFlowUI
                  value={saved || 0}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
        </div>
      <div className='w-full lg:max-w-2/3'>
          <Calendar/>
      </div>
      
      <div className="mt-1 text-sm font-semibold text-gray-600 lg:pt-11 lg:w-2/6">


        <div
          onClick={()=>handleMonthSelect()} 
          className='border dark:border-none border-gray-300 px-4 py-7 lg:ml-4 rounded-xl custom-black mb-4 hidden lg:flex dark:bg-medium-dark
          justify-around items-center hover:bg-gray-50 dark:hover:!bg-light-dark cursor-pointer '>
          <div className='dark:text-white'>
            <div className='flex items-center gap-1'><FaArrowDown className='text-[#eb4b6d] '/>Outflows</div>
            <div className="text-[#eb4b6d] text-lg font-bold flex">
              <NumberFlowUI
                  value={outFlow || 0}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
          <div className='dark:text-white'>
            <div className='flex items-center gap-1'><FaArrowUp className=' text-green-500'/> Saved</div>
            <div className={`${Number(saved)> 0 ? 'text-green-500' : "text-[#eb4b6d]"}  text-lg font-bold`}>
              <NumberFlowUI
                  value={saved || 0}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
        </div>

        <div
          onClick={()=>handleMonthSelect()} 
          className='border dark:border-none border-gray-300 px-4 py-7 lg:ml-4 rounded-xl custom-black mb-4 hidden lg:flex dark:bg-medium-dark
          justify-between items-center hover:bg-gray-50 dark:hover:!bg-light-dark cursor-pointer '>
          <div className='dark:text-white'>
            Total spent this month
            <div className="text-[#eb4b6d] text-2xl font-bold">
              <NumberFlowUI
                  value={monthlyTotal}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div>
          {/* <div className='dark:text-white'>
            Daily Spent Average
            <div className="text-[#eb4b6d] text-2xl font-bold">
              <NumberFlowUI
                  value={averageDaily}
                  currency='PHP'
                  style='currency'
                />
            </div>
          </div> */}
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
