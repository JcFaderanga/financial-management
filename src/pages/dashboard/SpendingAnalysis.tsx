import { useEffect,useState } from 'react';
import SpentCalendar from '@/components/dashboard/spendingAnalysis/SpentCalendar';
//import SpentCalendar from '@/components/dashboard/SpentCalendar';
import useDocumentTitle from '@/hooks/document/useDocTitle';
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding"
import MonthlyChart from '@/components/dashboard/spendingAnalysis/MonthlyChart';
// import BarChart from '@/components/charts/BarChart';
import { useAllSpendingData } from '@/store/useSpendingStore';
import { ClipLoader } from 'react-spinners'
const SpendingAnalysis = () => {
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setAllSpentData } = useAllSpendingData();
  const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

      async function fetchData() {
        setLoading(true)
        const res = await handleFetchAllSpendings();
        setAllSpentData(res)
        setLoading(false)
      }

      fetchData();
    }, [])

    useDocumentTitle('Dashboard - Spent analysis | Finance Management');

    if (loading) {
        return (
          <div className='flex justify-center w-full h-screen py-20 dark:text-white'>
            <span className='dark:hidden'><ClipLoader size={30} /></span>
            <span className='hidden dark:block'><ClipLoader color={'#ffffff'} size={30} /></span>
          </div>
        )
      }
  return (
    <div className='mx-auto max-w-7xl px-4 pb-20'>
      
      <section className=''>
          <SpentCalendar/>
      </section>  
      <section className='lg:mt-10'>
         <strong className="dark:text-white">
              Spending Analysis
          </strong>
          <MonthlyChart/>
      </section>
    </div>
  )
}

export default SpendingAnalysis