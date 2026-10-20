// import { useState, useEffect } from "react";
// import { useSpendings, useSpendingExcluded } from '@/store/useSpendingStore';
// import { useOverviewTotal } from "@/store/useOverviewTotal";
// import { NoRecord } from "../NoRecord";
// import DoughnutChart from "../charts/Doughnut";
// import { FaAngleUp,FaAngleDown } from "react-icons/fa6";
// import { CategoryAndPrice,CalculateTotal } from "@/utils/itemFormat";
// type GroupedItem = {
//   type: string;
//   price: number;
//   exclude: boolean;
// };

// const SpentSummary = () => {
//   const { spendings } = useSpendings();
//   const { setItemExclude } = useSpendingExcluded();
//   const { setTotal } = useOverviewTotal();
//   const [grouped, setNewGroup] = useState<GroupedItem[] | null>(null);
//   const [allSelected, setAllSelected] = useState<boolean>(true);
//   const [thisCompHidden, setThisCompHidden] = useState<boolean>(false)

//   // Group spendings by category
//   useEffect(() => {

//     // const category_price = GroupByCategoryAndPrice(spendings);
//     const category_price = new CategoryAndPrice(spendings);
//     const newData = category_price.groupToArray();

//     setNewGroup(newData);

//   }, [spendings]);

//   // Update excluded categories for filtering
//   useEffect(() => {
//     const excludedTypes = grouped
//       ?.filter(g => g.exclude)
//       .map(g => g.type);

//     setItemExclude(excludedTypes);
//   }, [grouped]);

//   // Calculate total excluding excluded items
//   useEffect(() => {
//     const totalIncluded = grouped?.reduce((sum, item) => {
//       return item.exclude ? sum : sum + item.price;
//     }, 0) || 0;

//     setTotal(totalIncluded);
//   }, [grouped]);

//   // Toggle exclusion for individual item
//   const updateGroup = (updatedItem: GroupedItem) => {
//     const updatedGrouped = grouped?.map(item =>
//       item.type === updatedItem.type
//         ? { ...item, exclude: !item.exclude }
//         : item
//     );
//     setNewGroup(updatedGrouped || []);
//   };

//   // Toggle select/deselect all
//   const setAll = () => {
//   const nextAllSelected = !allSelected;

//   const updatedGrouped = grouped?.map(item => ({
//     ...item,
//     exclude: nextAllSelected ? false : true, // clearly set instead of toggling
//   }));

//   setAllSelected(nextAllSelected);
//   setNewGroup(updatedGrouped || []);
// };

//   return (
//     <>
//     <div className="flex items-center justify-between">
//         <strong className="text-dark dark:text-white">Spent summary</strong>
//         {
//           thisCompHidden 
//           ? <FaAngleDown 
//               className="cursor-pointer" 
//               onClick={()=>setThisCompHidden(!thisCompHidden)}
//             />
//           : <FaAngleUp 
//               className="cursor-pointer" 
//               onClick={()=>setThisCompHidden(!thisCompHidden)}
//             />
//         }
//       </div>
//     <section className={`${thisCompHidden && 'hidden'}`}>
//       {!grouped || grouped.length === 0 ? (
//         <div className="flex justify-center w-full">
//           <NoRecord />
//         </div>
//       ) : (
//         <>
//           <div className='flex justify-center pt-4 max-h-2/3'> 
//               <DoughnutChart data={spendings} />
//           </div>
//           <div className="px-2 pt-2 text-sm text-gray-500 cursor-pointer" onClick={setAll}>
//             <input
//               type="checkbox"
//               checked={allSelected}
//               readOnly
//               onClick={()=> setAll()}
//             />
//             <i className="px-1">Select all</i>
//           </div>
//         {
//           grouped
//             ?.sort((a, b) => b.price - a.price)
//             .map(item => (
//               <div
//                 key={item.type}
//                 onClick={() => updateGroup(item)}
//                 className={`${
//                     item.exclude && 'opacity-30'
//                   } flex justify-between py-2 px-2 border-b border-gray-100 dark:border-light-dark nth-last-[1]:border-none cursor-pointer hover:bg-slate-50`}
//               >
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={!item.exclude}
//                     readOnly
                    
//                   />
//                   <div className="px-1 text-sm">{item.type}</div>
//                 </div>
//                 <div className="text-end">
//                   <div className="text-sm font-semibold">₱{item.price.toLocaleString()}</div>
//                   <div className="text-sm text-gray-400">
//                     {((item.price / CalculateTotal(spendings)) * 100).toFixed(2)}%
//                   </div>
//                 </div>
//               </div>
//           ))
//         }
//         </>
//       )}
//     </section>
//   </>
//   );
// };

// export default SpentSummary;
