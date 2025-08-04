import { useEffect, useState } from 'react'
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io"
import { FaAngleRight } from "react-icons/fa6"
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding"
import { FormatDate, MonthToNumber } from '@/utils/DateFormat'
import { useNavigate } from 'react-router-dom'
import { useSpendings } from '@/store/useSpendingStore'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { ClipLoader } from 'react-spinners'
import { motion, AnimatePresence } from 'framer-motion'
import DoughnutChart from "../charts/Doughnut";
import { useOverviewDateStore } from '@/store/useOverviewDate'
import NumberFlowUI from '../UI/NumberFlow'
import { CalulateTotal } from '@/utils/itemFormat'
const SpentCalendar = () => {
  const { data, handleFetchAllSpendings } = useFetchAllSpending()
  const { setSpendItems } = useSpendings()
  const [spendingData, setSpendingData] = useState<Record<string, number>>({})
  const [allTotal, setAllTotal] = useState<number>(0)
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const {setDate: setStoreDate} = useOverviewDateStore()
  const navigate = useNavigate()
  useEffect(() => {
    async function _() {
      setLoading(true)
      await handleFetchAllSpendings()
      setLoading(false)
    }
    _()
  }, [])

  useEffect(() => {

    //Over all total
    setAllTotal(CalulateTotal(data))

    const totalsByDate: Record<string, number> = {}
    let monthTotal = 0

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)

    data?.forEach((item: any) => {
      const dateOnly = item.created_at.split('T')[0]
      const date = new Date(dateOnly)

      if (date >= monthStart && date <= monthEnd) {
        if (!totalsByDate[dateOnly]) totalsByDate[dateOnly] = 0
        totalsByDate[dateOnly] += item.price
        monthTotal += item.price
      }
    })

    setSpendingData(totalsByDate)
    setMonthlyTotal(monthTotal)
  }, [data, currentMonth])

  const handlePrev = () => {
    setDirection("right")
    setCurrentMonth((prev) => subMonths(prev, 1))
  }

  const handleNext = () => {
    setDirection("left")
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.changedTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return
    const endX = e.changedTouches[0].clientX
    const diff = touchStartX - endX

    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }

    setTouchStartX(null)
  }

  async function setDate(date: string | {}){
    setLoading(true)
    const res = await handleFetchAllSpendings(date)
    setSpendItems(date === 'all' ? data : res || [])
    navigate(`/dashboard/overview`)
    setTimeout(()=> setLoading(false), 1000)
  }

  //handleDateSelect function use to select specific date
  function handleDateSelect(date: string) {

    setDate(FormatDate(date))
    setStoreDate(FormatDate(date))
  }

  //handleMonthSelect function use to select current month data
  function handleMonthSelect() {
    const monthStart = FormatDate(startOfMonth(currentMonth))
    const monthEnd = FormatDate(endOfMonth(currentMonth))

    let date_range = {
        startDate: monthStart,
        endDate: monthEnd,
    }

    setStoreDate(date_range)
    setDate(date_range)
  }
  
  //handleSelectAll function use to select all data
  function handleSelectAll() {

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
  }


  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const monthStartDay = getDay(startOfMonth(currentMonth))
  const daysWithOffset = Array(monthStartDay).fill(null).concat(days)

  const swipeVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "left" ? 1 : -1,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "left" ? -1 : 1,
      opacity: 0,
    }),
  }

  function formatNumberDisplay(num: number, value: string | number) {
    const formatted = value.toLocaleString()
    return formatted.length > num ? formatted.slice(0, num) + '...' : formatted
  }

  
  if (loading) {
    return (
      <div className='flex justify-center w-full h-screen py-20 dark:text-white'>
        <span className='dark:hidden'><ClipLoader size={30} /></span>
        <span className='hidden dark:block'><ClipLoader color={'#ffffff'} size={30} /></span>
      </div>
    )
  }

  return (
    <div className='p-4 transition lg:flex dark:bg-dark'>
      <div
          onClick={()=>handleMonthSelect()}
          className='flex items-center justify-between pb-5 mb-4 border-b border-gray-200 cursor-pointer lg:ml-4 lg:hidden custom-black hover:bg-gray-50'>
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
            <FaAngleRight size={18} />
          </div>
      </div>
      <div className="w-full lg:max-w-2/3">
        <div className="flex items-center justify-between mb-1">
          <div className=''>
            <div className='text-sm font-bold text-dark dark:text-white'>Spending calendar</div>
          </div>

          <div className='flex items-center gap-1'>
            <button onClick={handlePrev} className='px-1 border border-gray-300 rounded-md cursor-pointer h-7 dark:text-white'>
              <IoMdArrowDropleft size={20}/>
            </button>
            <div className='cursor-pointer border border-gray-300 flex justify-center items-center gap-0.5 rounded-md h-7 w-18 lg:w-30 font-bold'>
                
                <span className="hidden text-xs lg:flex dark:text-white">
                  {format(currentMonth, 'MMMM')}
                </span>
                <span className="text-xs lg:hidden dark:text-white">
                  {MonthToNumber(format(currentMonth, 'MMMM'))} /
                </span>

                <span className="text-xs dark:text-white">
                  {format(currentMonth, 'yyyy')}
                </span>
            </div>
            <button onClick={handleNext} className='px-1 border border-gray-300 rounded-md cursor-pointer h-7 dark:text-white'>
              <IoMdArrowDropright size={20}/>
            </button>
          </div>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="overflow-hidden h-[384px] md:h-auto"
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentMonth.toString()}
              custom={direction}
              variants={swipeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.1 }}
              className="grid grid-cols-7 gap-2 mt-4"
            >
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, index) => (
                <div
                  key={index}
                  className="py-1 text-sm font-semibold text-center border border-gray-300 rounded-lg dark:border-gray-800 dark:text-white dark:bg-medium-dark"
                >
                  {d}
                </div>
              ))}
              {daysWithOffset.map((date, idx) => {
                const dateKey = date ? format(date, 'yyyy-MM-dd') : null
                const amount = dateKey && spendingData[dateKey]

                return (
                  <div
                    onClick={() => date && handleDateSelect(date)}
                    key={idx}
                    className={`
                      h-12 md:h-24 rounded-xl md:border dark:border-none text-center overflow-hidden
                      ${amount ? ' border-red-300 !bg-red-50 dark:!bg-[#292021]' : 'border-gray-300'}
                      flex flex-col justify-between p-1 text-sm hover:!bg-gray-100 dark:hover:!bg-[#414141] cursor-pointer
                      ${date ? 'bg-white dark:bg-medium-dark' : 'bg-transparent border-none'}
                      
                    `}
                  >
                    <div className="text-sm font-bold md:text-right dark:text-white">
                      {date ? format(date, 'd') : ''}
                    </div>
                    {amount && (
                      <div className="text-[#eb4b6d] font-semibold py-1 text-[8px] md:text-sm">
                        -<span className='hidden md:inline-block'>₱</span>
                        <span className='sm:hidden '>{String(formatNumberDisplay(5, amount))}</span>
                        <span className='hidden sm:inline'>{String(formatNumberDisplay(8, amount))}</span>
                      </div>
                    )}
                    <div className='hidden h-5 md:block'></div>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-1 text-sm font-semibold text-gray-600 lg:pt-11 lg:w-2/6">
        <div
          onClick={()=>handleMonthSelect()} 
          className='border dark:border-none border-gray-300 px-4 py-7 lg:ml-4 rounded-xl custom-black mb-4 hidden lg:flex dark:bg-medium-dark
          justify-between items-center hover:bg-gray-50 dark:hover:!bg-[#414141] cursor-pointer '>
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
            <FaAngleRight size={18} />
          </div>
        </div>

        <div className='transition border-t border-gray-300 lg:ml-4 lg:border lg:rounded-xl dark:border-none dark:lg:bg-medium-dark'>
          <div 
            onClick={()=> handleSelectAll()}
            className=' px-4 py-4 custom-black flex justify-between items-center hover:bg-gray-50 dark:hover:!bg-[#414141] cursor-pointer'>
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
