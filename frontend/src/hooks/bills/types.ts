export type BillRecord = {
    id: number;
    user_id: string;
    bill_name: string;
    bill_amount: number;
    status: string;
    due_date: string | null;
    paid_date: string | null;
    bill_group_date: string | null;
    payment_method: string | null;
    payment_account: string | null;
    custom_payment_method: string | null;
    created_at: string;
};

export type BillInsert = Omit<BillRecord, 'id' | 'created_at'>;

export type BillUpdate = Partial<
    Pick<
        BillRecord,
        | 'bill_name'
        | 'bill_amount'
        | 'status'
        | 'due_date'
        | 'paid_date'
        | 'bill_group_date'
        | 'payment_method'
        | 'payment_account'
        | 'custom_payment_method'
    >
>;
