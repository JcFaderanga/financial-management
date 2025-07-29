import React,{ useEffect, useState } from "react";
import useDocumentTitle from "@/hooks/document/useDocTitle";
import SpentHistory from "@/components/dashboard/spentHistory/SpentHistory";
import AddItem from "@/components/dashboard/addItem/AddItem";
import { useSpendings } from "@/store/useSpendingStore";
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding";
import OverViewPage from "@/components/dashboard/OverView";
import { FormatDate } from "@/utils/DateFormat";
import CustomModal from "@/components/modal/CustomModal";
// import { itemTypes } from "@/types/itemTypes";
// import supabase from "@/lib/supabase";
//import { useUserStore } from '@/store/useUserStore'
const OverView = () => {
const {handleFetchAllSpendings, data} = useFetchAllSpending();
const {setSpendItems} = useSpendings();
// const [totalSpent, setTotalSpent] = useState<number | string>('')
const [addItemModal, setAddItemModal] = useState<boolean>(false);
//const { user } = useUserStore();
 useEffect(()=>{

  if(data) return;
    const fetch = async ()=>{
      const res = 
        await handleFetchAllSpendings(
          FormatDate(new Date())
        );
      setSpendItems(res);
    }
  fetch();
  },[])


useEffect(()=>{
  setAddItemModal(false)
},[])
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

 

  useDocumentTitle('Dashboard | Finance Management');
  return (
    <div className=" mx-auto">
    <div className="lg:flex w-full border-b border-gray-300 mx-auto">
        <section className="lg:w-2/5  lg:border-r border-gray-300">
            <OverViewPage/>
        </section>
        <section className="w-full box-shadow">
          <div className="p-4 border-b border-slate-300">
            <button 
              className="px-4 py-2 bg-slate-100 rounded-lg cursor-pointer"
              onClick={()=>setAddItemModal(!addItemModal)}>
                Add Item
            </button>
            {/* <button 
              className="px-4 py-2 bg-slate-100 rounded-lg cursor-pointer mx-2"
              onClick={()=>setAddItemModal(!addItemModal)}>
                Grouped Items
            </button> */}
              {/* <h1>Total: {totalSpent}</h1> */}
          </div>
          
            <CustomModal
              hidden={addItemModal} 
              onClick={()=>setAddItemModal(!addItemModal)}
            >
                <AddItem/>
            </CustomModal>
            <div className="w-full ">
                <SpentHistory/>
            </div>
            
        </section>
    </div>
    <div >
    </div>
    
    </div>
  );
};

export default React.memo(OverView);
