import React, { useEffect,useState } from "react";
import useDocumentTitle from "@/hooks/document/useDocTitle";
import SpentHistory from "@/components/dashboard/spentHistory/SpentHistory";
import AddItem from "@/components/dashboard/addItem/AddItem";
import { useSpendings } from "@/store/useSpendingStore";
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding";
import OverViewPage from "@/components/dashboard/OverView";
import {FormattedUTCDate } from "@/utils/DateFormat";
import SpentSummary from "@/components/dashboard/SpentSummary";
import OverviewDate from "@/hooks/OverviewDate";
import { useModal } from "@/store/useModal";
import { ClipLoader } from "react-spinners";
import {format} from "date-fns"
const OverView = () => {
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setSpendItems, spendings } = useSpendings();
  const { dateRange,timeRange } = OverviewDate();
  const {setModal,setChild, isModal} = useModal();
  const [loading, setLoading] = useState<boolean>(false)
  console.log(dateRange)
  useEffect(() => {
    
    const fetch = async () => {
      setLoading(true);
      const res = await handleFetchAllSpendings(format(new Date(),"yyyy-MM-dd"));     //convert date to yyyy-mm-dd, e.g. 2025-08-01
      if (res) {
        setSpendItems?.(res);
      }
      setLoading(false);
    };

    if (!spendings) {
      fetch();
    }
    
  }, []);

  useDocumentTitle("Dashboard - Overview | Finance Management");

  if (loading) {
        return (
          <div className='flex justify-center w-full h-screen py-20 dark:text-white'>
            <span className='dark:hidden'><ClipLoader size={30} /></span>
            <span className='hidden dark:block'><ClipLoader color={'#ffffff'} size={30} /></span>
          </div>
        )
      }
  return (
    <div className="grid gap-4 px-4 lg:py-6 mx-auto transition max-w-7xl lg:grid-cols-3 dark:bg-dark dark:text-white">

      {/* Left Column (spans 2 columns on large screens) */}
      <div className="space-y-4 lg:col-span-2 ">

        {/* Overview Section */}
        <section className="pt-4 sticky top-0 bg-white dark:bg-dark dark:border-medium-dark lg:hidden">
          <OverViewPage />
          <div className="lg:hidden mt-2 py-1 text-center border-t border-gray-300 dark:border-light-dark">
              <p className='text-sm text-gray-400'>{dateRange}</p>
              <p className='text-sm text-gray-400'>{timeRange}</p>
        </div>
        </section>
        

        {/* Add Item Button Desktop only*/}
        {FormattedUTCDate(dateRange) !== "invalid date" && (
          <div className="hidden lg:block border border-gray-300 dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl px-4 py-5.5 ">
            <button
              className="px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-medium-dark dark:text-white"
              onClick={() => {setModal(!isModal); setChild(<AddItem />)}}
            >
              Add Item
            </button>
          </div>
        )}

        {/* Mobile Summary */}
        <div className="hidden p-4 bg-white border border-gray-300 lg:hidden dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl dark:bg-transparent" >
          <SpentSummary />
        </div>

        {/* Spend History */}
        <section className="p-4 bg-white border border-gray-300 dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl dark:bg-transparent">
          <SpentHistory />
        </section>
      </div>

      {/* Right Column (Desktop Only) */} 
      <div className="sticky z-10 self-start hidden lg:block top-20 h-fit">
        <section className="p-4 mb-4 bg-white border border-gray-300 dark:bg-dark dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl ">
          <OverViewPage />
        </section>

        <div className="p-4 bg-white border border-gray-300 dark:bg-dark dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl">
          <SpentSummary />
        </div>
      </div>

      {/* Add Item Modal
      <CustomModal>
        <AddItem />
      </CustomModal> */}
    </div>
  );
};

export default React.memo(OverView);
