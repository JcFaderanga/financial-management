import Header from '../components/header/Header'
import SideBar from '../components/sideBar/SideBar'
import { Outlet } from 'react-router-dom'
import { useMenuStore } from '@/store/useMenuToggle'
const HomeLayout = () => {
  const {isMenuActive} =useMenuStore();
  return (
    <section className='flex'>
      <div className=''>
          <SideBar/>
      </div>
        <div className= {`w-full h-screen ${isMenuActive ? '' : 'lg:ml-80'} `}>
              <Header/>
              <div className=''>
                <Outlet/>
              </div>
              
        </div>
    </section>
  )
}

export default HomeLayout
