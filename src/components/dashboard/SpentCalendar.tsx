import { useEffect, useState } from 'react'
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io"
import { FaAngleRight } from "react-icons/fa6"
import { itemTypes } from '@/types/itemTypes'
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
import { ClipLoader } from 'react-spinners'
import { motion, AnimatePresence } from 'framer-motion'

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
    const total = data?.reduce((sum: number, item: itemTypes) => sum + Number(item?.price), 0)
    setAllTotal(total)

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

  async function handleDataSelect(date: string) {
    setLoading(true)
    const res = await handleFetchAllSpendings(FormatDate(date))
    setSpendItems(res || [])
    navigate(`/dashboard/overview`)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className='w-full h-screen flex justify-center py-20'>
        <ClipLoader color="#000000" size={30} />
      </div>
    )
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

  return (
    <div className='p-4 lg:flex'>
      <div className="w-full lg:max-w-2/3">
        <div className="flex lg:justify-between mb-1">
          <div>
            <div className='font-bold text-2xl custom-black'>Spending calendar</div>
          </div>

          <div className='flex items-center'>
            <button onClick={handlePrev} className='pr-1 cursor-pointer'>
              <IoMdArrowDropleft />
            </button>
            <h2 className="text-sm text-center">
              {format(currentMonth, 'MMMM')}
            </h2>
            <button onClick={handleNext} className='pl-1 cursor-pointer'>
              <IoMdArrowDropright />
            </button>
            <h2 className="text-sm text-center">
              {format(currentMonth, 'yyyy')}
            </h2>
          </div>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="overflow-hidden"
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentMonth.toString()}
              custom={direction}
              variants={swipeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="grid grid-cols-7 gap-2 mt-4"
            >
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, index) => (
                <div
                  key={index}
                  className="text-sm text-center font-semibold border border-gray-300 rounded py-1"
                >
                  {d}
                </div>
              ))}
              {daysWithOffset.map((date, idx) => {
                const dateKey = date ? format(date, 'yyyy-MM-dd') : null
                const amount = dateKey && spendingData[dateKey]

                return (
                  <div
                    onClick={() => date && handleDataSelect(date)}
                    key={idx}
                    className={`
                      h-12 md:h-24 rounded md:border text-center overflow-hidden
                      ${amount ? 'border-[#eb4b6d] !bg-[rgba(255,201,201,0.1)]' : 'border-gray-300'}
                      flex flex-col justify-between p-1 text-sm hover:!bg-gray-100 cursor-pointer
                      ${date ? 'bg-white' : 'bg-transparent border-none'}
                    `}
                  >
                    <div className="font-bold text-sm md:text-right ">
                      {date ? format(date, 'd') : ''}
                    </div>
                    {amount && (
                      <div className="text-[#eb4b6d] font-semibold py-1 text-[8px] md:text-sm ">
                        -<span className='hidden md:inline-block'>₱</span>
                        <span className='sm:hidden'>{String(formatNumberDisplay(5, amount))}</span>
                        <span className='hidden sm:inline'>{String(formatNumberDisplay(8, amount))}</span>
                      </div>
                    )}
                    <div className='h-5 hidden md:block'></div>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="font-semibold lg:pt-11 text-sm lg:w-2/6 text-gray-600 mt-1">
        <div className='border border-gray-300 px-4 py-7 lg:ml-4 rounded custom-black mb-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer'>
          <div>
            Total this month
            <div className="text-[#eb4b6d] text-2xl font-bold">-₱{String(monthlyTotal?.toLocaleString())}</div>
          </div>
          <FaAngleRight size={18} />
        </div>
        <div className='border border-gray-300 px-4 py-7 lg:ml-4 rounded custom-black mb-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer'>
          <div>
            Over all total
            <div className="text-[#eb4b6d] text-2xl font-bold">-₱{String(allTotal?.toLocaleString())}</div>
          </div>
          <FaAngleRight size={18} />
        </div>
      </div>
    </div>
  )
}

export default SpentCalendar
