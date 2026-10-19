export type BillStatus = 'pending' | 'paid';
export type BillDisplayStatus = BillStatus | 'past-due';

export type Bill = {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    dateCreated: string;
    paidDate: string | null;
    status: BillStatus;
    paymentMethod: string | null;
    paymentAccount: string | null;
    customPaymentMethod: string | null;
    createdAt: string;
    updatedAt: string;
};

export type BillFormValues = {
    name: string;
    amount: string;
    dueDate: string;
    dateCreated: string;
    paidDate: string;
};
