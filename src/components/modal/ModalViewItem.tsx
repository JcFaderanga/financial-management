import { useLocation, useNavigate } from 'react-router-dom';
import ModalWrapper from '@/wrapper/ModalWrapper';
import { CategoryIcon } from '@/utils/DropDownList';
import { itemTypes } from '@/types/itemTypes';
import { format } from 'date-fns';
import CustomInputV2 from '../inputs/CustomInputV2';
import { IoCheckmark } from 'react-icons/io5';
import { LuPencil } from 'react-icons/lu';
import { useState } from 'react';
import supabase from '@/lib/supabase';
import { useSpendings } from '@/store/useSpendingStore';

export default function ModalSpentEdit() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const data: itemTypes | undefined = state?.data;

  if (!data) {
    return (
      <ModalWrapper close={() => navigate(-1)}>
        <div className="p-4">No data provided.</div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper close={() => navigate(-1)}>
      <div className="bg-white dark:bg-medium-dark rounded-xl p-4 dark:text-white">
        <div className="flex items-center justify-between">
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white px-1 rounded-full">
              {CategoryIcon[data.category!] ?? '❓'}
            </span>
            <span className="font-bold">{data.category}</span>
          </div>

          {/* Date */}
          <p className="text-sm font-semibold md:text-base">
            {format(new Date(data.created_at), 'MMMM d, yyyy')}
          </p>
        </div>

        <div className="py-4 flex flex-col gap-2">
          <ItemRow title="Specification" description={data.sub_category} id={data.id} />
          <ItemRow title="Title" description={data.title} id={data.id} />
          <ItemRow title="Price" description={data.price} id={data.id} />
        </div>
      </div>
    </ModalWrapper>
  );
}

const ItemRow = ({
  title,
  description,
  id,
}: {
  title: string;
  description: string | number | undefined;
  id: string | number | undefined;
}) => {
  const [toEdit, setToEdit] = useState(false);
  const [value, setValue] = useState<string>(
    description !== undefined ? String(description) : ''
  );

  const {setSpendItems, spendings} = useSpendings();
  const save = async () => {

    if (!id) return;

    const colTitle =
      title === 'Specification' ? 'sub_category' : title.toLowerCase();

    const { error,data } = await supabase
      .from('items')
      .update({ [colTitle]: value })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating:', error);
       
    } else if (data && data.length > 0) {
        // Replace the updated item in the local state
        const updatedItem = data[0];

        const updatedSpendings = spendings.map((spending: itemTypes) =>
            spending.id === updatedItem.id ? updatedItem : spending
        );

        setSpendItems(updatedSpendings);
    } else {
      setToEdit(false);
    }
  };

  return (
    <div className="py-2 px-4 rounded-xl bg-light-dark">
      <p className="md:text-base text-sm text-gray-400">{title}</p>
      <div className="flex items-center">
        <CustomInputV2
          onChange={(e) => setValue(e)}
          value={value}
          type="text"
          disabled={!toEdit}
        />

        <div
          className="ml-2 p-3 bg-gray-200 dark:bg-dark rounded-xl h-fit cursor-pointer"
          onClick={() => {
            if (toEdit) {
              save();
              setToEdit(false);
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
};
