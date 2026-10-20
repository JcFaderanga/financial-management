import supabase from "@/lib/supabase";
import { AccountType } from "@/types/AccountTypes";
import { TransactionInfoType } from "@/types/AccountTypes";

export async function Search( payment_code: string|undefined, search: string, userID: string) {
const {data, error} = await supabase
    .from("items")
    .select("*")
    .eq('owner', userID)
    .eq('mode_of_payment', payment_code)
    .ilike('title', `%${search}%`)

if(error) throw new Error(error.message)
return data;
}


export class AccountBalance{
    newAccountBalanceData: AccountType;
    constructor(newAccountData: AccountType){
        this.newAccountBalanceData = newAccountData;
    }

    private query(){
        return supabase.from('accounts') 
    }

    async useDeposit(){
        const {error, data} = await
        this.query().insert(this.newAccountBalanceData)
            .select()
            .maybeSingle();
        return {error, data};
    }

    async useUpdateBalance(currentAccount: AccountType){
        const {error} = await 
        this.query().update(this.newAccountBalanceData)
            .eq('account_code', currentAccount.account_code)
            .eq('account_owner', currentAccount.account_owner)
        return {error};
    }
}

export async function UpdateAmount(
    transaction: TransactionInfoType,
    currentAccount: AccountType,
    newAmount: string | number
){

    const {error: amtUpdateError} = await supabase
        .from('accounts')
        .update({ ...currentAccount, amount: newAmount || currentAccount?.amount})
        .eq('account_code', currentAccount.account_code)
        .eq('account_owner', currentAccount.account_owner )

    if(amtUpdateError) return {error: amtUpdateError};

    const {error: transactionUpdateError} = await supabase
        .from('transaction')
        .insert(transaction)
    
    if(transactionUpdateError) return {error: transactionUpdateError};
    
    
}