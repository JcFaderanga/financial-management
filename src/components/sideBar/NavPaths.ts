import { NavType } from "@/types/NavigationTypes";

export const navItems: NavType[] = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", category: "homePage" },
    {
      id: "accounts",
      label: "Accounts",
      path: "/accounts",
      category: "homePage",
      children: [
        { id: "bank", label: "Bank Accounts", path: "/accounts/banks", category: "homePage" },
        { id: "socials", label: "Socials Account", path: "/accounts/socials", category: "homePage" },
      ],
    },
    { id: "bills", label: "Bills", path: "/bills", category: "homePage" },
    { id: "liabilities", label: "Liabilities", path: "/liabilities", category: "homePage" },
    { id: "transactions", label: "Transactions", path: "/transaction", category: "reports" },
  ];
  