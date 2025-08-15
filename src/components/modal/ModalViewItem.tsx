import { useCallback, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { IoCheckmark } from 'react-icons/io5';
import { LuPencil } from 'react-icons/lu';

import ModalWrapper from '@/wrapper/ModalWrapper';
import CustomInputV2 from '../inputs/CustomInputV2';
import SubmitButton from '../button/SubmitButton';
import { CategoryIcon } from '@/utils/DropDownList';
import { itemTypes } from '@/types/itemTypes';
import supabase from '@/lib/supabase';
import { useSpendings } from '@/store/useSpendingStore';

// =======================
// Main Component
// =======================
export default function ModalSpentEdit() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setSpendItems, spendings } = useSpendings();

  const [isDelete, setIsDelete] = useState(false);
  const data: itemTypes | undefined = state?.data;

  const handleDelete = useCallback(async () => {
    if (!data?.id) return;

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', data.id);

    if (error) {
      console.error(error);
      return;
    }

    const latest = spendings.filter((item: itemTypes) => item.id !== data.id);
    setSpendItems(latest);
    navigate(-1);
  }, [data, spendings, setSpendItems, navigate]);

  if (!data) {
    return (
      <ModalWrapper close={() => navigate(-1)}>
        <div className="p-4">No data provided.</div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper close={() => navigate(-1)} className='px-4'> 
      <div className="bg-white dark:bg-medium-dark rounded-xl p-4 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white px-1 rounded-full">
              {CategoryIcon[data.category!] ?? '❓'}
            </span>
            <span className="font-bold">{data.category}</span>
          </div>
          <p className="text-sm font-semibold md:text-base">
            {format(new Date(data.created_at), 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Editable Fields */}
        <div className="py-4 flex flex-col gap-2">
          <ItemRow title="Specification" description={data.sub_category} id={data.id} />
          <ItemRow title="Title" description={data.title} id={data.id} />
          <ItemRow title="Price" description={data.price} id={data.id} />
        </div>

        {/* Delete Section */}
        <div className="py-2">
          {isDelete ? (
            <>
              <strong className="text-md">
                Do you want to permanently delete this item?
              </strong>
              <div className="flex gap-2 py-2">
                <SubmitButton onClick={handleDelete} title="Yes" className="bg-red-400" />
                <SubmitButton
                  onClick={() => setIsDelete(false)}
                  title="Cancel"
                  className="bg-transparent border"
                />
              </div>
            </>
          ) : (
            <SubmitButton
              onClick={() => setIsDelete(true)}
              title="Delete"
              className="bg-transparent border"
            />
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

// =======================
// Sub Component: ItemRow
// =======================
function ItemRow({
  title,
  description,
  id,
}: {
  title: string;
  description: string | number | undefined;
  id: string | number | undefined;
}) {
  const { setSpendItems, spendings } = useSpendings();
  const [toEdit, setToEdit] = useState(false);
  const [value, setValue] = useState(
    description !== undefined ? String(description) : ''
  );

  // Store original value that won't reset on re-renders
  const originalValueRef = useRef(
    description !== undefined ? String(description) : ''
  );

  const save = useCallback(async () => {
    if (!id) return;

    // Prevent update if value hasn't changed
    if (value.trim() === originalValueRef.current.trim()) {
      setToEdit(false);
      return;
    }

    const colTitle =
      title === 'Specification' ? 'sub_category' : title.toLowerCase();

    const { error, data } = await supabase
      .from('items')
      .update({ [colTitle]: value })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating:', error);
      return;
    }

    if (data && data.length > 0) {
      const updatedItem = data[0];
      const updatedSpendings = spendings.map((spending: itemTypes) =>
        spending.id === updatedItem.id ? updatedItem : spending
      );
      setSpendItems(updatedSpendings);

      // Update stored original value so next edits compare correctly
      originalValueRef.current = value;
    }

    setToEdit(false);
  }, [value, id, title, spendings, setSpendItems]);

  return (
    <div className="py-2 px-4 rounded-xl bg-light-dark">
      <p className="md:text-base text-sm text-gray-400">{title}</p>
      <div className="flex items-center w-full">
        <CustomInputV2
          onChange={setValue}
          value={value}
          placeholder="item"
          type="text"
          disabled={!toEdit}
        />
        <div
          className="ml-2 p-3 bg-gray-200 dark:bg-dark rounded-xl h-fit cursor-pointer"
          onClick={() => {
            if (toEdit) {
              save();
            } else {
              setToEdit(true);
            }
          }}
        >
          {toEdit ? <IoCheckmark /> : <LuPencil />}
        </div>
      </div>
    </div>
  );
}
