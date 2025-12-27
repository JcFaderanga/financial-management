import { useState } from 'react'
// import CustomInputV2 from '@/components/inputs/CustomInputV2'
import SubmitButton from '@/components/button/SubmitButton'
import { AccountType } from '@/types/AccountTypes'
import { useAccountStore } from '@/store/useAccountStore'
import CustomInputs from '@/components/inputs/CustomInputs'
import { AccountBalance } from '@/hooks/accountHooks/accountControls'
import supabase from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'
import { TransactionInfoType } from '@/types/AccountTypes'
import TransactionDetails from '@/hooks/transactionHistory/transactionDetails'
const Deposit = ({currentAccount, exit}:{currentAccount: AccountType, exit: ()=> void}) => {
const [newAmount, setNewAmount] = useState<string>('');
const [loading, setLoading] = useState<boolean>(false)
const {account: accountStore, setAccount} =useAccountStore();
const [error, setError] = useState<string>('');
const {user} = useUserStore();

    async function updateAmount(){

        if(!newAmount || newAmount === "0"){
            setError('Deposit cannot be empty or 0.')
            return;
        }

        setLoading(true)

        try{
            const sumOfAmount = Number(currentAccount.amount || 0) + Number(newAmount)
            const updatedAccount = { ...currentAccount, amount: sumOfAmount }

            const transactionInfo: TransactionInfoType = TransactionDetails({
                userId: user.id,
                transaction_type: 'deposit',
                transaction_detail: {
                    prev_amount: currentAccount?.amount,
                    new_amount: sumOfAmount,
                    delta_amount: Number(sumOfAmount) - Number(currentAccount?.amount),
                },
                bank_key: currentAccount.account_key,
            })

            const account = new AccountBalance(updatedAccount)

            if(currentAccount.amount || currentAccount.amount <= 0 ){
                const currentAccountStored = accountStore?.filter((acc)=> acc.account_code === currentAccount.account_code)[0];
                currentAccountStored.amount = sumOfAmount;

                const {error} = await account.useUpdateBalance(currentAccount)
                if(error){
                    setError(error.message);
                    return;
                } 
                try{
  
                    const {error} = await supabase
                    .from('transaction')
                    .insert(transactionInfo)

                    if(error) throw new Error(error.message); 
                } catch(error: any){
                    setError(error.message);
                    throw new Error(error.message)
                }
               
            }else{
                const {error, data} = await account.useDeposit()
                if(error){
                    setError(error.message);
                    return;
                } 

                setAccount([...accountStore, data])
            }   
            
            
            
            setLoading(false)
            exit();
        
        }catch(e: any){
            setError(e.message);
            throw new Error(e.message)
        }   
    }

  return (
    <div className='w-full mx-auto pb-10 flex flex-col gap-2 rounded-t-2xl lg:rounded-xl px-4 bg-white  dark:bg-dark dark:text-white py-4'>
        <div className='flex justify-between'>
            <strong>DEPOSIT</strong>
            <strong>{currentAccount.account_code}</strong>
        </div>
        <span className='text-red-600'>{error}</span>
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
