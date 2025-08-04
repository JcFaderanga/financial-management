import SpentCalendar from '@/components/dashboard/SpentCalendar'
import useDocumentTitle from '@/hooks/document/useDocTitle';
const SpendingAnalysis = () => {

    useDocumentTitle('Dashboard - Spent analysis | Finance Management');
  return (
    <div className='mx-auto max-w-7xl'>
        <SpentCalendar/>
    </div>
  )
}

export default SpendingAnalysis