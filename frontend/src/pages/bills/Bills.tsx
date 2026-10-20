import { useEffect, useMemo, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import NumberFlow from '@/components/UI/NumberFlow';
import useDocumentTitle from '@/hooks/document/useDocTitle';
import useDeleteBill from '@/hooks/bills/useDeleteBill';
import useFetchBills from '@/hooks/bills/useFetchBills';
import useFetchBillMonths from '@/hooks/bills/useFetchBillMonths';
import useInsertBill from '@/hooks/bills/useInsertBill';
import useUpdateBill from '@/hooks/bills/useUpdateBill';
import type { BillInsert, BillRecord, BillUpdate } from '@/hooks/bills/types';
import { AccountType } from '@/types/AccountTypes';
import { useAccountStore, useAmountHidden } from '@/store/useAccountStore';
// import { BankAccount } from '@/utils/BankAccountFormula';
import BillFormModal from './modals/BillFormModal';
import DeleteBillModal from './modals/DeleteBillModal';
import PaymentModal from './modals/PaymentModal';
import type { Bill, BillDisplayStatus, BillFormValues, BillStatus } from './types';

type SortKey = 'name' | 'amount' | 'dueDate' | 'paidDate' | 'dateCreated';
type SortDirection = 'asc' | 'desc';

const getTodayValue = () => new Date().toISOString().slice(0, 10);

const getLocalTodayValue = () => {
const now = new Date();
return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const getValidDateValue = (value: string) => {
const dateValue = value.slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return null;

const date = new Date(`${dateValue}T00:00:00`);
if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(dateValue.slice(0, 4)) ||
    date.getMonth() + 1 !== Number(dateValue.slice(5, 7)) ||
    date.getDate() !== Number(dateValue.slice(8, 10))
) {
    return null;
}

return dateValue;
};

const formatDateLabel = (value: string | null | undefined) => {
const dateValue = value ? getValidDateValue(value) : null;
if (!dateValue) return '—';

const safeDate = new Date(`${dateValue}T00:00:00`);

return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
}).format(safeDate);
};

const getCurrentMonthKey = () => {
const now = new Date();
return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthDate = (monthKey: string) => {
const [year, month] = monthKey.split('-').map(Number);
return new Date(year, month - 1, 1);
};

const getMonthKey = (value: string | null | undefined) => {
if (!value) {
    return getCurrentMonthKey();
}

const safeDate = new Date(`${value}T00:00:00`);

if (Number.isNaN(safeDate.getTime())) {
    return getCurrentMonthKey();
}

return `${safeDate.getFullYear()}-${String(safeDate.getMonth() + 1).padStart(2, '0')}`;
};

const toBill = (record: BillRecord): Bill => {
const createdDate = getValidDateValue(record.bill_group_date ?? '') ?? getValidDateValue(record.created_at) ?? getTodayValue();
return {
    id: String(record.id),
    name: record.bill_name,
    amount: Number(record.bill_amount),
    dueDate: getValidDateValue(record.due_date ?? '') ?? '',
    dateCreated: createdDate,
    paidDate: record.paid_date,
    status: record.status === 'paid' ? 'paid' : 'pending',
    paymentMethod: record.payment_method,
    paymentAccount: record.payment_account,
    customPaymentMethod: record.custom_payment_method,
    createdAt: record.created_at,
    updatedAt: record.created_at,
};
};

const getMonthLabel = (monthKey: string) => {
const [year, month] = monthKey.split('-').map(Number);
if (!year || !month) {
    return 'Current Month';
}

return new Date(year, month - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
});
};

const getBillDisplayStatus = (bill: Bill, today: string): BillDisplayStatus => {
if (bill.status === 'paid') return 'paid';
const dueDate = getValidDateValue(bill.dueDate);
return dueDate && dueDate < today ? 'past-due' : 'pending';
};

