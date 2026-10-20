import CustomInput from '@/components/inputs/CustomInputs';
import SubmitButton from '@/components/button/SubmitButton';
import ModalWrapper from '@/wrapper/ModalWrapper';
import type { Bill, BillDisplayStatus, BillFormValues } from '../types';

type BillFormModalProps = {
    billForm: BillFormValues;
    editingBill: Bill | null;
    editingBillStatus: BillDisplayStatus | null;
    editingBillStatusClassName: string;
    dueDateClassName: string;
    editingBillId: string | null;
    formError: string;
    onClose: () => void;
    onFormChange: (field: keyof BillFormValues, value: string) => void;
    onOpenPayment: (bill: Bill, initialChoice: string | null) => void;
    onMarkUnpaid: () => void;
    onDelete: () => void;
    onSave: () => void;
};

const BillFormModal = ({
    billForm,
    editingBill,
    editingBillStatus,
    editingBillStatusClassName,
    dueDateClassName,
    editingBillId,
    formError,
    onClose,
    onFormChange,
    onOpenPayment,
    onMarkUnpaid,
    onDelete,
    onSave,
}: BillFormModalProps) => (
    <ModalWrapper
        close={onClose}
        className="overflow-y-auto px-4 py-6"
        classNameChild="my-auto max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-medium-dark dark:text-white"
    >
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark dark:text-white">
                {editingBillId ? 'Update Bill' : 'Add Bill'}
            </h2>
            <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
                ✕
            </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {formError && (
                <p className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300" role="alert">
                    {formError}
                </p>
            )}

            <div>
                <label className="text-sm font-medium text-dark dark:text-white">Bill Name</label>
                <CustomInput
                    value={billForm.name}
                    type="text"
                    placeholder="Internet bill"
                    className="!my-2 rounded-xl border border-slate-300 dark:border-light-dark"
                    onChange={(value) => onFormChange('name', value)}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-dark dark:text-white">Amount</label>
                <CustomInput
                    value={billForm.amount}
                    type="number"
                    placeholder="1500"
                    className="!my-2 rounded-xl border border-slate-300 dark:border-light-dark"
                    onChange={(value) => onFormChange('amount', value)}
                />
            </div>

            {editingBillId && (
                <div>
                    <label className="text-sm font-medium text-dark dark:text-white">Bill Status</label>
                    {editingBill && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onOpenPayment(
                                    editingBill,
                                    editingBill.status === 'paid'
                                        ? editingBill.customPaymentMethod || editingBill.paymentMethod || '—'
                                        : null,
                                )}
                                className={`my-2 w-full cursor-pointer rounded-xl px-3 py-3 text-left text-sm font-semibold ${editingBillStatusClassName}`}
                            >
                                {editingBillStatus === 'paid'
                                    ? `Paid using ${editingBill.customPaymentMethod || editingBill.paymentMethod || '—'}`
                                    : editingBillStatus === 'past-due' ? 'Past due' : 'Unpaid'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {editingBill?.status === 'paid' && (
                <div>
                    <label className="text-sm font-medium text-dark dark:text-white">Paid Date</label>
                    <CustomInput
                        value={billForm.paidDate}
                        type="date"
                        className="!my-2 rounded-xl border border-slate-300 dark:border-light-dark"
                        onChange={(value) => onFormChange('paidDate', value)}
                    />
                </div>
            )}

            <div>
                <label className="text-sm font-medium text-dark dark:text-white">Due Date</label>
                <CustomInput
                    value={billForm.dueDate}
                    type="date"
                    className={`!my-2 rounded-xl border border-slate-300 dark:border-light-dark ${dueDateClassName}`}
                    onChange={(value) => onFormChange('dueDate', value)}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-dark dark:text-white">Date Created</label>
                <CustomInput
                    value={billForm.dateCreated}
                    type="date"
                    className="!my-2 rounded-xl border border-slate-300 dark:border-light-dark"
                    onChange={(value) => onFormChange('dateCreated', value)}
                />
            </div>
        </div>

        <div className="mt-6 flex flex-wrap-reverse gap-2 sm:justify-end">
            <SubmitButton
                title="Cancel"
                onClick={onClose}
                className="sm:!w-auto !bg-transparent border border-slate-300 text-sm font-semibold hover:bg-gray-100 dark:border-light-dark dark:text-white"
            />

            {editingBillId && (
                <SubmitButton
                    title="Mark as Unpaid"
                    onClick={onMarkUnpaid}
                    className="sm:!w-auto !bg-transparent !text-orange-500 border border-orange-500 text-sm font-semibold"
                />
            )}

            {editingBillId && (
                <SubmitButton
                    title="Delete Bill"
                    onClick={onDelete}
                    className="sm:!w-auto !bg-transparent cursor-pointer rounded-xl border !border-red-500 px-4 py-2 text-sm font-semibold !text-red-500"
                />
            )}

            <SubmitButton
                title={editingBillId ? 'Update Bill' : 'Create Bill'}
                onClick={onSave}
                className="sm:w-auto"
            />
        </div>
    </ModalWrapper>
);

export default BillFormModal;
