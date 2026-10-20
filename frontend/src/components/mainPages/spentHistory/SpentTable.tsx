import { useMemo } from 'react'
import { TransactionInfoType } from '@/types/AccountTypes';
import { format } from 'date-fns';
import TransactionCard from '@/components/histories/TransactionCard';
import { useSpendingList } from '@/store/useSpendingStore';
const SpendingHistoryTable = () => {
    // Group items by date
    const { transactions } = useSpendingList();
    
    const groupedHistory: Record<string, TransactionInfoType[]> = useMemo(() => {
   
        return transactions?.reduce((groups: Record<string, TransactionInfoType[]>, item: TransactionInfoType) => {

            // Format the date with date-fns
            const formattedDate = format(new Date(item?.created_at || ""), 'MMMM d, yyyy');
            
            if (!groups[formattedDate]) groups[formattedDate] = [];
            groups[formattedDate].push(item);
        
            return groups;
        }, {});

    }, [transactions]);
    
  return (
    <div>
        {
            [...Object.entries(groupedHistory || {})]?.map(([date, items]) => (
                <div key={date} className="mb-4">
                    <h3 className="font-semibold">{date}</h3>

                    {[...items].map((tx) => (
                        <div key={tx?.id} className=" ">
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

export default SpendingHistoryTable
