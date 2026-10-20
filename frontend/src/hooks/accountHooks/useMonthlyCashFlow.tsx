import supabase from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import { startOfMonth, endOfMonth } from "date-fns";

//import { TotalPerDayAndMonth } from '@/utils/itemFormat'
import { useThisMonth } from '@/store/useCalendarStore'

//import { useAllSpendingData } from '@/store/useSpendingStore'
import { getMonthAndYear } from '@/utils/DateFormat'
import { TransactionInfoType } from "@/types/AccountTypes";

const useMonthlyCashFlow = () => {

 // const {allSpentData: data} = useAllSpendingData();
  const { user } = useUserStore();
  const {currentMonth} = useThisMonth();
  
  async function getTransactionHistory(month: string) {
    if (!user?.id) {
      return { error: "User not authenticated", success: false };
    }

    function parseMonthYear(monthYear: string): Date {
      const [month, year] = monthYear.split("-").map(Number);

      if (!month || !year) {
        throw new Error("Invalid month format. Expected MM-YYYY");
      }

      // JS months are 0-based
      return new Date(year, month - 1, 1);
    }

    const parsedDate = parseMonthYear(month);

    const start = startOfMonth(parsedDate).toISOString();
    const end = endOfMonth(parsedDate).toISOString();

    const { data, error } = await supabase
      .from("transaction")
      .select("transaction_type, transaction_detail, created_at")
      .eq("owner", user.id)
      .gte("created_at", start)
      .lte("created_at", end);

    if (error) return { error, success: false };

    const enrichedData = await Promise.all(
        data.map(async (d: any) => {
            if (!d.transaction_detail?.item_id) return d;

            const { data: itemData, error } = await supabase
                .from("items")
                .select("*")
                .eq("id", d.transaction_detail.item_id)
                .single();

            if (error) return d;

            return {
                ...d,
                transaction_detail: {
                    ...d.transaction_detail,
                    item_details: itemData,
                },
            };
        })
    );

    return { data: enrichedData, success: true };
  }

  function computeSpendingActivity(transaction_data: any){

    console.log("Compute", transaction_data)
    const total = transaction_data?.reduce((sum: number, data: TransactionInfoType)=>{
     
      if(
        data.transaction_type === 'activity' &&
        data.transaction_detail?.item_id
      ){
        sum += Number(data.transaction_detail?.item_details?.price);
      }
      return sum
    }, 0)

    return total

  }

  async function GenerateMonthlyCashFlow() {
    const transaction_data = await getTransactionHistory(getMonthAndYear(currentMonth));
    const monthly_spent = computeSpendingActivity(transaction_data?.data);

    console.log("monthly_spent",monthly_spent)
    //const dataResult = new TotalPerDayAndMonth( data, currentMonth );
    //const monthlyOutGoing = dataResult.getTotalPerMonth()

    const monthly_starting_balance = 
      transaction_data?.data && 
      transaction_data?.data?.length < 1 &&
      transaction_data?.data?.[0]?.transaction_detail?.available_balance
    || 0;

    const monthly_last_balance = 
      transaction_data?.data && 
      transaction_data?.data?.[transaction_data?.data.length - 1]?.transaction_detail?.new_available_balance
    || 0;
    
    console.log("monthly_starting_balance",transaction_data?.data?.length)
    console.log("monthly_last_balance",transaction_data?.data?.[transaction_data?.data.length - 1]?.transaction_detail?.new_available_balance)
    
    const flowResult = {
      saved:  monthly_starting_balance < monthly_last_balance ? monthly_last_balance - monthly_starting_balance: 0,
      outFlow: monthly_spent,
    }

    return flowResult;
  }
  return {GenerateMonthlyCashFlow}
};

export default useMonthlyCashFlow;

























// const useMonthlyCashFlow = () => {
//   const { user } = useUserStore();
//   const {account} = useAccountStore();

//   async function getTransactionHistory(month: string) {
//     if (!user?.id) {
//       return { error: "User not authenticated", success: false };
//     }

//     function parseMonthYear(monthYear: string): Date {
//       const [month, year] = monthYear.split("-").map(Number);

//       if (!month || !year) {
//         throw new Error("Invalid month format. Expected MM-YYYY");
//       }

//       // JS months are 0-based
//       return new Date(year, month - 1, 1);
//     }

//     const parsedDate = parseMonthYear(month);

//     const start = startOfMonth(parsedDate).toISOString();
//     const end = endOfMonth(parsedDate).toISOString();

//     const { data, error } = await supabase
//       .from("transaction")
//       .select("transaction_detail, created_at")
//       .eq("owner", user.id)
//       .gte("created_at", start)
//       .lte("created_at", end);

//     if (error) return { error, success: false };

//     return { data, success: true };
//   }

//   async function GenerateMonthlyCashFlow(month: string) {
//     const transaction_data = await getTransactionHistory(month);

//     if (!transaction_data.success) {
//       return transaction_data.error;
//     }
    
//     if(!account || account.length < 0) return;
//     const balance: number[] = 
//       transaction_data?.data?.map((data: any) => data.transaction_detail.available_balance)
//     || [];

//     const monthly_starting_balance = 
//       transaction_data.data && 
//       transaction_data?.data?.[0]?.transaction_detail?.available_balance
//     || 0;

//      const monthly_last_balance = 
//       transaction_data.data && 
//       transaction_data?.data?.[transaction_data?.data.length - 1]?.transaction_detail?.available_balance
//     || 0;

//     const highest_balance = Math.max(...balance)

//     // --- Get over all available balance, total of all bank accounts balance ---
//     const bankData = new BankAccount(account);
//     const current_balance = bankData.getAvailableBalance() ?? 0;

//     /*
//     NOTE:
//     highest_balance - to track the highest amount entered on the selected month

//     monthly_starting_balance - to track the current balance before the other month started
//       ex. Jan. 31 or 30 (last day of the month) is 2,000 
//           starting Feb 1 or on the very first transaction on Feb the tracking balance is 2,000
//           since user have an available balance of 2,000 when month Feb started

//     current_balance - active balance or the actual balance that the user have on wallet

//     outFlow - to track how much money user spent during the selected month on the analytics calendar
//       - HOW COMPUTATION WORK? 
//           get balance of the user when month started (monthly_starting_balance)

//     First bal - 1000 | lowest balance
//     2nd entry - 500 | balance: 1500 | highest balance
//     3rd "" - -200 | balance: 1300
//     last bal - 1300

//     */
//     const flowResult = {
//       saved: monthly_starting_balance - monthly_last_balance,
//       outFlow: current_balance < highest_balance ? highest_balance - current_balance : 0,
//     }

//     return flowResult;
//   }

//   return { GenerateMonthlyCashFlow };
// };

// export default useMonthlyCashFlow;
