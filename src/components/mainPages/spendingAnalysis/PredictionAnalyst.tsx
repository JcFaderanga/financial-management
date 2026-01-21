import { useAccountStore } from '@/store/useAccountStore'
import { BankAccount } from '@/utils/BankAccountFormula'
import { addDays } from 'date-fns'
import { LongDateFormat } from '@/utils/DateFormat'
import NumberFlow from '@/components/UI/NumberFlow'
const PredictionCard = ({balance}:{balance: number}) => {

  const balanceExhaustIn =  addDays(new Date(), balance / 300)
  
  return (
    <div className='dark:text-white dark:bg-medium-dark rounded-2xl'>
      <div className='w-full flex justify-between p-4'>
        <span>Available Balance</span>
        <strong>
          <NumberFlow
            value={balance}
            currency='php'
            style='currency'
          />
        </strong>
      </div>
      <div className='w-full flex justify-between p-4'>
        <span>Daily allocated spending</span>
        <strong>
          <NumberFlow
            value={300}
            currency='php'
            style='currency'
          />
        </strong>
      </div>
      <div className='w-full flex justify-between p-4'>
        <span>Days until funds run out </span>
        <strong>{Math.floor(balance / 300)} day/s</strong>
      </div>
      <div className='w-full flex justify-between p-4'>
        <span>Funds last until</span>
        <strong>{String(LongDateFormat(balanceExhaustIn))}</strong>
      </div>
    </div>
  )
}


const PredictionSection = () => {
  const {account} = useAccountStore();
  const wallet = new BankAccount(account);
  const currentBalance = wallet.getAvailableBalance();


  return (
    <div className='py-2'>
      <PredictionCard
        balance={currentBalance || 0}
      />
    </div>
  )
}

export default PredictionSection
