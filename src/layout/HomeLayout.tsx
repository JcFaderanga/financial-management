import Header from '../components/header/Header';
import SideBar from '../components/sideBar/SideBar';
import { Outlet } from 'react-router-dom';
import { useMenuStore } from '@/store/useMenuToggle';
import CustomModal from '@/components/modal/CustomModal';
import { useModal } from '@/store/useModal';
import  BottomTabBar  from '@/components/bottomTab/BottomTabBar';
const HomeLayout = () => {
  const { isMenuActive } = useMenuStore();
  const {isModal, children} = useModal();
  return (
    <>
      <CustomModal hidden={isModal} children={children}/>
      <section className="flex transition dark:bg-dark">
        <div className={'relative z-50 hidden lg:block'}>
          <SideBar />
        </div>

        <div className={`w-full h-screen ${isMenuActive ? '' : 'lg:ml-[18%]'}`}>
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
