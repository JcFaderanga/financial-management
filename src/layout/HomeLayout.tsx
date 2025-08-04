import Header from '../components/header/Header';
import SideBar from '../components/sideBar/SideBar';
import { Outlet } from 'react-router-dom';
import { useMenuStore } from '@/store/useMenuToggle';

const HomeLayout = () => {
  const { isMenuActive } = useMenuStore();

  return (
    <section className="flex transition dark:bg-dark">
      <div className={'relative z-50'}>
        <SideBar />
      </div>

      <div className={`w-full h-screen ${isMenuActive ? '' : 'lg:ml-[18%]'}`}>
        <div className={'relative z-40'}>
          <Header />
        </div>

        <div className="relative z-10 h-[calc(100% - 64px)] mt-16 dark:bg-dark">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default HomeLayout;
