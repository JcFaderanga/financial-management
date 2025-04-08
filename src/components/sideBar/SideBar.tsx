import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
const navItems = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard" },
  { id: "accounts", label: "Accounts", path: "/accounts" },
  { id: "bills", label: "Bills", path: "/bills" },
  { id: "liabilities", label: "Liabilities", path: "/liabilities" },
  { id: "transactions", label: "Transactions", path: "/transaction" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <section className="fixed w-80 min-h-screen text-white p-4 border-r border-gray-300 ">
      <div className="h-14"></div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`px-4 py-1 text-sm rounded-lg transition-colors text-black ${
                isActive ? "bg-blue-200 text-blue-600" : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default Sidebar;
