import LinkItem from '../sideBar/LinkItem';
import { navItems } from '../sideBar/NavPaths';
export const BottomTabBar = () => {
    const homePage = navItems.filter((item) => item.category === "homePage");
  return (
    <div className='fixed bottom-0 w-full left-0 h-18 py-2 bg-white rounded-t-2xl dark:bg-light-dark box-shadow'>
        <nav className="flex space-y-1 justify-evenly">
        <LinkItem navs={homePage} title="" /> 
      </nav>
    </div>
  )
}

export default BottomTabBar;