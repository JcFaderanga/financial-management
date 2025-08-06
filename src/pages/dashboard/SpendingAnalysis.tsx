import { useEffect,useState } from 'react';
import SpentCalendar from '@/components/dashboard/spendingAnalysis/SpentCalendar';
//import SpentCalendar from '@/components/dashboard/SpentCalendar';
import useDocumentTitle from '@/hooks/document/useDocTitle';
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding"
import MonthlyChart from '@/components/dashboard/spendingAnalysis/MonthlyChart';
// import BarChart from '@/components/charts/BarChart';
import { useAllSpendingData } from '@/store/useSpendingStore';
import SpendingAnalysisSkeleton from './SpendingAnalysisSkeleton';
const SpendingAnalysis = () => {
  const [isLoading,setLoading]= useState<boolean>(true);
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setAllSpentData } = useAllSpendingData();
    useEffect(() => {

      async function fetchData() {
        const res = await handleFetchAllSpendings();
        setAllSpentData(res)
        setLoading(false)
      }

      fetchData();
    }, [])

    useDocumentTitle('Dashboard - Spent analysis | Finance Management');
 if(isLoading) return <SpendingAnalysisSkeleton/>;
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