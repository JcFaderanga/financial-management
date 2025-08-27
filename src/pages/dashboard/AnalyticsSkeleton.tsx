import CalendarSkeleton from '@/components/dashboard/spendingAnalysis/CalendarSkeleton';
import SkeletonAnimationWrapper from '@/wrapper/SkeletonAnimationWrapper';
  
const SpendingAnalysisSkeleton = () => {
  return (
    <SkeletonAnimationWrapper>
      <div  className='mx-auto max-w-7xl px-4'>
        <section className=''>
          <div className='flex py-7'>
            <div className='dark:text-white pb-4'>
              <div className='bg-gray-200 dark:bg-light-dark h-3 w-38 rounded-xl'></div>
              <div className='bg-gray-200 dark:bg-light-dark h-3 w-30 rounded-xl my-2'></div>
            </div>
            <div className=' dark:text-white pb-4 ml-4'>
              <div className='bg-gray-200  dark:bg-light-dark h-3 w-40 rounded-xl'></div>
              <div className='bg-gray-200  dark:bg-light-dark h-3 w-30 rounded-xl my-2'></div>
            </div>
          </div>

          <CalendarSkeleton />
        </section>
        
        <section className='lg:mt-10'>
          <div className='bg-gray-200 dark:bg-light-dark h-3 w-38 rounded-xl mt-4'></div>
        </section>
      </div>
    </SkeletonAnimationWrapper>
  )
}

export default SpendingAnalysisSkeleton
