import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useSpendings } from '@/store/useSpendingStore'
import supabase from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'

const SpentCalendar = () => {
  const { spendings } = useSpendings()
  const { user } = useUserStore()
  const [spendingData, setSpendingData] = useState<any[]>([])

  useEffect(() => {
    const fetchTotal = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('created_at, price')
        .eq('owner', user?.id)

      if (error) {
        console.error('Error fetching:', error)
        return
      }

      // Group by date and compute totals
      const totalsByDate: Record<string, { date: string; price: number }> = {}

      data?.forEach((item) => {
        const dateOnly = item.created_at.split('T')[0] // e.g., "2025-07-10"
        if (!totalsByDate[dateOnly]) {
          totalsByDate[dateOnly] = { date: item.created_at, price: 0 }
        }
        totalsByDate[dateOnly].price += item.price
      })

      // Convert to array format for FullCalendar
      const formattedEvents = Object.entries(totalsByDate).map(([_, value]) => ({
        title: `₱${value.price}`,
        date: value.date,
        allDay: true,
      }))

      setSpendingData(formattedEvents)
    }

    fetchTotal()
  }, [spendings, user?.id])

  return (
    <div className='px-2 lg:max-w-4/5 mx-auto'>
      <h1 className="text-xl font-semibold mb-4">Spending Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        eventBorderColor="transparent"
         eventContent={(arg) => {
          const amount = String(arg.event.title);
          return (
            <div
              style={{
                    color: '#eb4b6d',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
              -{amount.toLocaleString()}
            </div>
          );
        }}
        events={spendingData}
        height="auto"
      />
    </div>
  )
}

export default SpentCalendar
