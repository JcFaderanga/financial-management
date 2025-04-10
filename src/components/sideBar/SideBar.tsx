
import { useMenuStore } from "@/store/useMenuToggle";
import LinkItem from "./LinkItem";
import { navItems } from "./NavPaths";
import { FaAlignRight } from "react-icons/fa6";

const Sidebar = () => {
  const {isMenuActive,setMenuIsActive}= useMenuStore();
  const homePage = navItems.filter((item) => item.category === "homePage");
  const reports = navItems.filter((item) => item.category === "reports");
  
  const handleMenuToggle=()=>{
    setMenuIsActive(!isMenuActive)
  }
  return (
    <section className={`absolute w-full top-0 lg:w-80 left-0 lg:fixed min-h-screen bg-white text-white p-4 border-r border-gray-300
    ${isMenuActive ? 'w-full block lg:hidden ' : 'hidden lg:block lg:w-80 '}
    `}>
      <div className="h-14 border ">
        <FaAlignRight onClick={handleMenuToggle} className='text-slate-500 mr-4 cursor-pointer lg:hidden float-end' size={20}/>
      </div>
      <nav className="flex flex-col space-y-1">
        <LinkItem navs={homePage} title="HOME PAGE" />
        <LinkItem navs={reports} title="REPORTS" />
      </nav>
    </section>
  );
};

export default Sidebar;
