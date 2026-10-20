import { AccountType } from "@/types/AccountTypes";

export class BankAccount{
    private data: AccountType[] | null | undefined;

    constructor(data: AccountType[] | null | undefined){
        this.data = data;
    }

    getAvailableBalance(){
        const total = this.data?.reduce((sum, acc)=>{
           return sum += acc?.amount;
        },0)

        return total;
    }

    getPercent(accountAmount: number):string{
       const balance = this.getAvailableBalance();

        let percent = 0 ;
        if(balance){
            percent = (Number(accountAmount) / balance ) * 100;
        }
   
       return percent.toFixed(2);
    }
}

