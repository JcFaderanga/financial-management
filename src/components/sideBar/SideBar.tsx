
import { useMenuStore } from "@/store/useMenuToggle";
import LinkItem from "./LinkItem";
import { navItems } from "./NavPaths";
import { FaAlignRight } from "react-icons/fa6";
import { signOut } from '@/utils/authService'
const Sidebar = () => {
  const {isMenuActive,setMenuIsActive}= useMenuStore();
  const homePage = navItems.filter((item) => item.category === "homePage");
  // const reports = navItems.filter((item) => item.category === "reports");
  
  const handleMenuToggle=()=>{
    setMenuIsActive(!isMenuActive)
  }
  return (
    <section className={`fixed w-full top-0 lg:w-[18%] left-0 lg:fixed min-h-screen bg-white text-white p-4 border-r border-gray-300
    dark:bg-dark dark:border-medium-dark
    ${isMenuActive ? 'w-full block lg:hidden ' : 'hidden lg:block lg:w-80 '}
    `}>
      <div className="border h-14 dark:border-dark">
        <FaAlignRight onClick={handleMenuToggle} className='mr-4 cursor-pointer text-slate-500 lg:hidden float-end' size={20}/>
      </div>
      <nav className="flex flex-col space-y-1">
        <LinkItem navs={homePage} title="HOME PAGE" />
        {/* <LinkItem navs={reports} title="REPORTS" /> */}
      </nav>
      <button onClick={signOut} className="px-4 py-1 mt-20 text-sm bg-blue-100 rounded cursor-pointer text-dark">
        Sign Out
      </button>
    </section>
  );
};

export default Sidebar;
