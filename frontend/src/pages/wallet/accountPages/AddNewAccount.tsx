import { useState } from 'react'
import ModalWrapper from '@/wrapper/ModalWrapper'
import { useNavigate } from 'react-router-dom'
import { IoWallet } from "react-icons/io5";
import { useAccountStore } from '@/store/useAccountStore';
import { BankList, BankType } from '@/utils/BankList';
import { useUserStore } from '@/store/useUserStore';
import { IoIosCloseCircle } from "react-icons/io";
import CustomInputs from '@/components/inputs/CustomInputs';
import { RiSearch2Fill } from "react-icons/ri";
import Deposit from './Deposit';

const AddNewAccount = () => {
  const navigate = useNavigate()
  const [selectedAccount, setSelectedAccount] = useState<any>([]);
  const { account } = useAccountStore();
  const { user } = useUserStore();
  const [isInnerModal, setIsInnerModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const showModal = (modalType: "deposit", account: BankType) => {

    const deposit = {
        account_name: account.name,
        account_key: account.key,
        account_code: account.code,
        account_owner: user?.id,
    }

    setSelectedAccount(deposit)
    setModalType(modalType);
    setIsInnerModal(true);
  }

  // 🔎 Filter banks by search input (case-insensitive)
  const filteredBanks = BankList.filter(acc =>
    acc.name.toLowerCase().includes(search.toLowerCase()) ||
    acc.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalWrapper close={() => navigate(-1)} classNameChild='h-full lg:py-10 fade-in'>
      <div className='bg-white dark:bg-dark lg:rounded-xl dark:text-white py-4 h-full'>
        <div className='px-4'>
          {/* Header */}
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
              <IoWallet size={30} />
              <strong className='text-xl'>Add New Account</strong>
            </div>
            <span className='text-gray-300' onClick={() => navigate(-1)}>
              <IoIosCloseCircle size={30} />
            </span>
          </div>
        </div>

        {/* Content container */}
        <div className='h-[97%] px-4 overflow-y-scroll '>
          <div className='sticky top-0 z-50 bg-white dark:bg-dark py-4'>
            {/* Search bar */}
            <div className='flex items-center px-4 py-1 bg-slate-100 dark:bg-light-dark rounded-4xl top-0 z-50'>
              <RiSearch2Fill size={30} className='text-slate-400' />
              <CustomInputs
                value={search}
                placeholder='Search'
                onChange={(e) => setSearch(e)}
                type='text'
                disabled={false}
                focus={false}
                className='!my-0 !px-1'
              />
            </div>
          </div>

          {/* Filtered list */}
          <div>
            {filteredBanks.length > 0 ? (
              filteredBanks.map((acc) => {
                const isAccountUsed = account.some((current) => current.account_code === acc.code);

                return (
                  <div
                    onClick={() =>
                      isAccountUsed
                        ? alert('You already have this account.')
                        : showModal('deposit', acc)
                    }
                    key={acc.code}
                    className={`${isAccountUsed && 'opacity-20'} py-4 border-b dark:border-light-dark cursor-pointer hover:dark:bg-medium-dark transition-all`}
                  >
                    <strong>{acc.name}</strong>
                  </div>
                )
              })
            ) : (
              <p className='text-center text-gray-500 py-6'>No results found</p>
            )}
          </div>
        </div>
      </div>

      {/* Inner modal */}
      {isInnerModal && (
        <ModalWrapper
          close={() => setIsInnerModal(false)}
          className='!items-end lg:!items-center'
          classNameChild='slide-up'
        >
          <div className='lg:px-4 dark:text-white'>
            {modalType === "deposit" && (
              <Deposit
                currentAccount={selectedAccount}
                exit={() => setIsInnerModal(false)}
              />
            )}
          </div>
        </ModalWrapper>
      )}
    </ModalWrapper>
  )
}

export default AddNewAccount
