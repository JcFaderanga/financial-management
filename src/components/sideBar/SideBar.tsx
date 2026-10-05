
import { useMenuStore } from "@/store/useMenuToggle";
import LinkItem from "./LinkItem";
import { navItems } from "./NavPaths";
import { FaAlignRight } from "react-icons/fa6";

const Sidebar = () => {
  const {isMenuActive,setMenuIsActive}= useMenuStore();
  const homePage = navItems.filter((item) => item.category === "homePage");
  // const reports = navItems.filter((item) => item.category === "reports");
  
  const handleMenuToggle=()=>{
    setMenuIsActive(!isMenuActive)
  }
  return (
    <section className={`hidden lg:w-40 min-h-screen bg-white text-white p-4 border-r border-gray-300
    dark:bg-dark dark:border-medium-dark overflow-hidden
    ${isMenuActive ? '!w-16' : 'hidden lg:block lg:w-60'}
    `}>
      <div className=" h-14">
        <FaAlignRight onClick={handleMenuToggle} className='mr-4 cursor-pointer text-slate-500 lg:hidden float-end' size={20}/>
      </div>
      <nav className="flex flex-col space-y-1">
        <LinkItem navs={homePage} title="" />
        {/* <LinkItem navs={reports} title="REPORTS" /> */}
      </nav>
      
    </section>
  );
}; 

export default Sidebar;
