import { useState } from 'react';
import supabase from '@/lib/supabase';
import { AccountType } from '@/types/AccountTypes';

const useInsertAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInsertAccount = async (acc: AccountType) => {
    try {
      setLoading(true);
      setError('');

      const query = supabase.from('accounts');

      // 1️⃣ Check if account with same code already exists
      const { data: existingData, error: fetchError } = await query
        .select('*')
        .eq('account_code', acc.account_code)
        .eq('account_owner', acc.account_owner)
        .maybeSingle();

      if (fetchError) throw new Error(fetchError.message);

      if (existingData) {

        // 2️⃣ Update existing account
        const updatedAmount = Number(existingData.amount) + Number(acc.amount);
        
        const { data, error: updateError } = await query
          .update({ ...acc, amount: updatedAmount })
          .eq('account_code', existingData.account_code)
          .eq('account_owner', acc.account_owner )
          .select()
          .maybeSingle();

        if (updateError) throw new Error(updateError.message);
        return data;
        
      } else {
        // 3️⃣ Insert new account
        const { data, error: insertError } = await query
          .insert(acc)
          .select()
          .maybeSingle();

        if (insertError) throw new Error(insertError.message);
        return data;
        
      }
    } catch (err: any) {
      console.error('Error inserting/updating account:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleInsertAccount };
};

export default useInsertAccount;
