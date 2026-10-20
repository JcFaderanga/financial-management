import NumberFlowUI from '../UI/NumberFlow';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useSpendingList } from '@/store/useSpendingStore';
import { TransactionInfoType } from '@/types/AccountTypes';
import { useEffect, useState } from 'react';
const OverView = () => {
 const [outFlow, setOutFlow] = useState<number>(0)
 const [inFlow, setInFlow] = useState<number>(0)

  const { transactions } = useSpendingList();
  
  useEffect(()=>{
    const filteredActivity = transactions?.filter((trans: TransactionInfoType)=> trans.transaction_type === "activity");

    const spendingActivityTotal = filteredActivity?.reduce((total: number, act: TransactionInfoType)=>{
      total += Number(act.transaction_detail.item_details?.price);

      return total;
    },0)

    // NOTE: transaction is on reversed decs ex. 100 -> 0 
    // Reversion happened on "useTransactionHistory.tsx" 
    // useTransactionHistory.tsx / FetchDaily() / History.order('created_at', { ascending: false })
    const new_transactions_bal = transactions?.[0]?.transaction_detail?.new_available_balance;
    const prev_transactions_bal = transactions?.[transactions.length - 1]?.transaction_detail?.prev_available_balance;

    const inFlow = prev_transactions_bal < new_transactions_bal 
        ? new_transactions_bal - prev_transactions_bal
        : 0;
        setInFlow(inFlow)
    
    const outFlow = prev_transactions_bal > new_transactions_bal 
        ? (Math.abs(prev_transactions_bal) - Math.abs(new_transactions_bal)) 
        : spendingActivityTotal;
        setOutFlow(outFlow)
    },[transactions])
  

  return (
    <div
      onClick={()=>{}} 
      className='border dark:border-none border-gray-300 rounded-xl custom-black flex dark:bg-medium-dark
      justify-around items-center hover:bg-gray-50 dark:hover:!bg-light-dark cursor-pointer py-4'>
      <div className='dark:text-white'>
        <div className='flex items-center gap-1'><FaArrowDown className='text-[#eb4b6d] '/>Outflows</div>
        <div className="text-[#eb4b6d] text-lg font-bold flex">
          <NumberFlowUI
              value={ outFlow ?? 0}
              currency='PHP'
              style='currency'
            />
        </div>
      </div>
      <div className='dark:text-white'>
        <div className='flex items-center gap-1'><FaArrowUp className=' text-green-500'/> inFlow</div>
        <div className={`  text-lg font-bold`}>
          <NumberFlowUI
              value={inFlow}
              currency='PHP'
              style='currency'
            />
        </div>
      </div>
    </div>
  );
};

export default OverView;
