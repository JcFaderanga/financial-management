import { useState } from 'react';
import supabase from '@/lib/supabase';
import type { itemTypes } from '@/types/itemTypes';
import { useAccountStore } from '@/store/useAccountStore';

import { BankList } from '@/utils/BankList';
import useTransactionDetails from '../transactionHistory/useTransactionDetails';

const useSaveItem = () => {
  const [spendings, setSpendings] = useState<itemTypes[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const { account } = useAccountStore();
  const {setTransaction} = useTransactionDetails();
  const handleSaveItem = async (item: itemTypes) => {
    setLoading(true);
    setError(null);

    try {
      // --- 1. Insert new spending ---
      const { data: insertedItem, error: insertError } = await supabase
        .from('items')
        .insert(item)
        .select()
        .maybeSingle();

      if (insertError) {
        setError(insertError);
        return null;
      }

      // --- 2. Fetch bank account from DB ---
      const accountQuery = supabase.from('accounts');
      const { data: existingAccount, error: fetchError } = await accountQuery
        .select('*')
        .eq('account_code', item.mode_of_payment)
        .eq('account_owner', item.owner)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError);
        return null;
      }

      // --- 3. Update local account store ---
      const isExisting = account.filter(
        (acc) => acc?.account_code === item?.mode_of_payment
      );

      if (isExisting.length > 0) {
        isExisting[0].amount -= Number(item?.price);
      }

      // --- 4. Update account in DB ---
      const updatedAmount = Number(existingAccount?.amount) - Number(item.price);
      const { error: updateError } = await accountQuery
        .update({
          ...existingAccount,
          amount: updatedAmount,
        })
        .eq('account_code', item.mode_of_payment)
        .eq('account_owner', item.owner)
        .select()
        .maybeSingle();

      if (updateError) {
        setError(updateError);
        return null;
      }

      // --- 5. Record transaction ---
      const bank = BankList.find((b:any)=> b.code === item?.mode_of_payment)
      const details = {
          transaction_type: 'activity',
          transaction_detail: {
              prev_amount: existingAccount?.amount,
              new_amount: updatedAmount,
              delta_amount: Number(updatedAmount) - Number(existingAccount?.amount),
              item_id: insertedItem.id,
            },
          bank_key: bank?.key,
          created_at: item.created_at,
      }

      const transactionInfo = setTransaction(details); 

      const {data: recentTransaction, error: transactionError} = await supabase
      .from('transaction')
      .insert(transactionInfo)
      .select()
      .maybeSingle();
      if (transactionError) {
        setError(transactionError);
        throw new Error("error ngani")
      }

      const fullData = {
        ...recentTransaction,
            transaction_detail: {
                ...recentTransaction.transaction_detail,
                item_details: insertedItem,
            },
      }

      // --- 6. Final state update ---
      setSpendings(insertedItem);
      return fullData;

    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { spendings, error, loading, handleSaveItem };
};

export default useSaveItem;
