import { itemTypes } from "./itemTypes";

export type AccountType = {
    id?: string | number,
    account_name: string,
    account_key: number | string,
    account_code: string,
    amount: number,
    account_owner: string,
    created_at?: Date,
}

export type TransactionDetailType = {
    item_id?: number | string,
    item_details?: itemTypes,
    prev_amount: number | null;
    new_amount: number;
    delta_amount: number;
    prev_available_balance?: number,
    new_available_balance?: number,
};


export type TransactionInfoType = {
    id?: string | number,
    owner?: string; 
    transaction_type: string; 
    transaction_detail: TransactionDetailType;
    bank_key: string | number | undefined;
    created_at?: string | Date;
    
};
