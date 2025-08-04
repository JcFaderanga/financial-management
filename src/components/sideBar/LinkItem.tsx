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
  const { isMenuActive, setMenuIsActive } = useMenuStore();
  const location = useLocation();

  const menuToggle = () => {
    if (window.innerWidth < 1024) {
      setMenuIsActive(!isMenuActive);
    }
  };

  return (
    <>
      <h1 className="px-4 text-sm font-bold text-slate-300">{title}</h1>
      {navs.map((item) => {
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
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors text-black dark:text-white ${
              isActive ? "bg-blue-100 text-blue-500  dark:bg-medium-dark" : "hover:bg-gray-100 dark:hover:bg-light-dark"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
};

export default LinkItem;
