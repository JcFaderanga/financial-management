import { useEffect } from "react";
import useDocumentTitle from "@/hooks/document/useDocTitle";
import SpentHistory from "@/components/dashboard/SpentHistory";
import AddItem from "@/components/dashboard/addItem/AddItem";
import { useSpendings } from "@/store/useSpendingStore";
import useFetchAllSpending from "@/hooks/spend_items/useFetchAllSpeding";
import OverView from "@/components/dashboard/OverView";
const Dashboard = () => {
const {handleFetchAllSpendings} = useFetchAllSpending();
const {setSpendItems} = useSpendings();
 useEffect(()=>{
    const fetch = async ()=>{
      const res = await handleFetchAllSpendings();
      setSpendItems(res);
    }
  fetch();
  },[])
  useDocumentTitle('Dashboard | Finance Management');
  
  return (
    <div className="lg:flex w-full">
        <section className="lg:w-2/5  lg:border-r border-gray-300">
            <OverView/>
        </section>
        <section className="w-full box-shadow">
            <div className="">
                <AddItem/>
            </div>
            <div className="w-full ">
                <SpentHistory/>
            </div>
        </section>
    </div>
  );
};

export default Dashboard;
