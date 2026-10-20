import { TransactionInfoType } from "@/types/AccountTypes";
import { getCurrentLocalTime } from "@/utils/DateFormat";
import { format } from "date-fns";
import { BankAccount } from '@/utils/BankAccountFormula';
import { useAccountStore } from '@/store/useAccountStore';
import { useUserStore } from "@/store/useUserStore";

export const useTransactionDetails = () => {
    const {account} = useAccountStore();
    const {user} = useUserStore();

    // --- Generate local date
    const currentTime = getCurrentLocalTime();
    const createdDate =  `${format(new Date(),'yyyy-MM-dd')} ${currentTime}`;

    // --- Get over all available balance, total of all bank accounts balance ---
    const bankData = new BankAccount(account);
    const current_balance = bankData.getAvailableBalance() ?? 0;

    function setTransaction(transaction: TransactionInfoType) {
        
        const delta_amount = Number(transaction.transaction_detail.delta_amount) ?? 0;
        const new_available_balance = delta_amount > 0 
            ? current_balance + delta_amount 
            : Math.abs(current_balance) - Math.abs(delta_amount);

        const transactionInfo: TransactionInfoType = {
            owner: user?.id,
            transaction_type: transaction.transaction_type,
            transaction_detail: {
                ...transaction.transaction_detail,
                prev_available_balance: current_balance,
                new_available_balance: new_available_balance,
            },
            bank_key: transaction.bank_key,
            created_at: transaction.created_at ?? createdDate,
        }

    return transactionInfo;
    }

    return {setTransaction};
}

export default useTransactionDetails;
