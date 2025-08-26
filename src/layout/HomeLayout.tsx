import Header from '../components/header/Header';
import SideBar from '../components/sideBar/SideBar';
import { Outlet } from 'react-router-dom';
import { useMenuStore } from '@/store/useMenuToggle';
import  BottomTabBar  from '@/components/bottomTab/BottomTabBar';
import { useEffect } from 'react';
import useFetchAllSpending from '@/hooks/spend_items/useFetchAllSpending';
import { useSpendings } from '@/store/useSpendingStore';
import {format} from 'date-fns'
import PageWrapper from '@/wrapper/PageWrapper';
const HomeLayout = () => {
  const { isMenuActive } = useMenuStore();
  const { handleFetchAllSpendings } = useFetchAllSpending();
  const { setSpendItems, spendings } = useSpendings();
  
  useEffect(() => {
      const fetchSpendings = async () => {
        const res = await handleFetchAllSpendings(format(new Date(),"yyyy-MM-dd"));     //convert date to yyyy-mm-dd, e.g. 2025-08-01
        if (res) {
          setSpendItems?.(res);
        }
      };  
      if (!spendings) fetchSpendings();
  }, []);


  return (
    <>
      <section className="flex transition-all dark:bg-dark bg-[--color-gradient]">
        <div className={'relative z-50 hidden lg:block'}>
          <SideBar />
        </div>

        <div className={`w-full h-screen ${isMenuActive ? 'lg:ml-16' : 'lg:ml-[14%]'} transition-all`}>
          <div className={'relative z-40 hidden lg:block transition-all'}>
            <Header />
          </div>

          <div className="relative z-10 h-[calc(100% - 64px)] lg:mt-16 dark:bg-dark">
            <PageWrapper>
              <Outlet />
            </PageWrapper>
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
