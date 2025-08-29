import supabase from "@/lib/supabase";


    export function query() {
       return supabase.from("items");
    }

    export async function Search( payment_code: string|undefined, search: string) {
 
    const {data, error} = await query()
        .select("*")
        .eq('mode_of_payment', payment_code)
        .ilike('title', `%${search}%`)

    if(error) throw new Error(error.message)
    return data;
    }

