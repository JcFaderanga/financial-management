import { TransactionDetailType, TransactionInfoType } from "@/types/AccountTypes";
import { getCurrentLocalTime } from "@/utils/DateFormat";
import { format } from "date-fns";

const TransactionDetails = ({
    userId,
    transaction_type,
    transaction_detail,
    bank_key,
}: {
    userId: string;
    transaction_type: string;
    transaction_detail: TransactionDetailType;
    bank_key: string | number;
}) => {

    const currentTime = getCurrentLocalTime();
    const createdDate =  `${format(new Date(),'yyyy-MM-dd')} ${currentTime}`;

    const transactionInfo: TransactionInfoType = {
        owner: userId,
        transaction_type: transaction_type,
        transaction_detail: transaction_detail,
        bank_key: bank_key,
        created_at: createdDate,
    }

    return transactionInfo;
}

export default TransactionDetails;
