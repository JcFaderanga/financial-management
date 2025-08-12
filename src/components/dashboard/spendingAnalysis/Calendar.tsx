import { useEffect, useState, useCallback } from 'react'
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io"

import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding"
import { FormatDate } from '@/utils/DateFormat'
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
import { motion, AnimatePresence } from 'framer-motion'
import { useOverviewDateStore } from '@/store/useOverviewDate'
import { TotalPerDayAndMonth } from '@/utils/itemFormat'
import { useAllSpendingData } from '@/store/useSpendingStore'
import { useThisMonth } from '@/store/useCalendarStore'
import { useFetchLoader } from '@/store/useSpendingStore'
import CalendarSkeleton from './CalendarSkeleton'
import millify from 'millify'
const Calendar = () => {
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const {allSpentData: data} = useAllSpendingData();
  const {isLoading} = useFetchLoader();
  const { setSpendItems } = useSpendings()
  const [spendingData, setSpendingData] = useState<Record<string, number>>({})
  const {currentMonth, setCurrentMonth} = useThisMonth();
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const {setDate: setStoreDate} = useOverviewDateStore()
  const navigate = useNavigate()

  const date = new Date();
  const start = startOfMonth(date);
  const format1 = format(date,'MMMM-yyyy-dd');
  const getDay1 = getDay(date);

  useEffect(()=>{
    console.log('start',start)
  console.log('format1',format1)
  console.log('getDay1',getDay1)
  },[])
  


  // console.log(JSON.stringify(spendingData,null,2))
  useEffect(() => {
    //Over all total
    const date = new TotalPerDayAndMonth( data, currentMonth );
    setSpendingData(date.getTotalPerDay())

  }, [data, currentMonth])

  const handlePrev = () => {
    setDirection("right")
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNext = () => {
    setDirection("left")
    setCurrentMonth(addMonths(currentMonth, 1))
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

   const setDate = useCallback(async(date: string | {})=>{
    const res = await handleFetchAllSpendings(date)
    setSpendItems(date === 'all' ? data : res || [])
    navigate(`/dashboard/overview`)
  },[handleFetchAllSpendings, setSpendItems, data, navigate])
 
  //handleDateSelect function use to select specific date
  const handleDateSelect = useCallback((date: string)=>{
    setDate(FormatDate(date))
    setStoreDate(FormatDate(date))
  },[setDate, setStoreDate])

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

  // function formatNumberDisplay(num: number, value: string | number) {
  //   const formatted = value.toLocaleString()
  //   return formatted.length > num ? formatted.slice(0, num) + '...' : formatted
  // }

  if(isLoading) return <CalendarSkeleton/>
return(
      <div className='w-full'>
        <div className="flex items-center justify-between mb-1">
          <div className=''>
            <div className='text-sm font-bold text-dark dark:text-white'>Spending calendar</div>
          </div>

          <div className='flex items-center gap-1'>
            <button onClick={handlePrev} className='px-1 border border-gray-300 dark:border-light-dark rounded-md cursor-pointer h-7 dark:text-white'>
              <IoMdArrowDropleft size={20}/>
            </button>
            <div className='cursor-pointer border border-gray-300 dark:border-light-dark flex justify-center items-center gap-0.5 rounded-md h-7 w-30 lg:w-30 font-bold'>
                
                <span className=" text-xs lg:flex dark:text-white">
                  {format(currentMonth, 'MMMM')}
                </span>
                {/* <span className="text-xs lg:hidden dark:text-white">
                  {MonthToNumber(format(currentMonth, 'MMMM'))} /
                </span> */}
                <span className="text-xs dark:text-white">
                  {format(currentMonth, 'yyyy')}
                </span>

            </div>
            <button onClick={handleNext} className='px-1 border border-gray-300 dark:border-light-dark rounded-md cursor-pointer h-7 dark:text-white'>
              <IoMdArrowDropright size={20}/>
            </button>
          </div>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="overflow-hidden md:h-auto"
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentMonth?.toString()}
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
                      flex flex-col justify-between p-1 text-sm hover:!bg-gray-100 dark:hover:!bg-light-dark cursor-pointer
                      ${amount ? ' border-red-300 !bg-red-50 dark:!bg-[#292021]' : 'border-gray-300'}
                      ${date ? 'bg-white dark:bg-medium-dark' : 'bg-transparent border-none'}

                    `}
                  >
                    <div className={`text-sm font-bold md:text-right dark:text-white rounded-xl 
                      ${ dateKey === FormatDate(new Date())&& 'bg-yellow-500 lg:px-2'}`}
                    >
                      { dateKey === FormatDate(new Date())&& <span className='hidden lg:inline p-1 text-xs float-left'>Today</span>}
                      {date ? format(date, 'd') : ''}
                    </div>
                    {amount && (
                      <div className="text-[#eb4b6d] font-semibold py-1 text-[8px] md:text-sm">
                        <span className='hidden md:inline-block'></span>
                        <span className='sm:hidden '>₱{String(millify(amount))}</span>
                        <span className='hidden sm:inline'>₱{millify(amount)}</span>
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
  )
}

export default Calendar
