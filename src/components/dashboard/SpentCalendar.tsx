import { useEffect, useState } from 'react'
import { useSpendings } from '@/store/useSpendingStore'
import supabase from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io"
import { itemTypes } from '@/types/itemTypes'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { ClipLoader } from 'react-spinners';
const SpentCalendar = () => {
  const { spendings } = useSpendings()
  const { user } = useUserStore()
  const [spendingData, setSpendingData] = useState<Record<string, number>>({})
  const [allTotal, setAllTotal] = useState<number>(0)
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0)
  const [currentMonth, setCurrentMonth] = useState<string | Date>(new Date())
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    
    const fetchTotal = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('created_at, price')
        .eq('owner', user?.id)

      if (error) {
        console.error('Error fetching:', error)
        return
      }

      //Calc overall total spent
      const total = data?.reduce((sum: number, item: itemTypes) => sum + Number(item.price), 0);
       setAllTotal(total)

      const totalsByDate: Record<string, number> = {}
      let monthTotal = 0

      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(currentMonth)

      data?.forEach((item) => {
        const dateOnly = item.created_at.split('T')[0]
        const date = new Date(dateOnly)

        if (date >= monthStart && date <= monthEnd) {
          if (!totalsByDate[dateOnly]) totalsByDate[dateOnly] = 0
          totalsByDate[dateOnly] += item.price
          monthTotal += item.price
        }
      })

      setLoading(false);
      setSpendingData(totalsByDate)
      setMonthlyTotal(monthTotal)
    }

    fetchTotal()
  }, [spendings, user?.id, currentMonth])

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const monthStartDay = getDay(startOfMonth(currentMonth))
  const daysWithOffset = Array(monthStartDay).fill(null).concat(days)

  const handlePrev = () => setCurrentMonth((prev) => subMonths(prev, 1))
  const handleNext = () => setCurrentMonth((prev) => addMonths(prev, 1))

  return (
    <div className='p-4 lg:flex '>
      <div className=" w-full lg:max-w-2/3">
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

        <div className="grid grid-cols-7 gap-2 mt-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, index) => (
            <div
              key={index}
              className="text-sm text-center font-semibold border border-gray-300 rounded py-1"
            >
              {d}
            </div>
          ))}
        </div>
        {
          loading 
          ?   <div className=' w-full flex justify-center py-10'>
                  <ClipLoader color="#000000" size={30} />
              </div>
          :   <div className="grid grid-cols-7 gap-2 mt-4">
                  {daysWithOffset.map((date, idx) => {
                      const dateKey = date ? format(date, 'yyyy-MM-dd') : null
                      const amount = dateKey && spendingData[dateKey]
                      return (
                        <div
                          key={idx}
                          className={`
                            h-12 md:h-24 rounded md:border text-center
                            ${amount ? 'border-[#eb4b6d] !bg-[rgba(255,201,201,0.03)]' : 'border-gray-300'}
                            flex flex-col justify-between p-1 text-sm 
                            ${date ? 'bg-white' : 'bg-transparent border-none'}
                          `}
                        >
                          <div className="font-bold text-sm md:text-right">
                            {date ? format(date, 'd') : ''}
                          </div>
                          {amount && (
                            <div className="text-[#eb4b6d] font-semibold py-1 text-[10px] md:text-sm">
                              -<span className='hidden md:inline-block'>₱</span>{String(amount.toLocaleString())}
                            </div>
                          )}
                          <div className='h-5 hidden md:block'></div>
                        </div>
                      )
                  })}
            </div>
        }
      </div>
          <div className="font-semibold lg:pt-11 text-sm lg:w-2/6 text-gray-600 mt-1">
              <div className='border border-gray-300 px-4 py-7 lg:ml-4 rounded custom-black mb-4'>
                  Total this month
                  <div className="text-[#eb4b6d] text-2xl font-bold">₱{monthlyTotal.toLocaleString()}</div>
              </div>
              <div className='border border-gray-300 px-4 py-7 lg:ml-4 rounded custom-black mb-4'>
                    Over all total
                  <div className="text-[#eb4b6d] text-2xl font-bold">₱{allTotal.toLocaleString()}</div>
              </div>
          </div>
    </div>
  )
}

export default SpentCalendar
