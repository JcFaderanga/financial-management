import supabase from "@/lib/supabase";

export async function fetchMonthlyCashflow(ownerId: string) {
  const { data, error } = await supabase.rpc("get_monthly_cashflow", {
    user_id: ownerId,
  });

  if (error) {
    console.error("Failed to fetch monthly cashflow:", error);
    throw error;
  }

  return data;
}
