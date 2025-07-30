import React,{ useEffect,useState } from "react";
import useDocumentTitle from "@/hooks/document/useDocTitle";
import SpentHistory from "@/components/dashboard/spentHistory/SpentHistory";
import AddItem from "@/components/dashboard/addItem/AddItem";
import { useSpendings } from "@/store/useSpendingStore";
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding";
import OverViewPage from "@/components/dashboard/OverView";
import { FormatDate } from "@/utils/DateFormat";
import CustomModal from "@/components/modal/CustomModal";
import SpentSummary from "@/components/dashboard/SpentSummary";
// import { itemTypes } from "@/types/itemTypes";
// import supabase from "@/lib/supabase";
const OverView = () => {
const {handleFetchAllSpendings} = useFetchAllSpending();
const {setSpendItems,spendings} = useSpendings();
const [addItemModal, setAddItemModal] = useState<boolean>(false);

 useEffect(()=>{

    const fetch = async ()=>{
      const res = await handleFetchAllSpendings(
          FormatDate(new Date())
        );
        if(res){
          setSpendItems?.(res);
        }
    }

    //prevent "handleFetchAllSpendings" to re-fetch if speding is not null or empty
    //use for SpentCalendar when user select a date, "setSpendItems" wont change
    if(!spendings){
      fetch();
    }
  
  },[])


// useEffect(()=>{
//   setAddItemModal(false)
// },[])
//use for fetching overall total spendings
// useEffect(()=>{
//     const fetchTotal = async ()=>{
//       const {data, error} = await supabase
//           .from('items')
//           .select('*')
//           .eq('owner', user?.id);
//       if(error) console.log(error);
//        const total = data?.reduce((sum: number, item: itemTypes) => sum + Number(item.price), 0);
//        setTotalSpent(total)
//     }
//   fetchTotal();
//   },[spendings])

  useDocumentTitle('Dashboard - Overview | Finance Management');

  return (
    <>
    <div className="max-w-7xl mx-auto lg:flex py-5 px-4">
        <div className=" w-full lg:max-w-2/3 mx-auto">
            <section className="border border-gray-300 rounded-xl px-4 py-4 ">
                <OverViewPage/>
            </section>

            <div className="p-4 border-b border-slate-300">
                <button 
                    className="px-4 py-2 bg-slate-100 rounded-lg cursor-pointer"
                    onClick={()=>setAddItemModal(!addItemModal)}>
                      Add Item
                </button>
            </div>

            <section className="w-full border rounded-xl px-4 my-4 border-gray-300">
                <SpentHistory/>
            </section>
        </div>
    <div className="w-full lg:px-4 lg:max-w-1/3">
        <div className="border border-gray-300  p-4 rounded-xl ">
            <strong className="custom-black">Spent summary</strong>
            <SpentSummary/>
        </div>
    </div>
         <CustomModal
              hidden={addItemModal} 
              onClick={()=>setAddItemModal(!addItemModal)}
          >
              <AddItem/>
          </CustomModal>  
    </div>
    </>
  );
};

export default React.memo(OverView);
