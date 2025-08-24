import type { NavType } from "@/types/NavigationTypes";
export const navItems: NavType[] = [

    { id: "records", label: "Records", path: "/records", category: "homePage" },
    { id: "analytics", label: "Analytics", path: "/analytics", category: "homePage" },
    { id: "wallet", label: "Wallet", path: "/wallet", category: "homePage" },
    { id: "more", label: "More", path: "/more", category: "homePage" },
    // { 
    //   id: "dashboard",
    //   label: "Dashboard",
    //   path: "/dashboard",
    //   category: "homePage",
    //   children: [
    //     { id: "overview", label: "Overview", path: "/dashboard/overview", category: "homePage" },
    //     { id: "spendingCalendar", label: "Spending Analysis", path: "/dashboard/spending_analysis", category: "homePage" },
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
  