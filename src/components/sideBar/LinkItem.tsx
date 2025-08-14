import { Link, useLocation } from "react-router-dom";
import type { NavType } from "@/types/NavigationTypes";
import NavChild from "./navChild";
import { useMenuStore } from "@/store/useMenuToggle";
import { IoSettings } from "react-icons/io5";
import { FaChartPie ,FaWallet } from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";
import { HiMenuAlt3 } from "react-icons/hi";

const LinkItem = ({
  slice,
  navs,
  title,
}: {
  slice?: any;
  navs: NavType[];
  title: string;
}) => {
  const { isMenuActive, setMenuIsActive } = useMenuStore();
  const location = useLocation();

  const menuToggle = () => {
    if (window.innerWidth < 1024) {
      setMenuIsActive(!isMenuActive);
    }
  };

  
const icon:any = {
  overview: <RiFileList3Fill />, 
  Analytics: <FaChartPie/>,
  wallet: <FaWallet/>,
  settings: <IoSettings/>,
  more: <HiMenuAlt3/>
};
  

  return (
    <>
    {
      title && <h1 className="px-4 text-sm font-bold text-slate-300">{title}</h1>
    }
      {navs?.slice(slice?.[0],slice?.[1]).map((item) => {
        const isActive = location.pathname.startsWith(item.path);

        if (item.children) {
          return <NavChild key={item.id} item={item} />;
        }

        return (
          <Link
            key={item.id}
            to={item.path}
            onClick={menuToggle}
            aria-current={isActive ? "page" : undefined}
            className={` py-1.5 text-sm rounded-lg transition-colors text-medium-dark dark:text-white ${
              isActive ? "!text-yellow-500 " : "hover:bg-gray-100 dark:hover:bg-light-dark"
            }`}
          >
            
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start w-14 lg:px-1">
              <div className="text-2xl ">{icon[item.id]}</div>
              <div className="text-xs lg:px-7">{item.label}</div>
            </div>
            
          </Link>
        );
      })}
    </>
  );
};

export default LinkItem;
