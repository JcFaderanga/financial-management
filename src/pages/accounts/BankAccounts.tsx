import useDocumentTitle from '@/hooks/document/useDocTitle'
import React from 'react'

const SummaryCard = ({
  title,
  description,
  value,
  className,
}:{
  title: string,
  description: string,
  value: number | string,
  className: string
})=>{
  return(
    <div className={`w-full text-center border lg:border-r border-gray-300 flex justify-center items-center ${className}`}>
        <div className='w-[80%] py-2'>
          <h1 className='text-xl font-bold'>{title}</h1>
          <p className='text-md text-gray-600'> {description}</p>
          <h2 className='py-2 text-4xl font-bold text-gray-600'>{value}</h2>
        </div>
    </div>
  )
}
const Accounts = () => {
  useDocumentTitle('Accounts - Banks | Finance Management')
  return (
    <section className='w-full h-full'>
      <div className='w-full lg:h-44 grid grid-cols-2 lg:grid-cols-3 border-b border-gray-300'>
        <SummaryCard
          title='Assets'
          description='Total monetary value owned.'
          value={'$2,205.50'}
          className='col-span-2  lg:col-span-1'
        />
        <SummaryCard
          title='Savings'
          description='Reserved funds for future use.'
          value={'$505.50'}
          className='row-start-2 lg:row-start-1'
        />
        <SummaryCard
          title='Dept'
          description=' Total amount of owed.'
          value={'$1'}
          className='row-start-2 lg:row-start-1'
        />
      </div>

       </section>
  )
}

export default Accounts
