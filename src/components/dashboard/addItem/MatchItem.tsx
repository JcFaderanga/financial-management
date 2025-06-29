import React,{useState} from 'react'
import { ItemTypes } from '@/types/NavigationTypes';
const ITEMS_PER_PAGE = 4;
const MatchItem = ({
  current,
  getSelectedItemId
}:{
  current: any;
  getSelectedItemId: (item: any) => void;
}) => {
const [page, setPage] = useState(1);
  const totalPages = Math.ceil((current?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = current?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));


  return (
   <>
      {currentItems?.map((item: any) => (
        <div onClick={() => getSelectedItemId(item)} key={item.id}>
            <ul className="w-full lg:max-w-[80%] flex justify-between border border-gray-100 bg-gray-50 rounded-xl py-2 px-3 my-2  mx-auto">
              <li>{item.title}</li>
              <li>₱{item.price}</li>
            </ul>
        </div>
      ))}

        {/* Pagination Controls */}
        <div className=" w-full max-w-[80%] flex justify-center items-center gap-2 mt-4 mx-auto ">
            <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
            Prev
            </button>
            <span>
                Page {page} of {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
            Next
            </button>
        </div>
  </>
  )
}

export default MatchItem