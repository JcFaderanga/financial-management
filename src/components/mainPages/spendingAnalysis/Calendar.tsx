import { useEffect, useState, useCallback } from 'react'
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io"
import { FormatDate, getMonthlyDateRange } from '@/utils/DateFormat'
import { useNavigate } from 'react-router-dom'
import { useSpendingList } from '@/store/useSpendingStore'
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
import { CalendarTotalCalculator, TotalPerDayAndMonth } from '@/utils/itemFormat'
import { useAllSpendingData } from '@/store/useSpendingStore'
import { useThisMonth } from '@/store/useCalendarStore'
import { useFetchLoader } from '@/store/useSpendingStore'
import CalendarSkeleton from './CalendarSkeleton'
import millify from 'millify'
import useTransactionHistory from '@/hooks/accountHooks/useTransactionHistory'

const Calendar = () => {
  const { allSpentData: data } = useAllSpendingData()
  const { isLoading } = useFetchLoader()
  const { transactions, setSpendingTransactionList } = useSpendingList()

  const [spendingData, setSpendingData] = useState<Record<string, number>>({})

  const { currentMonth, setCurrentMonth } = useThisMonth()
  const { setDate: setStoreDate } = useOverviewDateStore()
  const { FetchMonthlyHistory } = useTransactionHistory()

  const navigate = useNavigate()

  const calculate = new CalendarTotalCalculator()
  const dailyTotal = calculate.getDailyTotal(transactions)

  /* ----------------------------------
     EFFECTS
  ---------------------------------- */
  useEffect(() => {
    const date = new TotalPerDayAndMonth(data, currentMonth)
    setSpendingData(date.getTotalPerDay())
  }, [data, currentMonth])

  useEffect(() => {
    async function fetch() {
      const { monthStart, monthEnd } = getMonthlyDateRange(currentMonth)
      const monthlyData = await FetchMonthlyHistory(monthStart, monthEnd)
      setSpendingTransactionList(monthlyData)
    }
    fetch()
  }, [currentMonth])

  /* ----------------------------------
     HANDLERS
  ---------------------------------- */
  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDateSelect = useCallback(
    (date: Date) => {
      const selectedDate = format(date, "yyyy-MM-dd")
      const grouped = calculate.groupByDate(transactions)
      const filtered = grouped.get(selectedDate) ?? []

      setSpendingTransactionList(filtered)
      setStoreDate(selectedDate)
      navigate('/')
    },
    [transactions]
  )

  /* ----------------------------------
     CALENDAR DATA
  ---------------------------------- */
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
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "left" ? -1 : 1,
      opacity: 0,
    }),
  }

  if (isLoading) return <CalendarSkeleton />

  /* ----------------------------------
     RENDER
  ---------------------------------- */
  return (
    <div className='w-full'>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-1">
        <div className='text-sm font-bold text-dark dark:text-white'>
          Spending calendar
        </div>

        <div className='flex items-center gap-1'>
          <button
            onClick={handlePrev}
            className='px-1 border border-gray-300 dark:border-light-dark rounded-md cursor-pointer h-7 dark:text-white'
          >
            <IoMdArrowDropleft size={20} />
          </button>

          <div className='cursor-pointer border border-gray-300 dark:border-light-dark flex justify-center items-center gap-0.5 rounded-md h-7 w-30 font-bold'>
            <span className="text-xs dark:text-white">
              {format(currentMonth, 'MMMM')}
            </span>
            <span className="text-xs dark:text-white">
              {format(currentMonth, 'yyyy')}
            </span>
          </div>

          <button
            onClick={handleNext}
            className='px-1 border border-gray-300 dark:border-light-dark rounded-md cursor-pointer h-7 dark:text-white'
          >
            <IoMdArrowDropright size={20} />
          </button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="overflow-hidden md:h-auto">
        <AnimatePresence custom="left" mode="wait">
          <motion.div
            key={currentMonth.toString()}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.1 }}
            className="grid grid-cols-7 gap-2 mt-4"
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                className="py-1 text-sm font-semibold text-center border border-gray-300 rounded-lg dark:border-gray-800 dark:text-white dark:bg-medium-dark"
              >
                {d}
              </div>
            ))}

            {daysWithOffset.map((date, idx) => {
              const dateKey = date ? format(date, 'yyyy-MM-dd') : ''
              const amount = dateKey ? spendingData[dateKey] : undefined
              const newAmt = dateKey ? dailyTotal?.get(dateKey) : undefined
              const outFlow = newAmt?.outFlow ?? amount ?? 0

              return (
                <div
                  key={idx}
                  onClick={() => date && handleDateSelect(date)}
                  className={`
                    h-12 md:h-24 rounded-xl md:border dark:border-none text-center overflow-hidden
                    flex flex-col justify-between p-1 text-sm hover:!bg-gray-100 dark:hover:!bg-light-dark cursor-pointer
                    ${outFlow > 0 ? 'border-red-300 !bg-red-50 dark:!bg-[#292021]' : 'border-gray-300'}
                    ${date ? 'bg-white dark:bg-medium-dark' : 'bg-transparent border-none'}
                  `}
                >
                  <div
                    className={`text-sm font-bold md:text-right dark:text-white rounded-xl 
                      ${dateKey === FormatDate(new Date()) && 'bg-yellow-500 lg:px-2'}`}
                  >
                    {dateKey === FormatDate(new Date()) && (
                      <span className='hidden lg:inline p-1 text-xs float-left'>
                        Today
                      </span>
                    )}
                    {date ? format(date, 'd') : ''}
                  </div>

                  {/* ✅ FIXED DISPLAY — 0 NOW SHOWS */}
                  {date && (
                    <div className="text-[#eb4b6d] font-semibold py-1 text-[8px] md:text-sm">
                      <span className="sm:hidden">
                       {outFlow === 0 ? '' : `₱${millify(outFlow)}`}
                      </span>
                      <span className="hidden sm:inline">
                        {outFlow === 0 ? '' : `₱${millify(outFlow)}`}
                      </span>
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
