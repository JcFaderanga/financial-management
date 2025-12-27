import { useEffect, useState, useMemo } from 'react'
import useTransactionHistory from '@/hooks/accountHooks/useTransactionHistory'
import { TransactionInfoType } from '@/types/AccountTypes';
import { format } from 'date-fns';
import TransactionCard from './TransactionCard';
const BankTransactionHistory = ({bank_code}: {bank_code: string | number}) => {
    const [bankHistory, setBankHistory] = useState<TransactionInfoType[]>();
    const [isBankHistoryErr, setIsBankHistoryErr] = useState<any>()
    const {FetchBankHistory} = useTransactionHistory();

    useEffect(()=>{ 
        async function fetchHistory() {
            const res = await FetchBankHistory(bank_code)

            if(res?.success) setBankHistory(res.data)
            else setIsBankHistoryErr(res?.error)
        }
        
        fetchHistory()
    },[]);

    // Group items by date
    const groupedHistory = useMemo(() => {
        return bankHistory?.reduce((groups: Record<string, TransactionInfoType[]>, item) => {
           
            // Format the date with date-fns
            const formattedDate = format(new Date(item?.created_at), 'MMMM d, yyyy');
        
            if (!groups[formattedDate]) {
                groups[formattedDate] = [];
            }
            groups[formattedDate].push(item);
        
            return groups;
        }, {});
    }, [bankHistory]);
    
  return (
    <div>
        {
            isBankHistoryErr && <strong className='text-red-500'>Something went wrong while getting history.</strong>
        }
        {
            Object.entries(groupedHistory || {})?.map(([date, items]) => (
                <div key={date} className="mb-4">
                    <h3 className="font-semibold">{date}</h3>

                    {[...items].reverse().map((tx) => (
                        <div key={tx?.id} className="pl-4">
                        {/* Replace with your transaction row component */}
                        <TransactionCard
                            transaction_data = {tx}
                        />

                        </div>
                    ))}
                </div>
            ))
        }
    </div>
  )
}

export default BankTransactionHistory
