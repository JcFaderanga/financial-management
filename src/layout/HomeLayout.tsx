import Header from '../components/header/Header';
import SideBar from '../components/sideBar/SideBar';
import { Outlet } from 'react-router-dom';
import { useMenuStore } from '@/store/useMenuToggle';
import CustomModal from '@/components/modal/CustomModal';
import CustomModalFullScreen from '@/components/modal/CustomModalFullScreen';
import { useModal, useModalFull } from '@/store/useModal';
import  BottomTabBar  from '@/components/bottomTab/BottomTabBar';
import { useEffect } from 'react';
import useFetchAllSpending from '@/hooks/spend_items/useFetchAllSpeding';
import { useSpendings } from '@/store/useSpendingStore';
import {format} from 'date-fns'
import { useAccountStore } from '@/store/useAccountStore';
import useFetchAllAccount from '@/hooks/accountHooks/useFetchAllAccount';


const HomeLayout = () => {
  const { isMenuActive } = useMenuStore();
  const {isModal, children} = useModal();
  const {isModalFS, children: ChildFS} = useModalFull();
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setSpendItems, spendings } = useSpendings();
  const { setAccount } = useAccountStore();
  const { account } = useFetchAllAccount();

  useEffect(() => {
      
      const fetch = async () => {
        const res = await handleFetchAllSpendings(format(new Date(),"yyyy-MM-dd"));     //convert date to yyyy-mm-dd, e.g. 2025-08-01
        if (res) {
          setSpendItems?.(res);
        }
      };
  
      if (!spendings) {
        fetch();
      }
      
  }, []);

  useEffect(() => {
    setAccount(account);
  }, [account, setAccount]);


  return (
    <>
      <CustomModal hidden={isModal} children={children}/>
      <CustomModalFullScreen hidden={isModalFS} children={ChildFS}/>
      <section className="flex transition dark:bg-dark">
        <div className={'relative z-50 hidden lg:block'}>
          <SideBar />
        </div>

        <div className={`w-full h-screen ${isMenuActive ? 'lg:ml-16' : 'lg:ml-[14%]'}`}>
          <div className={'relative z-40 hidden lg:block'}>
            <Header />
          </div>

          <div className="relative z-10 h-[calc(100% - 64px)] lg:mt-16 dark:bg-dark">
            <Outlet />
          </div>
        </div>
        <div className={'relative z-50 lg:hidden'}>
          <BottomTabBar />
        </div>
      </section>
    </>
  );
};

export default HomeLayout;
