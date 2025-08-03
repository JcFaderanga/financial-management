import Header from '../components/header/Header';
import SideBar from '../components/sideBar/SideBar';
import { Outlet } from 'react-router-dom';
import { useMenuStore } from '@/store/useMenuToggle';

const HomeLayout = () => {
  const { isMenuActive } = useMenuStore();

  return (
    <section className="flex">
      <div className={'relative z-50'}>
        <SideBar />
      </div>

      <div className={`w-full h-screen ${isMenuActive ? '' : 'lg:ml-[18%]'}`}>
        <div className={'relative z-40'}>
          <Header />
        </div>

        <div className="relative z-10 mt-16 h-full">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default HomeLayout;
