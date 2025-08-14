import { useState } from 'react'
import ModalWrapper from '@/wrapper/ModalWrapper'
import { useNavigate } from 'react-router-dom'
import CustomInputs from '@/components/inputs/CustomInputs'
import CustomDropdown from '@/components/inputs/CustomDropdown'
import { BankList, BankType } from '@/utils/BankList'
import SubmitButton from '@/components/button/SubmitButton'
import useInsertAccount from '@/hooks/accountHooks/useInsertAccount'
import { AccountType } from '@/types/AccountTypes'
import { useUserStore } from '@/store/useUserStore'
import { useAccountStore } from '@/store/useAccountStore'
const Deposit = () => {
const [bank, setBank] = useState<string>('');
const [amount, setAmount] = useState<string>('');
const {error, handleInsertAccount} = useInsertAccount();
const navigate = useNavigate()
const {user} = useUserStore()
const {account: accountStore,setAccount} =useAccountStore();

    const handleSubmit = async() =>{
        const selectedBank: BankType = BankList.filter((b:BankType)=> b.name === bank)[0]
        
        const account: AccountType = {
            account_name: selectedBank.name,
            account_key: selectedBank.key,
            account_code: selectedBank.code,
            amount: Number(amount),
            account_owner: user.id,
        }
        console.log(account)
        const res = await handleInsertAccount(account);

        const isExisting = accountStore.filter((acc)=> acc.account_code === selectedBank.code)
        
        if(isExisting.length > 0){
            isExisting[0].amount += Number(amount);
        } else{
            setAccount([
            ...accountStore, res
            ])
        }

        if(error) console.error(error);
        navigate(-1);
    }

  return (
    <ModalWrapper close={()=>navigate(-1)}>
        <div className='w-full rounded-xl px-4 bg-white  dark:bg-light-dark dark:text-white py-4'>
            <strong>Deposit</strong>
            {error}
            <CustomDropdown 
                options={BankList?.map((i)=>i.name)}
                onChange={(e)=>setBank(e)}
                isActive={true}
            />
            <CustomInputs
                value={amount}
                onChange={(e)=>setAmount(e)}
                type='number'
             />
            <SubmitButton
                onClick={handleSubmit}
                title='Okay'
            />
        </div>
    </ModalWrapper>
  )
}

export default Deposit