const getDueDateClassName = (status: BillStatus, dueDateValue: string, today: string) => {
if (status === 'paid') return '';
const dueDate = getValidDateValue(dueDateValue);
if (!dueDate) return '';
if (dueDate < today) return 'text-red-500';

const dueDateParts = dueDate.split('-').map(Number);
const todayParts = today.split('-').map(Number);
const daysUntilDue = (
    Date.UTC(dueDateParts[0], dueDateParts[1] - 1, dueDateParts[2])
    - Date.UTC(todayParts[0], todayParts[1] - 1, todayParts[2])
) / 86_400_000;
return daysUntilDue <= 7 ? 'text-orange-500' : '';
};

const getBillStatusClass = (status: BillDisplayStatus) => {
if (status === 'paid') {
    return 'border border-green-500 text-green-500';
}

if (status === 'past-due') {
    return 'border border-red-500 text-red-500';
}

return 'border border-orange-500 text-orange-500';
};

const Bills = () => {
useDocumentTitle('Bills | Finance Management');

const { account } = useAccountStore();
const { isAmountHidden } = useAmountHidden();
const { bills: billRecords, loading: billsLoading, fetchAccountData } = useFetchBills();
const {
    months: availableMonths,
    customPaymentMethods,
    fetchBillMonths,
} = useFetchBillMonths();
const { insertBill, loading: insertingBill } = useInsertBill();
const { updateBill, loading: updatingBill } = useUpdateBill();
const { deleteBill, loading: deletingBill } = useDeleteBill();
const bills = useMemo(() => billRecords.map(toBill), [billRecords]);
const [todayValue, setTodayValue] = useState(getLocalTodayValue);
const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthKey());
const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
const [sortKey, setSortKey] = useState<SortKey>('name');
const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
const [billForm, setBillForm] = useState<BillFormValues>({
    name: '',
    amount: '',
    dueDate: '',
    dateCreated: getTodayValue(),
    paidDate: '',
});
const [formError, setFormError] = useState('');
const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
const [showBillModal, setShowBillModal] = useState(false);
const [editingBillId, setEditingBillId] = useState<string | null>(null);
const [deleteTarget, setDeleteTarget] = useState<Bill | null>(null);
const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
const [paymentBillIds, setPaymentBillIds] = useState<string[]>([]);
const [paymentSource, setPaymentSource] = useState<'single' | 'bulk'>('single');
const [paymentChoice, setPaymentChoice] = useState<string | null>(null);
const [customMethodInput, setCustomMethodInput] = useState('');
const [paymentError, setPaymentError] = useState('');
const selectAllRef = useRef<HTMLInputElement>(null);
// const wallet = new BankAccount(account);

useEffect(() => {
    let timeoutId: number;
    const scheduleNextDay = () => {
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    timeoutId = window.setTimeout(() => {
        setTodayValue(getLocalTodayValue());
        scheduleNextDay();
    }, nextDay.getTime() - now.getTime());
    };

    scheduleNextDay();
    return () => window.clearTimeout(timeoutId);
}, []);

useEffect(() => {
    void fetchBillMonths().then((months) => {
    if (!months) {
        setNotice({ type: 'error', text: 'Unable to load available bill months.' });
    }
    });
}, [fetchBillMonths]);

useEffect(() => {
    void fetchAccountData(getMonthDate(selectedMonth)).then((records) => {
    if (!records) {
        setNotice({ type: 'error', text: 'Unable to load bills for the selected month.' });
    }
    });
}, [fetchAccountData, selectedMonth]);

const monthOptions = useMemo(() => {
    const months = new Set<string>([getCurrentMonthKey(), ...availableMonths]);

    return Array.from(months).sort((firstMonth, secondMonth) => {
    const [firstYear, firstMonthValue] = firstMonth.split('-').map(Number);
    const [secondYear, secondMonthValue] = secondMonth.split('-').map(Number);

    return secondYear - firstYear || secondMonthValue - firstMonthValue;
    });
}, [availableMonths]);

