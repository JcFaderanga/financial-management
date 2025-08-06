import LinkItem from '../sideBar/LinkItem';
import { navItems } from '../sideBar/NavPaths';
import { FaPlus } from "react-icons/fa6";
import AddItem from '../dashboard/addItem/AddItem';
import { useModal } from '@/store/useModal';
export const BottomTabBar = () => {
    const homePage = navItems.filter((item) => item.category === "homePage");
    const {setModal,setChild, isModal} = useModal();
  return (
    <div className='fixed bottom-0 w-full left-0 h-16 rounded-t-2xl py-2 bg-white  dark:bg-light-dark box-shadow'>
        <nav className="flex space-y-1 justify-evenly">
        <LinkItem navs={homePage} title="" slice={[0,2]} /> 
        <div 
            onClick={() => {setModal(!isModal); setChild(<AddItem />)}}
            className='lg:hidden -mt-8 h-14 w-14 rounded-full bg-yellow-500  flex justify-center items-center shadow-md'>
          <FaPlus size={22}/>
        </div>
        <LinkItem navs={homePage} title="" slice={[2,4]} /> 
      </nav>
    </div>
  )
}

export default BottomTabBar;