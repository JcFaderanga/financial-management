import type { NavType } from "@/types/NavigationTypes";
export const navItems: NavType[] = [

    { id: "overview", label: "Records", path: "/dashboard/overview", category: "homePage" },
    { id: "Analytics", label: "Analytics", path: "/dashboard/spending_analysis", category: "homePage" },
    { id: "settings", label: "Settings", path: "/liabilities", category: "homePage" },
    { id: "more", label: "More", path: "/transaction", category: "homePage" },
    // { 
    //   id: "dashboard",
    //   label: "Dashboard",
    //   path: "/dashboard",
    //   category: "homePage",
    //   children: [
    //     { id: "overview", label: "Overview", path: "/dashboard/overview", category: "homePage" },
    //     { id: "spedingCalendar", label: "Spending Analysis", path: "/dashboard/spending_analysis", category: "homePage" },
    //   ],
    // },
    // {
    //   id: "accounts",
    //   label: "Accounts",
    //   path: "/accounts",
    //   category: "homePage",
    //   children: [
    //     { id: "bank", label: "Bank Accounts", path: "/accounts/banks", category: "homePage" },
    //     { id: "socials", label: "Socials Account", path: "/accounts/socials", category: "homePage" },
    //   ],
    // },
    // { id: "bills", label: "Bills", path: "/bills", category: "homePage" },
    // { id: "liabilities", label: "Liabilities", path: "/liabilities", category: "homePage" },
    // { id: "transactions", label: "Transactions", path: "/transaction", category: "homePage" },
  ];
  