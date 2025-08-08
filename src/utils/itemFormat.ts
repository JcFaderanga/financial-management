import { itemTypes } from "@/types/itemTypes";
import {
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns'

type GroupedItem = {
  type: string;
  price: number;
  exclude: boolean;
};

export class CategoryAndPrice {
    data: itemTypes[];

    constructor(data: itemTypes[]){
        this.data = data;
    }    

    /**
     * this function summarize data by grouping there category and sum all price 
     * This return object
     * Ex. { Food: 80, Transport: 50 }
    **/
    grouped(): Record<string, number> {

         const grouped = this.data?.reduce<Record<string, number>>((acc, item) => {

            //check if both category and price in not empty, udefine or null
            if (!item.category || item.price == null) return acc;

            const category = item.category;
            const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;

            //create object {Food: 80, Transport: 50 }
            acc[category] = (acc[category] || 0) + price;
            return acc;
            }, {});
        return grouped;
    }

   /**
    * this function create new array
    * This return array
    * Ex.[
            {type: 'Staycation', price: 1380, exclude: false},
            {type: 'Food', price: 1698, exclude: false}
        ]
    **/
    groupToArray(): GroupedItem[]{
        const data = this.grouped();

        const result: any  = Object.entries( data || {}).map(([type, price]) => ({
            type,
            price: Number(price),
            exclude: false,
        }));
        return result; 
    }

}


export function CalulateTotal(data: itemTypes[]){
    return data?.reduce((sum: number, item: itemTypes) => sum + Number(item.price), 0) || 0;
}

//Calc total by day and by month
export class TotalPerDayAndMonth{
    private data: itemTypes[];
    private monthStart: Date;
    private monthEnd: Date;

    constructor(data : itemTypes[], month: Date | string){
        this.data = data;
        const now = new Date(month);
        this.monthStart = startOfMonth(now)
        this.monthEnd = endOfMonth(now)
    } 

    /**
    * this function format date from 2025-08-01 04:53:29.122000+00 to 2025-08-01(yyyy-mm-dd)
    * This return object with primative value
    * Ex. return {2025-08-01, 2025-08-01}
    * first one return Date type second return String type
    **/
     getDateOnly(item: itemTypes){
        const dateOnly: string = format(item.created_at, 'yyyy-MM-dd')
        const date: Date = new Date(dateOnly)

        return {date,dateOnly};
    }

    /**
    * this function compute total for month and per day
    * This return object with primative value
    * Ex. {200, 1900}
    **/
    private getTotals(){
        const totalsByDate: Record<string, number> = {};
        let monthTotal:number = 0;

        this.data?.forEach((item: any) => {
            const {date,dateOnly} = this.getDateOnly(item);

            if (date >= this.monthStart && date <= this.monthEnd) {
                if (!totalsByDate[dateOnly]) totalsByDate[dateOnly] = 0;
                totalsByDate[dateOnly] += item.price
                monthTotal += item.price
            }
        })

        return{monthTotal, totalsByDate};
    }

    /**
    * this return total amount by day
    **/
    getTotalPerDay(){
        const {totalsByDate} = this.getTotals()
        return totalsByDate;
    }

    /**
    * this return average speding per day
    **/
    getDailySpentAverage() {
        const { totalsByDate } = this.getTotals();
        return Number(calculateSmartAverage(totalsByDate));
        
    }


    /**
    * this return total amount by month
    **/
    getTotalPerMonth(){
        const {monthTotal} = this.getTotals()
        return monthTotal;
    }

}

export function calculateSmartAverage(spendingData: Record<string, number>): Number | number[] {
  const values = Object.values(spendingData);
  if (values.length === 1) return values;
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const median = (sorted[Math.floor(values.length / 2)] + sorted[Math.ceil(values.length / 2)]) / 2;

  // Define outlier as anything > 3x the median
  const filtered = values.filter(value => value <= median * 3);
  const average = filtered.reduce((a, b) => a + b, 0) / filtered.length;

  return average;
}
