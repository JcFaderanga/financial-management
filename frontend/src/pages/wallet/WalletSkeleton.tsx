import SkeletonAnimationWrapper from '@/wrapper/SkeletonAnimationWrapper'
const WalletSkeleton = () => {
  return (
    <SkeletonAnimationWrapper>
      <div className=' p-4'>
          <div className='pt-4 pb-5 dark:text-white flex flex-col gap-3 w-full lg:max-w-[305px]'>
            <div className='bg-gray-200 dark:bg-gray-700 h-3 w-3/4 rounded-xl'></div>
            <div className='bg-gray-200 dark:bg-light-dark h-3 w-2/4 rounded-xl'></div>
          </div>

        <div className='flex flex-wrap gap-2'>
          <div className='bg-gray-200 dark:bg-light-dark w-full rounded-xl lg:max-w-[305px]'>
              <div className=' flex flex-col gap-4 w-full px-4 py-4'>
                <div className='flex justify-between'>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-2/7 rounded-xl'></div>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-1/6 rounded-xl'></div>
                </div>
                <div className='bg-gray-300 dark:bg-gray-700 h-3 w-full rounded-xl'></div>
              </div>
          </div>
          <div className='bg-gray-200 dark:bg-light-dark w-full rounded-xl lg:max-w-[305px]'>
              <div className=' flex flex-col gap-4 w-full px-4 py-4'>
                <div className='flex justify-between'>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-2/7 rounded-xl'></div>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-1/6 rounded-xl'></div>
                </div>
                <div className='bg-gray-300 dark:bg-gray-700 h-3 w-full rounded-xl'></div>
              </div>
          </div>
          <div className='bg-gray-200 dark:bg-light-dark w-full rounded-xl lg:max-w-[305px]'>
              <div className=' flex flex-col gap-4 w-full px-4 py-4'>
                <div className='flex justify-between'>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-2/7 rounded-xl'></div>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-1/6 rounded-xl'></div>
                </div>
                <div className='bg-gray-300 dark:bg-gray-700 h-3 w-full rounded-xl'></div>
              </div>
          </div>
          <div className='bg-gray-200 dark:bg-light-dark w-full rounded-xl lg:max-w-[305px]'>
              <div className=' flex flex-col gap-4 w-full px-4 py-4'>
                <div className='flex justify-between'>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-2/7 rounded-xl'></div>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-1/6 rounded-xl'></div>
                </div>
                <div className='bg-gray-300 dark:bg-gray-700 h-3 w-full rounded-xl'></div>
              </div>
          </div>
          <div className='bg-gray-200 dark:bg-light-dark w-full rounded-xl lg:max-w-[305px]'>
              <div className=' flex flex-col gap-4 w-full px-4 py-4'>
                <div className='flex justify-between'>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-2/7 rounded-xl'></div>
                  <div className='bg-gray-300 dark:bg-gray-700 h-3 w-1/6 rounded-xl'></div>
                </div>
                <div className='bg-gray-300 dark:bg-gray-700 h-3 w-full rounded-xl'></div>
              </div>
          </div>
        </div>
        
        
      </div>
      
    </SkeletonAnimationWrapper>
  )
}

export default WalletSkeleton
