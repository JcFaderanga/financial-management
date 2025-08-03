import { itemTypes } from "@/types/itemTypes";

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

    //this function summarize data by grouping there category and sum all price 
    //This return object
    //Ex. { Food: 80, Transport: 50 }
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

    //this function create new array
    //This return array
    /**Ex.[
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