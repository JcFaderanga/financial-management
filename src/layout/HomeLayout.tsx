import Header from '../components/header/Header';
import SideBar from '../components/sideBar/SideBar';
import { Outlet } from 'react-router-dom';
import PageWrapper from '@/wrapper/PageWrapper';
import  BottomTabBar  from '@/components/bottomTab/BottomTabBar';
const HomeLayout = () => {
    return (
        <section className="h-screen flex overflow-hidden">
            <SideBar />

            <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 min-h-0 min-w-0 overflow-auto">
                    <PageWrapper>
                        <Outlet />
                    </PageWrapper>
                </main>
            </div>

            <div className='lg:hidden'>
                <BottomTabBar />
            </div>
        </section>
    );
};

export default HomeLayout;