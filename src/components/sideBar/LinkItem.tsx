import { Link, useLocation } from "react-router-dom";
import type { NavType } from "@/types/NavigationTypes";
import NavChild from "./navChild";
import { useMenuStore } from "@/store/useMenuToggle";
const LinkItem = ({
    navs,
    title,
  }: {
    navs: NavType[];
    title: string;
  }) => {
    const {isMenuActive, setMenuIsActive} =useMenuStore();
    const location = useLocation();  

    const menuToggle=()=>{
        if(window.innerWidth !< 1024){
            setMenuIsActive(!isMenuActive)
        }
    }
    
    return (
      <>
        <h1 className="text-slate-300 font-bold px-4 text-sm">{title}</h1>
        {navs.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          // if item has children — render dropdown
          if (item.children) {
            return (
              <NavChild item={item}/>
            );
          }
  
          // Regular nav item
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={menuToggle}
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors text-black ${
                isActive ? "bg-blue-100 text-blue-500" : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </>
    );
  };

export default LinkItem
