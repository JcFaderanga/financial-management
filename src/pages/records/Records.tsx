import React from "react";
import useDocumentTitle from "@/hooks/document/useDocTitle";
import SpentHistory from "@/components/mainPages/spentHistory/SpentHistory";
import ExpensesTotal from "@/components/mainPages/ExpensesTotal";
import {FormattedUTCDate } from "@/utils/DateFormat";
import SpentSummary from "@/components/mainPages/SpentSummary";
import OverviewDate from "@/hooks/OverviewDate";

import { Link  } from "react-router-dom";
const OverView = () => {
  
  const { dateRange,timeRange } = OverviewDate();

  useDocumentTitle("Records | Finance Management");

  return (
    <div className="grid gap-4 px-4 lg:py-6 transition lg:grid-cols-3 dark:bg-dark dark:text-white overflow-hidden lg:overflow-clip">

      {/* Left Column (spans 2 columns on large screens) */}
      <div className="space-y-4 lg:col-span-2 ">

        {/* Overview Section */}
        <section className="pt-4 sticky top-0 bg-white dark:bg-dark dark:border-medium-dark lg:hidden">
          <ExpensesTotal />
          <div className={`${dateRange.includes('-') ? 'block' : 'hidden'} lg:hidden mt-2 py-1 text-center border-t border-gray-300 dark:border-light-dark`}>
              <p className='text-sm text-gray-400'>{dateRange}</p>
              <p className='text-sm text-gray-400'>{timeRange}</p>
        </div>
        </section>
        

        {/* Add Item Button Desktop only*/}
          <div className="hidden lg:block border border-gray-300 dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl px-4 py-5.5 ">

              <Link to={`/add/category`}>
                <button
                  className={`
                    ${FormattedUTCDate(dateRange) == "invalid date" && 'hidden'}
                    px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:hover:bg-light-dark cursor-pointer dark:bg-dark dark:text-white`}
                    >
                    Add Item
                </button>
              </Link>
            
            
            <button className="px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:hover:bg-light-dark cursor-pointer dark:bg-dark dark:text-white mx-1">
              Today
            </button>

            <button className="px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:hover:bg-light-dark cursor-pointer dark:bg-dark dark:text-white mx-1">
              7 Days
            </button>

            <button className="px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:hover:bg-light-dark cursor-pointer dark:bg-dark dark:text-white mx-1">
              30 Days
            </button>

            <button className="px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:hover:bg-light-dark cursor-pointer dark:bg-dark dark:text-white mx-1">
              60 Days
            </button>
          </div>

        {/* Mobile Summary */}
        <div className="hidden p-4 bg-white border border-gray-300 lg:hidden dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl dark:bg-transparent" >
          <SpentSummary />
        </div>

        {/* Spend History */}
        <section className="lg:px-4 bg-white lg:border border-gray-300 dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl dark:bg-transparent">
          <SpentHistory />
        </section>
      </div>

      {/* Right Column (Desktop Only) */} 
      <div className="sticky z-10 self-start hidden lg:block top-20 h-fit">
        <section className="p-4 mb-4 bg-white border border-gray-300 dark:bg-dark dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl ">
          <ExpensesTotal />
        </section>

        <div className="p-4 bg-white border border-gray-300 dark:bg-dark dark:border-medium-dark dark:lg:bg-medium-dark rounded-xl">
          <SpentSummary />
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverView);
