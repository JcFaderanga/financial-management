import { useAccountStore } from '@/store/useAccountStore'
import { BankAccount } from '@/utils/BankAccountFormula'
import { addDays } from 'date-fns'
import { LongDateFormat } from '@/utils/DateFormat'
import NumberFlow from '@/components/UI/NumberFlow'
const PredictionCard = ({balance}:{balance: number}) => {

  const allocation = 200;
  const fundsLastUntil = Math.floor(balance / allocation);
  const balanceExhaustIn =  addDays(new Date(), balance / allocation)
  
  const fundsLastUntilColor = fundsLastUntil > 30 ? 'text-green-600' : 'text-orange-600';
  
  return (
    <div className='dark:text-white border dark:border-gray-800 rounded-2xl px-2 py-4'>
      <div className='w-full flex justify-between p-4'>
        <span>Available Balance</span>
        <strong className='text-green-600'>
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
            value={allocation}
            currency='php'
            style='currency'
          />
        </strong>
      </div>
      <div className='w-full flex justify-between p-4'>
        <span>Days until funds run out </span>
        <strong className={fundsLastUntilColor}>
          {fundsLastUntil} day/s
        </strong>
      </div>
      <div className='w-full flex justify-between p-4'>
        <span>Funds last until</span>
        <strong className={fundsLastUntilColor}>
          {String(LongDateFormat(balanceExhaustIn))}
        </strong>
      </div>
    </div>
  )
}


const PredictionSection = () => {
  const {account} = useAccountStore();
  const wallet = new BankAccount(account);
  const currentBalance = wallet.getAvailableBalance();


  return (
    <div className='lg:py-0 py-4'>
      <PredictionCard
        balance={currentBalance || 0}
      />
    </div>
  )
}

export default PredictionSection