useEffect(() => {
    if (!monthOptions.includes(selectedMonth)) {
    setSelectedMonth(monthOptions[0] ?? getCurrentMonthKey());
    }
}, [monthOptions, selectedMonth]);

const paymentAccountDetails = useMemo(
    () =>
    account.map((entry: AccountType) => {
        const name = (entry.account_code || 'Account').trim();
        return {
        name,
        amount: Number(entry.amount) || 0,
        };
    }).filter((method, index, methods) => methods.findIndex((item) => item.name === method.name) === index),
    [account],
);

const savedCustomPaymentMethods = useMemo(
    () => {
    const accountNames = new Set(paymentAccountDetails.map((method) => method.name.toLocaleLowerCase()));
    const uniqueMethods = new Map<string, string>();
    [...customPaymentMethods, ...bills.map((bill) => bill.customPaymentMethod ?? '')].forEach((method) => {
        const name = method.trim();
        const normalizedName = name.toLocaleLowerCase();
        if (name && !accountNames.has(normalizedName) && !uniqueMethods.has(normalizedName)) {
        uniqueMethods.set(normalizedName, name);
        }
    });
    return Array.from(uniqueMethods.values());
    },
    [bills, customPaymentMethods, paymentAccountDetails],
);

const visibleBills = useMemo(
    () => bills.filter((bill) => getMonthKey(bill.dateCreated) === selectedMonth),
    [bills, selectedMonth],
);

const visibleBillIds = useMemo(() => visibleBills.map((bill) => bill.id), [visibleBills]);
const selectedVisibleBillIds = useMemo(
    () => selectedBillIds.filter((id) => visibleBillIds.includes(id)),
    [selectedBillIds, visibleBillIds],
);
const allVisibleBillsSelected = visibleBills.length > 0 && selectedVisibleBillIds.length === visibleBills.length;
const someVisibleBillsSelected = selectedVisibleBillIds.length > 0;

useEffect(() => {
    setSelectedBillIds((current) => current.filter((id) => visibleBillIds.includes(id)));
}, [visibleBillIds]);

useEffect(() => {
    if (selectAllRef.current) {
    selectAllRef.current.indeterminate = someVisibleBillsSelected && !allVisibleBillsSelected;
    }
}, [allVisibleBillsSelected, someVisibleBillsSelected]);

