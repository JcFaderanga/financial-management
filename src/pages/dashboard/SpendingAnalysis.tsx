import SpentCalendar from '@/components/dashboard/SpentCalendar'
import useDocumentTitle from '@/hooks/document/useDocTitle';
const SpendingAnalysis = () => {

    useDocumentTitle('Dashboard - Spent analysis | Finance Management');
  return (
    <div className='max-w-7xl mx-auto'>
        <SpentCalendar/>
    </div>
  )
}

export default SpendingAnalysis