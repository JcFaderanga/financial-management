import React, { useEffect, useState } from "react";
import useDocumentTitle from "@/hooks/document/useDocTitle";
import SpentHistory from "@/components/dashboard/spentHistory/SpentHistory";
import AddItem from "@/components/dashboard/addItem/AddItem";
import { useSpendings } from "@/store/useSpendingStore";
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding";
import OverViewPage from "@/components/dashboard/OverView";
import { FormatDate, FormattedUTCDate } from "@/utils/DateFormat";
import CustomModal from "@/components/modal/CustomModal";
import SpentSummary from "@/components/dashboard/SpentSummary";
import OverviewDate from "@/hooks/OverviewDate";

const OverView = () => {
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setSpendItems, spendings } = useSpendings();
  const [addItemModal, setAddItemModal] = useState<boolean>(false);
  const { dateRange } = OverviewDate();

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
    <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-4 min-h-screen">
      {/* Left Column (spans 2 columns on large screens) */}
      <div className="lg:col-span-2 space-y-4">
        {/* Overview Section */}
        <section className="bg-white border border-gray-300 rounded-xl p-4 lg:hidden">
          <OverViewPage />
        </section>

        {/* Add Item Button */}
        {FormattedUTCDate(dateRange) !== "invalid date" && (
          <div className="border border-gray-300 rounded-xl px-4 py-5.5 ">
            <button
              className="px-6 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
              onClick={() => setAddItemModal(!addItemModal)}
            >
              Add Item
            </button>
          </div>
        )}

        {/* Mobile Summary */}
        <div className="lg:hidden border border-gray-300 p-4 rounded-xl bg-white">
          <SpentSummary />
        </div>

        {/* Spend History */}
        <section className="border border-gray-300 rounded-xl p-4 bg-white">
          <SpentHistory />
        </section>
      </div>

      {/* Right Column (Desktop Only) */}
      <div className="hidden lg:block sticky top-20 h-fit self-start z-10">
        <section className="bg-white border border-gray-300 rounded-xl p-4 mb-4 ">
          <OverViewPage />
        </section>

        <div className="border border-gray-300 p-4 rounded-xl bg-white">
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
