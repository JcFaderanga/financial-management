import SubmitButton from '@/components/button/SubmitButton';
import ModalWrapper from '@/wrapper/ModalWrapper';
import type { Bill } from '../types';

type DeleteBillModalProps = {
    deleteTarget: Bill | null;
    bulkDeleteIds: string[];
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteBillModal = ({
    deleteTarget,
    bulkDeleteIds,
    onClose,
    onConfirm,
}: DeleteBillModalProps) => (
    <ModalWrapper
        close={onClose}
        className="px-4"
        classNameChild="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-medium-dark dark:text-white"
    >
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-dark dark:text-white">
                {bulkDeleteIds.length > 0 ? 'Delete Bills' : 'Delete Bill'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
                {bulkDeleteIds.length > 0
                    ? `Are you sure you want to delete these ${bulkDeleteIds.length} items? This action cannot be undone.`
                    : <>Are you sure you want to delete <span className="font-semibold">{deleteTarget?.name}</span>? This action cannot be undone.</>}
            </p>
            {bulkDeleteIds.length > 0 && (
                <p className="text-sm font-semibold text-dark dark:text-white">({bulkDeleteIds.length}) items</p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-dark dark:border-light-dark dark:text-white"
                >
                    Cancel
                </button>
                <SubmitButton
                    title="Delete"
                    onClick={onConfirm}
                    className="bg-red-500 hover:bg-red-600 sm:w-auto"
                />
            </div>
        </div>
    </ModalWrapper>
);

export default DeleteBillModal;