const sortedVisibleBills = useMemo(() => {
    const getSortableDate = (bill: Bill) => {
    const value = sortKey === 'dueDate' ? bill.dueDate : sortKey === 'paidDate' ? bill.paidDate : bill.dateCreated;
    return getValidDateValue(value ?? '');
    };

    return [...visibleBills].sort((first, second) => {
    let comparison = 0;

    if (sortKey === 'name') {
        comparison = first.name.localeCompare(second.name);
    } else if (sortKey === 'amount') {
        comparison = first.amount - second.amount;
    } else if (sortKey === 'dueDate' || sortKey === 'paidDate') {
        const firstDate = getSortableDate(first);
        const secondDate = getSortableDate(second);
        if (!firstDate || !secondDate) {
        return firstDate ? -1 : secondDate ? 1 : 0;
        }
        comparison = firstDate.localeCompare(secondDate);
    } else {
        comparison = first.dateCreated.localeCompare(second.dateCreated);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
    });
}, [sortDirection, sortKey, visibleBills]);

const selectedMonthTotals = useMemo(
    () =>
    visibleBills.reduce(
        (totals, bill) => {
        const amount = Number(bill.amount) || 0;
        if (bill.status === 'paid') {
            totals.paid += amount;
        } else {
            totals.unpaid += amount;
        }
        totals.totalAmount = totals.paid + totals.unpaid;
        return totals;
        },
        { totalAmount: 0, paid: 0, unpaid: 0 },
    ),
    [visibleBills],
);

const updateSort = (key: SortKey) => {
    if (sortKey === key) {
    setSortDirection((current) => current === 'asc' ? 'desc' : 'asc');
    } else {
    setSortKey(key);
    setSortDirection('asc');
    }
};

const sortHeader = (label: string, key: SortKey) => (
    <button
    type="button"
    onClick={() => updateSort(key)}
    className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap"
    aria-label={`Sort by ${label}`}
    >
    {label}
    <span aria-hidden="true">{sortKey === key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</span>
    </button>
);

const refreshAfterMutation = async (monthKey: string) => {
    const months = await fetchBillMonths();
    if (!months) {
        setNotice({ type: 'error', text: 'The bill was saved, but available months could not be refreshed.' });
    }

    if (monthKey !== selectedMonth) {
        setSelectedMonth(monthKey);
        return;
    }

    const records = await fetchAccountData(getMonthDate(monthKey));
    if (!records) {
        setNotice({ type: 'error', text: 'The bill was saved, but the table could not be refreshed.' });
    }
};

const closeBillModal = () => {
    setShowBillModal(false);
    setEditingBillId(null);
    setBillForm({ name: '', amount: '', dueDate: '', dateCreated: getTodayValue(), paidDate: '' });
    setFormError('');
};

const openCreateBillModal = () => {
    setEditingBillId(null);
    setBillForm({ name: '', amount: '', dueDate: '', dateCreated: getTodayValue(), paidDate: '' });
    setFormError('');
    setShowBillModal(true);
};

const openEditBillModal = (bill: Bill) => {
    setEditingBillId(bill.id);
    setBillForm({
    name: bill.name,
    amount: String(bill.amount),
    dueDate: getValidDateValue(bill.dueDate) ?? '',
    dateCreated: bill.dateCreated || bill.createdAt?.slice(0, 10) || getTodayValue(),
    paidDate: getValidDateValue(bill.paidDate ?? '') ?? '',
    });
    setFormError('');
    setShowBillModal(true);
};

const saveBill = async () => {
    const trimmedName = billForm.name.trim();
    const numericAmount = Number(billForm.amount);
    const enteredDueDate = billForm.dueDate.trim();
    const validatedDueDate = enteredDueDate ? getValidDateValue(enteredDueDate) : null;
    const dueDate = validatedDueDate ?? '';
    const dateCreated = getValidDateValue(billForm.dateCreated.trim());
    const editingBill = editingBillId ? bills.find((bill) => bill.id === editingBillId) : null;
    const paidDate = editingBill?.status === 'paid' ? getValidDateValue(billForm.paidDate.trim()) : null;

    if (!trimmedName) {
    setFormError('Bill name is required.');
    return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    setFormError('Amount must be a valid positive number.');
    return;
    }

    if (enteredDueDate && !validatedDueDate) {
    setFormError('Due date must be valid.');
    return;
    }

    if (!dateCreated) {
    setFormError('Date created must be valid.');
    return;
    }

    if (editingBill?.status === 'paid' && !paidDate) {
    setFormError('Paid date must be valid.');
    return;
    }

    try {
        if (editingBillId) {
            const billId = Number(editingBillId);
            if (!Number.isSafeInteger(billId)) {
                throw new Error('The selected bill has an invalid ID.');
            }

            const updates: BillUpdate = {
                bill_name: trimmedName,
                bill_amount: numericAmount,
                due_date: dueDate || null,
                bill_group_date: dateCreated,
                paid_date: paidDate,
            };
            await updateBill([billId], updates);
            setNotice({ type: 'success', text: 'Bill updated successfully.' });
        } else {
            const newBill: Omit<BillInsert, 'user_id'> = {
                bill_name: trimmedName,
                bill_amount: numericAmount,
                status: 'pending',
                due_date: dueDate || null,
                paid_date: null,
                bill_group_date: dateCreated,
                payment_method: null,
                payment_account: null,
                custom_payment_method: null,
            };
            await insertBill(newBill);
            setNotice({ type: 'success', text: 'Bill created successfully.' });
        }

        closeBillModal();
        await refreshAfterMutation(getMonthKey(dateCreated));
    } catch (cause) {
        setFormError(cause instanceof Error ? cause.message : 'Unable to save bill.');
    }
};

const markBillsUnpaid = async (billIds: string[]) => {
    try {
        if (billIds.length === 0) return;

        const numericIds = billIds.map(Number);
        if (numericIds.some((id) => !Number.isSafeInteger(id))) {
            throw new Error('One or more selected bills have an invalid ID.');
        }

        await updateBill(numericIds, {
            status: 'pending',
            payment_method: null,
            payment_account: null,
            custom_payment_method: null,
            paid_date: null,
        });
        if (editingBillId && billIds.includes(editingBillId)) {
            setBillForm((current) => ({ ...current, paidDate: '' }));
        }
        setNotice({ type: 'success', text: billIds.length > 1 ? 'Selected bills marked as unpaid.' : 'Bill marked as unpaid.' });
        if (paymentSource === 'bulk' && paymentBillIds.length > 0) {
            setSelectedBillIds([]);
        }
        await refreshAfterMutation(selectedMonth);
    } catch (cause) {
        setNotice({ type: 'error', text: cause instanceof Error ? cause.message : 'Unable to mark bills as unpaid.' });
        await refreshAfterMutation(selectedMonth);
    }
};

const confirmDeleteBill = async () => {
    const billIds = bulkDeleteIds.length > 0
    ? bulkDeleteIds
    : deleteTarget
        ? [deleteTarget.id]
        : [];
    if (billIds.length === 0) return;

    try {
        const numericIds = billIds.map(Number);
        if (numericIds.some((id) => !Number.isSafeInteger(id))) {
            throw new Error('One or more selected bills have an invalid ID.');
        }

        await deleteBill(numericIds);
        const deletedIds = new Set(billIds);
        setSelectedBillIds((selected) => selected.filter((id) => !deletedIds.has(id)));
        setDeleteTarget(null);
        setBulkDeleteIds([]);
        setNotice({ type: 'success', text: billIds.length > 1 || bulkDeleteIds.length > 0 ? 'Bills deleted successfully.' : 'Bill deleted successfully.' });
        await refreshAfterMutation(selectedMonth);
    } catch (cause) {
        setNotice({ type: 'error', text: cause instanceof Error ? cause.message : 'Unable to delete bills.' });
        await refreshAfterMutation(selectedMonth);
    }
};

const openPaymentModal = (
    billIds: string[],
    initialChoice: string | null = null,
    source: 'single' | 'bulk' = 'single',
) => {
    setPaymentBillIds(billIds);
    setPaymentSource(source);
    setPaymentChoice(initialChoice);
    setCustomMethodInput('');
    setPaymentError('');
};

const closePaymentModal = () => {
    setPaymentBillIds([]);
    setPaymentSource('single');
    setPaymentChoice(null);
    setCustomMethodInput('');
    setPaymentError('');
};

const confirmPayment = async () => {
    if (paymentBillIds.length === 0) return;

    if (!paymentChoice) {
    setPaymentError('Please choose a payment method.');
    return;
    }

    let methodName = paymentChoice;

    if (paymentChoice === 'Other') {
    const trimmedCustom = customMethodInput.trim();

    if (!trimmedCustom) {
        setPaymentError('Custom payment method is required.');
        return;
    }

    methodName = trimmedCustom;
    }

    const accountMethodSelected = paymentAccountDetails.some(
    (method) => method.name.toLocaleLowerCase() === methodName.toLocaleLowerCase(),
    );
    const isCustomMethod = paymentChoice === 'Other'
    || (!accountMethodSelected && savedCustomPaymentMethods.some((method) => method.toLocaleLowerCase() === methodName.toLocaleLowerCase()));
    const currentBills = bills.filter((bill) => paymentBillIds.includes(bill.id));
    const numericIds = paymentBillIds.map(Number);
    if (numericIds.some((id) => !Number.isSafeInteger(id))) {
        setPaymentError('One or more selected bills have an invalid ID.');
        return;
    }

    try {
        const paymentUpdates: BillUpdate = {
            status: 'paid',
            payment_method: methodName,
            payment_account: isCustomMethod ? null : paymentChoice,
            custom_payment_method: isCustomMethod ? methodName : null,
        };
        const billIdsWithPaidDate = currentBills.filter((bill) => bill.paidDate).map((bill) => Number(bill.id));
        const billIdsWithoutPaidDate = currentBills.filter((bill) => !bill.paidDate).map((bill) => Number(bill.id));
        if (billIdsWithPaidDate.length > 0) {
            await updateBill(billIdsWithPaidDate, paymentUpdates);
        }
        if (billIdsWithoutPaidDate.length > 0) {
            await updateBill(billIdsWithoutPaidDate, { ...paymentUpdates, paid_date: getTodayValue() });
        }
        const editingBill = currentBills.find((bill) => bill.id === editingBillId);
        if (editingBill) {
            setBillForm((current) => ({ ...current, paidDate: editingBill.paidDate || getTodayValue() }));
        }
        if (paymentSource === 'bulk') {
            setSelectedBillIds([]);
        }
        setNotice({ type: 'success', text: paymentSource === 'bulk' ? 'Selected bills marked as paid.' : 'Bill marked as paid.' });
        closePaymentModal();
        await refreshAfterMutation(selectedMonth);
    } catch (cause) {
        setPaymentError(cause instanceof Error ? cause.message : 'Unable to mark bills as paid.');
        await refreshAfterMutation(selectedMonth);
    }
};

const openBulkDeleteConfirmation = () => {
    if (selectedVisibleBillIds.length === 0) return;
    setBulkDeleteIds(selectedVisibleBillIds);
    setDeleteTarget(null);
};

const openBulkPaymentModal = () => {
    if (selectedVisibleBillIds.length === 0) return;
    openPaymentModal(selectedVisibleBillIds, null, 'bulk');
};

const editingBill = editingBillId ? bills.find((bill) => bill.id === editingBillId) ?? null : null;
const editingBillDisplayStatus = editingBill
    ? getBillDisplayStatus({ ...editingBill, dueDate: billForm.dueDate }, todayValue)
    : null;

return (
    <div className="p-4 pb-20 dark:text-white">
    <div className="mb-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-light-dark dark:bg-medium-dark">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">{getMonthLabel(selectedMonth)}</p>
                <label className="text-xs text-slate-500 dark:text-slate-300">
                <span className="mr-2">Month</span>
                <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-dark dark:border-light-dark dark:bg-dark dark:text-white"
                    aria-label="Select month"
                >
                    {monthOptions.map((monthKey) => (
                    <option key={monthKey} value={monthKey}>
                        {getMonthLabel(monthKey)}
                    </option>
                    ))}
                </select>
                </label>
            </div>
            <div className="mt-2 text-xl font-bold text-dark dark:text-white">
                {isAmountHidden ? '*****' : <NumberFlow value={selectedMonthTotals.totalAmount} style="currency" currency="php" />}
            </div>
        </div>
        <div className="rounded-2xl border flex justify-around border-slate-200 bg-white p-4 dark:border-light-dark dark:bg-medium-dark">
            <div>
                <p className="text-xs uppercase tracking-wide text-green-600 dark:text-green-400">Paid</p>
                <div className="mt-2 text-xl font-bold text-green-600 dark:text-green-400">
                    {isAmountHidden ? '*****' : <NumberFlow value={selectedMonthTotals.paid} style="currency" currency="php" />}
                </div>
            </div>   

            <div>
                <p className="text-xs uppercase tracking-wide text-orange-600 dark:text-orange-400">Unpaid</p>
                <div className="mt-2 text-xl font-bold text-orange-600 dark:text-orange-400">
                    {isAmountHidden ? '*****' : <NumberFlow value={selectedMonthTotals.unpaid} style="currency" currency="php" />}
                </div>
            </div>   
            {/* <div>
                <p className="text-xs uppercase tracking-wide text-orange-600 dark:text-red-400">Wallet Balance</p>
                <div className="mt-2 text-xl font-bold text-orange-600 dark:text-red-400">
                    {isAmountHidden ? '*****' : <NumberFlow value={Number((wallet.getAvailableBalance()) || 0) - selectedMonthTotals.totalAmount} style="currency" currency="php" />}
                </div>
            </div>*/}
        </div>  
    </div>

    {notice && (
        <div
        className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
            notice.type === 'success'
            ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300'
            : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
        }`}
        role={notice.type === 'success' ? 'status' : 'alert'}
        >
        {notice.text}
        </div>
    )}

    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-300">
        {selectedVisibleBillIds.length > 0 ? `${selectedVisibleBillIds.length} selected` : ''} 
        </p>
        
        <div className='flex gap-2'>
            <button
                type="button"
                onClick={openCreateBillModal}
                disabled={insertingBill || updatingBill || deletingBill}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
                <FaPlus size={12} />
            Add Bill
            </button>
            <select
            aria-label="Bulk actions"
            value=""
            disabled={selectedVisibleBillIds.length === 0 || insertingBill || updatingBill || deletingBill}
            onChange={(event) => {
                if (event.target.value === 'update') openBulkPaymentModal();
                if (event.target.value === 'delete') openBulkDeleteConfirmation();
            }}
            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-dark disabled:cursor-not-allowed disabled:opacity-50 dark:border-light-dark dark:bg-medium-dark dark:text-white"
            >
                <option value="" disabled>Bulk actions</option>
                <option value="update">Update Status</option>
                <option value="delete">Delete Bills</option>
            </select>
        </div>
    </div>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-light-dark dark:bg-medium-dark">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-slate-100 dark:bg-light-dark">
            <tr>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-dark dark:text-white">
                <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allVisibleBillsSelected}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                    if (event.target.checked) {
                        setSelectedBillIds(visibleBillIds);
                    } else {
                        setSelectedBillIds([]);
                    }
                    }}
                    aria-label="Select all displayed bills"
                    className="cursor-pointer accent-blue-500"
                />
              
                </label>
            </th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-dark dark:text-white">{sortHeader('Bill Name', 'name')}</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-dark dark:text-white">{sortHeader('Bill Amount', 'amount')}</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-dark dark:text-white">Status</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-dark dark:text-white">{sortHeader('Due Date', 'dueDate')}</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-dark dark:text-white">{sortHeader('Paid Date', 'paidDate')}</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold text-dark dark:text-white">{sortHeader('Date Created', 'dateCreated')}</th>
            </tr>
        </thead>

        <tbody>
            {billsLoading ? (
            <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-300">
                Loading bills for {getMonthLabel(selectedMonth)}...
                </td>
            </tr>
            ) : visibleBills.length === 0 ? (
            <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-300">
                No bills for {getMonthLabel(selectedMonth)}.
                </td>
            </tr>
            ) : (
            sortedVisibleBills.map((bill) => {
                const displayedPaymentMethod = bill.customPaymentMethod || bill.paymentMethod || '—';
                const displayStatus = getBillDisplayStatus(bill, todayValue);
                const dueDateClassName = getDueDateClassName(bill.status, bill.dueDate, todayValue);
                return (
                <tr
                    key={bill.id}
                    onClick={() => openEditBillModal(bill)}
                    onKeyDown={(event) => {
                    if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        openEditBillModal(bill);
                    }
                    }}
                    tabIndex={0}
                    className="cursor-pointer border-t border-slate-200 hover:bg-slate-50 dark:border-light-dark dark:hover:bg-light-dark"
                >
                    <td className="whitespace-nowrap px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={selectedVisibleBillIds.includes(bill.id)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                        setSelectedBillIds((current) => {
                            const displayedSelection = current.filter((id) => visibleBillIds.includes(id));
                            return event.target.checked
                            ? Array.from(new Set([...displayedSelection, bill.id]))
                            : displayedSelection.filter((id) => id !== bill.id);
                        });
                        }}
                        aria-label={`Select ${bill.name}`}
                        className="cursor-pointer accent-blue-500"
                    />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-dark dark:text-white">{bill.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-dark dark:text-white">
                    {isAmountHidden ? '*****' : <NumberFlow value={bill.amount} style="currency" currency="php" />}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex min-w-[170px] rounded-lg px-2 py-2 text-xs font-semibold ${getBillStatusClass(displayStatus)}`}>
                        {displayStatus === 'paid'
                            ? `Paid using ${displayedPaymentMethod}`
                            : displayStatus === 'past-due' ? 'Past due' : 'Unpaid'}
                    </span>
                    </td>
                    <td className={`whitespace-nowrap px-4 py-3 ${dueDateClassName || 'text-dark dark:text-white'}`}>
                    {formatDateLabel(bill.dueDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-dark dark:text-white">
                    {bill.status === 'paid' ? formatDateLabel(bill.paidDate) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-dark dark:text-white">
                    {formatDateLabel(bill.dateCreated)}
                    </td>
                </tr>
                );
            })
            )}
        </tbody>
        </table>
    </div>

    {showBillModal && (
        <BillFormModal
            billForm={billForm}
            editingBill={editingBill}
            editingBillStatus={editingBillDisplayStatus}
            editingBillStatusClassName={getBillStatusClass(editingBillDisplayStatus ?? 'pending')}
            dueDateClassName={getDueDateClassName(
                editingBill?.status ?? 'pending',
                billForm.dueDate,
                todayValue,
            )}
            editingBillId={editingBillId}
            formError={formError}
            onClose={closeBillModal}
            onFormChange={(field, value) => setBillForm((current) => ({ ...current, [field]: value }))}
            onOpenPayment={(bill, initialChoice) => openPaymentModal([bill.id], initialChoice)}
            onMarkUnpaid={() => markBillsUnpaid(editingBillId ? [editingBillId] : [])}
            onDelete={() => {
                const billToDelete = bills.find((bill) => bill.id === editingBillId);
                if (billToDelete) {
                    setDeleteTarget(billToDelete);
                    closeBillModal();
                }
            }}
            onSave={saveBill}
        />
    )}

    {(deleteTarget || bulkDeleteIds.length > 0) && (
        <DeleteBillModal
            deleteTarget={deleteTarget}
            bulkDeleteIds={bulkDeleteIds}
            onClose={() => {
                setDeleteTarget(null);
                setBulkDeleteIds([]);
            }}
            onConfirm={confirmDeleteBill}
        />
    )}

    {paymentBillIds.length > 0 && (
        <PaymentModal
            paymentBillIds={paymentBillIds}
            bills={bills}
            paymentAccountDetails={paymentAccountDetails}
            savedCustomPaymentMethods={savedCustomPaymentMethods}
            paymentChoice={paymentChoice}
            customMethodInput={customMethodInput}
            paymentError={paymentError}
            isAmountHidden={isAmountHidden}
            onClose={closePaymentModal}
            onPaymentChoiceChange={setPaymentChoice}
            onCustomMethodInputChange={setCustomMethodInput}
            onMarkUnpaid={() => {
                markBillsUnpaid(paymentBillIds);
                closePaymentModal();
            }}
            onConfirm={confirmPayment}
        />
    )}
    </div>
);
};

export default Bills;