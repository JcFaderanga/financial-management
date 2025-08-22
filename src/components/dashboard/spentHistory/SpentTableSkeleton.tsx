import React from 'react';
import SkeletonAnimationWrapper from '@/wrapper/SkeletonAnimationWrapper';
const SpentTable = () => {

  return (
    <SkeletonAnimationWrapper>
        <div className='flex items-center py-2'>
            <div className='bg-gray-200 dark:bg-medium-dark h-10 w-12 mr-2 rounded-lg'></div>
            <div className='dark:text-white flex flex-col gap-2 w-full'>
              <div className='bg-gray-200 dark:bg-medium-dark h-3 w-3/4 rounded-xl'></div>
              <div className='bg-gray-200 dark:bg-medium-dark h-3 w-1/5 rounded-xl'></div>
            </div>
        </div>
        <div className='flex items-center py-2'>
            <div className='bg-gray-200 dark:bg-medium-dark h-10 w-12 mr-2 rounded-lg'></div>
            <div className='dark:text-white flex flex-col gap-2 w-full'>
              <div className='bg-gray-200 dark:bg-medium-dark h-3 w-2/5 rounded-xl'></div>
              <div className='bg-gray-200 dark:bg-medium-dark h-3 w-1/4 rounded-xl'></div>
            </div>
        </div>
        <div className='flex items-center py-2'>
            <div className='bg-gray-200 dark:bg-medium-dark h-10 w-12 mr-2 rounded-lg'></div>
            <div className='dark:text-white flex flex-col gap-2 w-full'>
              <div className='bg-gray-200 dark:bg-medium-dark h-3 w-3/6 rounded-xl'></div>
              <div className='bg-gray-200 dark:bg-medium-dark h-3 w-2/12 rounded-xl'></div>
            </div>
        </div>
        <div className='flex items-center py-2'>
            <div className='bg-gray-200 dark:bg-medium-dark h-10 w-12 mr-2 rounded-lg'></div>
            <div className='dark:text-white flex flex-col gap-2 w-full'>
              <div className='bg-gray-200 dark:bg-medium-dark h-3 w-3/4 rounded-xl'></div>
              <div className='bg-gray-200 dark:bg-medium-dark h-3 w-30 rounded-xl'></div>
            </div>
        </div>
        
        
    </SkeletonAnimationWrapper>
  );
};

export default React.memo(SpentTable);
