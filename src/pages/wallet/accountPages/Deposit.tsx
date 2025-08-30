import { useState } from 'react'
// import CustomInputV2 from '@/components/inputs/CustomInputV2'
import SubmitButton from '@/components/button/SubmitButton'
import { AccountType } from '@/types/AccountTypes'
import { useAccountStore } from '@/store/useAccountStore'
import CustomInputs from '@/components/inputs/CustomInputs'
import supabase from '@/lib/supabase'


const Deposit = ({currentAccount, exit}:{currentAccount: AccountType, exit: ()=> void}) => {
const [newAmount, setNewAmount] = useState<string>('');
const [loading, setLoading] = useState<boolean>(false)
const {account: accountStore} =useAccountStore();

    async function updateAmount(){
        setLoading(true)
        const sumOfAmount = Number(currentAccount.amount) + Number(newAmount)

        const updatedAccount = { 
            ...currentAccount,
             amount: sumOfAmount
        }

        const currentAccountStored = accountStore?.filter((acc)=> acc.account_code === currentAccount.account_code)[0];
        currentAccountStored.amount = sumOfAmount;

        await supabase
            .from('accounts')
            .update(updatedAccount)
            .eq('account_code', currentAccount.account_code)
            .eq('account_owner', currentAccount.account_owner )
        setLoading(false)
        exit();
    }

  return (
    <div className='w-full mx-auto pb-10 flex flex-col gap-2 rounded-t-2xl lg:rounded-xl px-4 bg-white  dark:bg-dark dark:text-white py-4'>
        <div className='flex justify-between'>
            <strong>DEPOSIT</strong>
            <strong>{currentAccount.account_code}</strong>
        </div>
        
        <CustomInputs
            value={newAmount}
            onChange={(e)=>setNewAmount(e)}
            type='number'
            placeholder='Enter deposit amount'
            className='text-center'
            />
        <SubmitButton
            onClick={updateAmount}
            spinner={loading}
            disabled={loading}
            title='Save'
        />
    </div>
  )
}

export default Deposit
