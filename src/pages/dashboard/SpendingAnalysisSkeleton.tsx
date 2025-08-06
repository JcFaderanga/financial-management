import CalendarSkeleton from '@/components/dashboard/spendingAnalysis/CalendarSkeleton';
import { useRef, useEffect } from 'react';

function useFadeAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    let opacity = 1
    let direction = -0.01

    const animate = () => {
      if (!ref.current) return
      opacity += direction
      if (opacity <= 0.4 || opacity >= 1) direction *= -1
      ref.current.style.opacity = opacity.toString()
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return ref
}

const SpendingAnalysisSkeleton = () => {
  const fadeRef = useFadeAnimation()

  return (
    <div ref={fadeRef} className='mx-auto max-w-7xl px-4'>
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
  )
}

export default SpendingAnalysisSkeleton
