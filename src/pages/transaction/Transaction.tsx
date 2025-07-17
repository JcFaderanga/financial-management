import useDocumentTitle from '@/hooks/document/useDocTitle'

const Transaction = () => {
  useDocumentTitle('Transaction | Finance Management')
  return (
    <div>
      <section className='p-4'>
            <div className=' py-2 flex justify-between items-center'>
              <div className=''>
                  <input type="checkbox"/>
                  <span className='px-2'><span className='text-slate-600'>[Staycation]</span> Azure Staycation</span>
              </div>
              {/* <div className='pl-6'>
                <FaAngleDown className=''/>
              </div> */}
            </div>
            <div className=' py-2 flex justify-between items-center'>
              <div className=''>
                  <input type="checkbox"/>
                  <span className='px-2'><span className='text-slate-600'>[Shopping]</span>Savemore</span>
              </div>
              {/* <div className='pl-6'>
                <FaAngleDown className=''/>
              </div> */}
            </div>
            <button className='w-full py-1 rounded cursor-pointer bg-slate-200'>Okay</button>
            <div className=' border p-2 border-slate-300 rounded'>
              <div className='py-1 flex justify-between'>
                <strong>Room</strong><span>$1,500</span>
              </div>
              <div className='py-1 flex justify-between'>
                <strong>Food</strong><span>$500</span>
              </div>
              <div className='py-1 flex justify-between'>
                <strong>Room</strong><span>$1,500</span>
              </div>
            </div>
      </section>
    </div>
  )
}

export default Transaction
