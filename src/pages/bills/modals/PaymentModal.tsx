import CustomInput from '@/components/inputs/CustomInputs';
import SubmitButton from '@/components/button/SubmitButton';
import NumberFlow from '@/components/UI/NumberFlow';
import ModalWrapper from '@/wrapper/ModalWrapper';
import type { Bill } from '../types';

export type PaymentAccountOption = {
    name: string;
    amount: number;
};

type PaymentModalProps = {
    paymentBillIds: string[];
    bills: Bill[];
    paymentAccountDetails: PaymentAccountOption[];
    savedCustomPaymentMethods: string[];
    paymentChoice: string | null;
    customMethodInput: string;
    paymentError: string;
    isAmountHidden: boolean;
    onClose: () => void;
    onPaymentChoiceChange: (choice: string) => void;
    onCustomMethodInputChange: (value: string) => void;
    onMarkUnpaid: () => void;
    onConfirm: () => void;
};

const PaymentModal = ({
    paymentBillIds,
    bills,
    paymentAccountDetails,
    savedCustomPaymentMethods,
    paymentChoice,
    customMethodInput,
    paymentError,
    isAmountHidden,
    onClose,
    onPaymentChoiceChange,
    onCustomMethodInputChange,
    onMarkUnpaid,
    onConfirm,
}: PaymentModalProps) => (
    <ModalWrapper
        close={onClose}
        className="px-4 py-6"
        classNameChild="relative my-auto max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-medium-dark dark:text-white"
    >
        <header className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark dark:text-white">Choose Payment Method</h2>
            <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
                ✕
            </button>
        </header>

        {paymentError && (
            <p className="mt-3 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300" role="alert">
                {paymentError}
            </p>
        )}

        <section className="mt-4 h-fit space-y-3 overflow-hidden overflow-y-auto">
            {paymentAccountDetails.map((method) => (
                <button
                    key={method.name}
                    type="button"
                    onClick={() => onPaymentChoiceChange(method.name)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                        paymentChoice === method.name
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-light-dark dark:bg-light-dark dark:hover:bg-medium-dark'
                    }`}
                >
                    <span className="font-medium text-dark dark:text-white">{method.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-300">
                        {isAmountHidden ? '*****' : <NumberFlow value={method.amount} style="currency" currency="php" />}
                    </span>
                </button>
            ))}
            {paymentAccountDetails.length === 0 && savedCustomPaymentMethods.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 dark:border-light-dark dark:text-slate-300">
                    No accounts available. Select “Other” to add a custom payment method.
                </p>
            )}

            {savedCustomPaymentMethods.map((method) => (
                <button
                    key={method}
                    type="button"
                    onClick={() => onPaymentChoiceChange(method)}
                    className={`w-full cursor-pointer rounded-xl border px-3 py-3 text-left font-medium transition ${
                        paymentChoice === method
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-light-dark dark:bg-light-dark dark:hover:bg-medium-dark'
                    }`}
                >
                    {method}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPaymentChoiceChange('Other')}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                    paymentChoice === 'Other'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-light-dark dark:bg-light-dark dark:hover:bg-medium-dark'
                }`}
            >
                <span className="font-medium text-dark dark:text-white">Other</span>
                <span className="text-xs text-slate-500 dark:text-slate-300">Custom payment</span>
            </button>

            {paymentChoice === 'Other' && (
                <div>
                    <label className="text-sm font-medium text-dark dark:text-white">Custom payment method</label>
                    <CustomInput
                        value={customMethodInput}
                        type="text"
                        placeholder="Cash, GCash, etc."
                        className="!my-2 rounded-xl border border-slate-300 dark:border-light-dark"
                        onChange={onCustomMethodInputChange}
                    />
                </div>
            )}
        </section>

        <footer className="mt-6 flex gap-2 sm:flex-row sm:justify-end">
            {paymentBillIds.length === 1 && bills.some(
                (bill) => bill.id === paymentBillIds[0] && bill.status === 'paid',
            ) && (
                <button
                    type="button"
                    onClick={onMarkUnpaid}
                    className="cursor-pointer rounded-xl border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500"
                >
                    Mark as Unpaid
                </button>
            )}

            {paymentBillIds.length > 0 && (
                <button
                    type="button"
                    onClick={onMarkUnpaid}
                    className="cursor-pointer rounded-xl border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500"
                >
                    Mark all as Unpaid
                </button>
            )}

            <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-dark dark:border-light-dark dark:text-white"
            >
                Cancel
            </button>

            <SubmitButton title="Confirm" onClick={onConfirm} className="sm:w-auto" />
        </footer>
    </ModalWrapper>
);

export default PaymentModal;
