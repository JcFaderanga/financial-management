import {useState} from 'react'
import { Link } from "react-router-dom";
import { FaChevronUp ,FaChevronDown } from "react-icons/fa6";
import type { ItemTypes } from '@/types/NavigationTypes';
import { useMenuStore } from "@/store/useMenuToggle";
const navChild= ({item}:ItemTypes) => {
     const [openDropdown, setOpenDropdown] = useState<string | null>(null);
     const {isMenuActive, setMenuIsActive} =useMenuStore();
     const isActive = location.pathname.startsWith(item.path);

     const toggleDropdown = (id: string) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
      };
      const menuToggle=()=>{
        if(window.innerWidth !< 1024){
            setMenuIsActive(!isMenuActive)
        }
    }
    return (
        <div key={item.id} className=" py-1 ">
        <button
            onClick={() => toggleDropdown(item.id)}
            className={`w-full px-4 cursor-pointer text-left text-sm rounded-lg transition-colors text-black flex justify-between items-center ${
            isActive ? "bg-blue-50 text-blue-500" : "hover:bg-gray-100"
            } px-0 py-1.5`}
        >
            {item.label}
            <span className="text-xs px-4">{openDropdown === item.id ? <FaChevronUp/>: <FaChevronDown/>}</span>
        </button>
        {openDropdown === item.id && item.children && (
            <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child: any) => {
                const isChildActive = location.pathname === child.path;
                return (
                <Link
                    key={child.id}
                    to={child.path}
                    onClick={menuToggle}
                    className={`block text-sm rounded-lg transition-colors text-black px-4 py-1 ${
                    isChildActive ? "bg-blue-100 text-blue-500" : "hover:bg-gray-100"
                    }`}
                >
                    {child.label}
                </Link>
                );
            })}
            </div>
        )}
        </div>
    );
          
}

export default navChild
