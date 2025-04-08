import React,{ReactNode} from 'react'
import Header from '../components/header/Header'
import SideBar from '../components/sideBar/SideBar'
import { Outlet } from 'react-router-dom'
interface HomeLayoutProps {
    children: ReactNode
}
const HomeLayout = () => {
  return (
    <section className='flex'>
        <SideBar/>
        <div className='w-full h-screen ml-80'>
              <Header/>
              <Outlet/>
        </div>
      
    </section>
  )
}

export default HomeLayout
