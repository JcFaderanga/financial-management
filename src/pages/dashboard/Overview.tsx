import React, { useEffect, useState } from "react";
import useDocumentTitle from "@/hooks/document/useDocTitle";
import SpentHistory from "@/components/dashboard/spentHistory/SpentHistory";
import AddItem from "@/components/dashboard/addItem/AddItem";
import { useSpendings } from "@/store/useSpendingStore";
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding";
import OverViewPage from "@/components/dashboard/OverView";
import { FormatDate } from "@/utils/DateFormat";
import CustomModal from "@/components/modal/CustomModal";
import SpentSummary from "@/components/dashboard/SpentSummary";
import OverviewDate from "@/hooks/OverviewDate";
import { FormattedUTCDate } from "@/utils/DateFormat";
const OverView = () => {
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setSpendItems, spendings } = useSpendings();
  const [addItemModal, setAddItemModal] = useState<boolean>(false);
  const {dateRange} = OverviewDate();
  useEffect(() => {
    const fetch = async () => {
      const res = await handleFetchAllSpendings(FormatDate(new Date()));
      if (res) {
        setSpendItems?.(res);
      }
    };

    if (!spendings) {
      fetch();
    }
  }, []);

  useDocumentTitle("Dashboard - Overview | Finance Management");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:flex gap-4 min-h-screen">
      {/* Left Column */}
      <div className="w-full lg:w-2/3 space-y-4">
        {/* Sticky Overview Section */}
        <section className=" bg-white border border-gray-300 rounded-xl p-4">
          <OverViewPage />
        </section>

        {/* Add Item Button */}
        {
          FormattedUTCDate(dateRange) !== 'invalid date' &&
          <div>
              <button
                className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                onClick={() => setAddItemModal(!addItemModal)}
              >
                Add Item
              </button>
          </div>
        }
        

        {/* Mobile Summary */}
        <div className="lg:hidden border border-gray-300 p-4 rounded-xl">
          <SpentSummary />
        </div>

        {/* Spend History */}
        <section className="border border-gray-300 rounded-xl p-4">
          <SpentHistory />
        </section>
      </div>

      {/* Right Column (Desktop Only) */}
      <div className="hidden lg:block w-full lg:w-1/3">
        <div className="border border-gray-300 p-4 rounded-xl top-20 z-5 sticky bg-white">
          <SpentSummary />
        </div>
      </div>

      {/* Add Item Modal */}
      <CustomModal hidden={addItemModal} onClick={() => setAddItemModal(!addItemModal)}>
        <AddItem />
      </CustomModal>
    </div>
  );
};

export default React.memo(OverView);
